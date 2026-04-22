import React, { useState } from 'react';
import { predictFertilizer } from '../services/api';
import { Sprout, Loader2 } from 'lucide-react';

const availableCropTypes = [
    'Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy', 'Barley', 'Wheat',
    'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts'
];

const availableSoilTypes = [
    'Sandy', 'Loamy', 'Black', 'Red', 'Clayey'
];

const FertilizerRecommendation = () => {
    const [formData, setFormData] = useState({
        temperature: '',
        humidity: '',
        moisture: '',
        soil_type: availableSoilTypes[0],
        crop_type: availableCropTypes[0],
        nitrogen: '',
        potassium: '',
        phosphorus: ''
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        // Convert strings to floats for numerical inputs
        const processedData = {
            temperature: parseFloat(formData.temperature),
            humidity: parseFloat(formData.humidity),
            moisture: parseFloat(formData.moisture),
            soil_type: formData.soil_type,
            crop_type: formData.crop_type,
            nitrogen: parseFloat(formData.nitrogen),
            potassium: parseFloat(formData.potassium),
            phosphorus: parseFloat(formData.phosphorus)
        };

        try {
            const response = await predictFertilizer(processedData);
            setResult(response.recommended_fertilizer);
        } catch (err) {
            setError(err.detail || "Failed to get recommendation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container section animate-fade-in">
            <div className="text-center" style={{ marginBottom: '40px' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Sprout color="var(--primary-color)" /> Fertilizer Recommendation
                </h1>
                <p className="hero-subtitle">Enter soil parameters and crop details to receive tailored fertilizer recommendations.</p>
            </div>

            <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600' }}>Temperature (°C)</label>
                        <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600' }}>Humidity (%)</label>
                        <input type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600' }}>Moisture (%)</label>
                        <input type="number" step="0.1" name="moisture" value={formData.moisture} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600' }}>Soil Type</label>
                        <select name="soil_type" value={formData.soil_type} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'white' }}>
                            {availableSoilTypes.map(soil => (
                                <option key={soil} value={soil}>{soil}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600' }}>Crop Type</label>
                        <select name="crop_type" value={formData.crop_type} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'white' }}>
                            {availableCropTypes.map(crop => (
                                <option key={crop} value={crop}>{crop}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600' }}>Nitrogen (N)</label>
                        <input type="number" step="0.1" name="nitrogen" value={formData.nitrogen} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600' }}>Phosphorus (P)</label>
                        <input type="number" step="0.1" name="phosphorus" value={formData.phosphorus} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600' }}>Potassium (K)</label>
                        <input type="number" step="0.1" name="potassium" value={formData.potassium} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                    </div>

                    <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1.2rem' }}>
                            {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : "Predict Best Fertilizer"}
                        </button>
                    </div>
                </form>

                {error && (
                    <div style={{ marginTop: '20px', padding: '15px', background: '#ffebee', color: '#c62828', borderRadius: '8px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                {result && (
                    <div className="animate-fade-in" style={{ marginTop: '30px', padding: '30px', background: 'rgba(76, 175, 80, 0.1)', border: '2px solid var(--primary-color)', borderRadius: '12px', textAlign: 'center' }}>
                        <h2 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>Recommended Fertilizer</h2>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)', textTransform: 'capitalize' }}>
                            {result}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FertilizerRecommendation;
