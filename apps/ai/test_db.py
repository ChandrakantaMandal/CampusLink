import requests

url = "http://localhost:3000/api/jobs"

response = requests.get(url)

print("Status:", response.status_code)

response.raise_for_status()

data = response.json()

print("\nDB DATA:")
print(data)