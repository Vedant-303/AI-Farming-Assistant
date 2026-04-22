import httpx
import asyncio

async def test():
    lat, lon = 18.62, 73.74
    url = f"https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={lat}&longitude={lon}&localityLanguage=en"
    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(url, timeout=10.0)
            print(f"Status: {response.status_code}")
            print(f"Data: {response.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test())
