import os
import pickle
import numpy as np
import random
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from io import BytesIO
from PIL import Image

try:
    import tensorflow as tf
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False
    print("WARNING: TensorFlow not found. Running Disease endpoint in MOCK mode.")

app = FastAPI(title="AgriSens API", version="1.0.0")

# Enable CORS for the Vite React App
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
rf_model_path = os.path.join(MODEL_DIR, "RF.pkl")
keras_model_path = os.path.join(MODEL_DIR, "trained_plant_disease_model.keras")

try:
    with open(rf_model_path, 'rb') as f:
        crop_model = pickle.load(f)
except Exception as e:
    print(f"Warning: Failed to load Crop Model: {e}. Will run in MOCK mode.")
    crop_model = None

# Fertilizer Models  
fertilizer_model_path = os.path.join(MODEL_DIR, "fertilizer_model.pkl")
fertilizer_soil_enc_path = os.path.join(MODEL_DIR, "fertilizer_soil_encoder.pkl")
fertilizer_crop_enc_path = os.path.join(MODEL_DIR, "fertilizer_crop_encoder.pkl")

try:
    with open(fertilizer_model_path, 'rb') as f:
        fertilizer_model = pickle.load(f)
    with open(fertilizer_soil_enc_path, 'rb') as f:
        fertilizer_soil_enc = pickle.load(f)
    with open(fertilizer_crop_enc_path, 'rb') as f:
        fertilizer_crop_enc = pickle.load(f)
except Exception as e:
    print(f"Warning: Failed to load Fertilizer Model: {e}. Will run in MOCK mode.")
    fertilizer_model = None
    fertilizer_soil_enc = None
    fertilizer_crop_enc = None

try:
    if TF_AVAILABLE:
        disease_model = tf.keras.models.load_model(keras_model_path)
    else:
        disease_model = None
except Exception as e:
    print(f"Warning: Failed to load Disease Model: {e}")
    disease_model = None


# Disease Classes
DISEASE_CLASSES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 
    'Cherry_(including_sour)___healthy', 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 
    'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 
    'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 
    'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot',
    'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy', 
    'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 
    'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot', 
    'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 
    'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

# Mock crop classes
MOCK_CROPS = ['rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate', 'banana', 'mango', 'grapes', 'watermelon', 'muskmelon', 'apple', 'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee']

class CropRequest(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class FertilizerRequest(BaseModel):
    temperature: float
    humidity: float
    moisture: float
    soil_type: str
    crop_type: str
    nitrogen: float
    potassium: float
    phosphorus: float

@app.get("/")
def read_root():
    return {"message": "Welcome to AgriSens API"}

@app.post("/api/predict/crop")
def predict_crop(req: CropRequest):
    try:
        if crop_model is None:
            # Deterministic mock based on input values
            seed_val = int(req.nitrogen + req.phosphorus + req.potassium)
            random.seed(seed_val)
            mock_res = {"recommended_crop": random.choice(MOCK_CROPS)}
            random.seed() # reset
            return mock_res
        
        features = np.array([[req.nitrogen, req.phosphorus, req.potassium, 
                              req.temperature, req.humidity, req.ph, req.rainfall]])
        prediction = crop_model.predict(features)
        return {"recommended_crop": prediction[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/fertilizer")
def predict_fertilizer(req: FertilizerRequest):
    try:
        if fertilizer_model is None or fertilizer_soil_enc is None or fertilizer_crop_enc is None:
            # Deterministic mock based on input values
            seed_val = int(req.nitrogen + req.phosphorus + req.potassium)
            random.seed(seed_val)
            mock_res = {"recommended_fertilizer": random.choice(["Urea", "DAP", "14-35-14", "28-28", "17-17-17", "20-20", "10-26-26"])}
            random.seed()
            return mock_res
        
        assert fertilizer_soil_enc is not None
        assert fertilizer_crop_enc is not None
        assert fertilizer_model is not None
        
        # Encode categorical inputs
        try:
            soil_encoded = fertilizer_soil_enc.transform([req.soil_type])[0]
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Unrecognized soil type: {req.soil_type}")
            
        try:
            crop_encoded = fertilizer_crop_enc.transform([req.crop_type])[0]
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Unrecognized crop type: {req.crop_type}")
            
        features = np.array([[req.temperature, req.humidity, req.moisture, 
                             soil_encoded, crop_encoded, req.nitrogen, req.potassium, req.phosphorus]])
        prediction = fertilizer_model.predict(features)
        return {"recommended_fertilizer": str(prediction[0])}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/disease")
async def predict_disease(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
        
    try:
        contents = await file.read()
        
        if disease_model is None or not TF_AVAILABLE:
            import hashlib
            # Deterministic mock based on stable MD5 hash of image bytes
            file_hash = int(hashlib.md5(contents).hexdigest(), 16)
            random.seed(file_hash)
            chosen_disease = random.choice(DISEASE_CLASSES)
            chosen_conf = random.uniform(0.7, 0.99)
            random.seed() # reset the global seed
            return {
                "disease_class": chosen_disease, 
                "confidence": chosen_conf
            }

        image = Image.open(BytesIO(contents)).convert("RGB")
        image = image.resize((128, 128))
        
        input_arr = tf.keras.preprocessing.image.img_to_array(image)
        input_arr = np.array([input_arr])  # Create batch
        
        # Explicitly assert disease_model is not None to satisfy IDE type checkers
        assert disease_model is not None
        predictions = disease_model.predict(input_arr)
        result_index = np.argmax(predictions)
        
        return {"disease_class": DISEASE_CLASSES[result_index], "confidence": float(predictions[0][result_index])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/weather")
async def get_weather(lat: float, lon: float):
    # Free Open-Meteo API that doesn't need an API key
    # Fetches current weather & 7 days of daily forecast (max/min temp, precipitation, weathercode)
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,wind_speed_10m,weather_code,relative_humidity_2m,precipitation"
        f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code"
        f"&timezone=auto"
    )
    
    import httpx
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            return data
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Error proxying Open-Meteo: {exc}")
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=f"Open-Meteo returned error: {exc}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/geocode")
async def get_coordinates(query: str):
    # Proxy to Open-Meteo Geocoding
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={query}&count=5&language=en&format=json"
    
    import httpx
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            # Simple check if results exist
            if "results" not in data or len(data["results"]) == 0:
                raise HTTPException(status_code=404, detail="Location not found")
                
            return data["results"]
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Geocoding Error: {exc}")
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=f"Geocoding Error: {exc}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
