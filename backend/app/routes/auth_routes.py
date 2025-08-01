from flask import Blueprint, request, jsonify
from app.models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from google.oauth2 import id_token
from google.auth.transport import requests as grequests

auth_bp = Blueprint('auth_bp', __name__)

# Register with email & password
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already taken'}), 409

    hashed_password = generate_password_hash(password)
    user = User(username=username, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        'message': 'User registered',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 201

# Login with email & password
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user.password is None:
        return jsonify({"message": "This account was created using Google. Please use Google login."}), 400

    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    return jsonify({
        'message': 'Login successful',
        'success': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 200

# Google login with credential JWT
@auth_bp.route('/google-login', methods=['POST'])
def google_login():
   
    token = request.json.get("credential")
    if not token:
        return jsonify({'error': 'Missing Google credential token'}), 400

    try:
        CLIENT_ID = "1098681507359-nb9ia7pr1s0itmva86anpeafc7jp7ppb.apps.googleusercontent.com"
        idinfo = id_token.verify_oauth2_token(token, grequests.Request(), CLIENT_ID)

        google_id = idinfo['sub']
        email = idinfo['email']
        username = idinfo.get('name') or email.split('@')[0]

        user = User.query.filter_by(email=email).first()

        if not user:
            user = User(username=username, email=email, google_id=google_id)
            db.session.add(user)
            db.session.commit()

        return jsonify({
            'message': 'Google login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 200

    except ValueError as e:
     print("Token ValueError:", e)
     return jsonify({'error': 'Token validation failed'}), 401
    except Exception as e:
     print("Other error during Google login:", e)
     return jsonify({'error': 'Something went wrong'}), 500
