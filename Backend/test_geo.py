import httpx
import asyncio

async def test():
    lat, lon = 18.62, 73.74
    url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json&addressdetails=1"
    headers = {"User-Agent": "AgriSens/1.0 (vedant@example.com)"}
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, timeout=10.0)
            print(f"Status: {response.status_code}")
            print(f"Data: {response.text[:200]}")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test())
