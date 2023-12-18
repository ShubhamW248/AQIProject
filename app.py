from flask import Flask, request, jsonify, send_from_directory
from joblib import load
from flask_cors import CORS
import os

app = Flask(__name__, static_url_path='', static_folder='')
CORS(app)


# Load the pre-trained model
model = load('C:/AQI/AQIProject/RM2.joblib')

@app.route('/predict', methods=['POST'])
def predict_aqi():
    try:
        # Get parameters from the JSON data sent by the JavaScript
        data = request.json

        # Make a prediction using the pre-trained model
        predicted_aqi = model.predict([data])[0]

        # Determine the AQI bucket based on the predicted value
        result = get_aqi_bucket(predicted_aqi)

        # Return the predicted AQI and result as JSON
        response_data = {'predicted_aqi': predicted_aqi, 'result': result}
        return jsonify(response_data)

    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': 'Invalid input parameters'}), 400

@app.route('/')
def index():
    # Serve the index.html file from the same directory as 'app.py'
    return send_from_directory(os.path.dirname(os.path.abspath(__file__)), 'index.html')

def get_aqi_bucket(predicted_aqi):
    # Your existing code for determining AQI bucket
    if 13 <= predicted_aqi <= 50:
        return "Good"
    elif 51 <= predicted_aqi <= 100:
        return "Satisfactory"
    elif 101 <= predicted_aqi <= 200:
        return "Moderate"
    elif 201 <= predicted_aqi <= 300:
        return "Poor"
    elif 301 <= predicted_aqi <= 400:
        return "Very Poor"
    elif 401 <= predicted_aqi <= 2049:
        return "Severe"
    else:
        return "Out of Range"

if __name__ == '__main__':
    app.run(debug=True)
