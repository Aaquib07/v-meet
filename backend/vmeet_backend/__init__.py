# Contains the flask code wirth our REST API that would be needed by our frontend
import os
import requests

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Metered secret key
METERED_SECRET_KEY = os.environ.get('METERED_SECRET_KEY')
# Metered domain
METERED_DOMAIN = os.environ.get('METERED_DOMAIN')


# Route to create a new meeting room
@app.route('/api/create-room', methods=['POST'])
def create_meeting_room():
    response = requests.post(f'https://{METERED_DOMAIN}/api/v1/room?secretKey={METERED_SECRET_KEY}')
    return response.json()

# Route to validate the meeting
@app.route('/api/validate-meeting')
def validate_meeting():
    # We try to get room name from request arguments
    room_name = requests.args.get('roomName')
    # If the user provides a room name, we create a new room with
    # the provided room name
    if room_name:
        response = requests.get(f'https://{METERED_DOMAIN}/api/v1/room?secretKey={METERED_SECRET_KEY}')
        json_data = response.json()
        if json_data.get('roomName'):
            return {'roomFound': True}
        else:
            return {'roomFound': False}
    # If the user does not provide the room name, we pass a message to
    # the user to provide a room name
    else:
        return {
            'success': False,
            'message': 'Please provide a room name'
        }

# Route to fetch the Metered domain
@app.route('/api/fetch-domain')
def fetch_metered_domain():
    return {
        'METERED_DOMAIN': METERED_DOMAIN
    }

# Route for Index Page
@app.route('/')
def index():
    return 'Index page'