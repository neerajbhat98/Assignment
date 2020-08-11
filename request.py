import requests
r = requests.get('https://localhost:5001/SQLHandler/Bond')
print(r.text)