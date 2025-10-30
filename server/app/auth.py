from flask import Blueprint, request, jsonify
import bcrypt
from flask_jwt_extended import create_access_token
from datetime import datetime, timedelta
from app import mongo

auth = Blueprint('auth', __name__)

# ---------------------- SIGNUP ----------------------
@auth.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"msg": "Missing JSON in request"}), 400

        # Extract fields
        full_name = data.get('fullName')
        rank = data.get('rank')
        service_number = data.get('serviceNumber')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')
        profile_picture = data.get('profilePicture', '')  

        if not all([full_name, rank, service_number, email, password, confirm_password]):
            return jsonify({"error": "All required fields must be filled"}), 400

        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400

        existing_user = mongo.db.users.find_one({"email": email})
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 409

        existing_service_number = mongo.db.users.find_one({"serviceNumber": service_number})
        if existing_service_number:
            return jsonify({"error": "Service number already registered"}), 409

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user_data = {
            "fullName": full_name,
            "rank": rank,
            "serviceNumber": service_number,
            "email": email,
            "password": hashed_password.decode('utf-8'),
            "profilePicture": profile_picture,  
            "createdAt": datetime.utcnow()
        }

        mongo.db.users.insert_one(user_data)

        access_token = create_access_token(
            identity=service_number,
            expires_delta=timedelta(days=7)
        )

        return jsonify({
            "msg": "User created successfully",
            "access_token": access_token,
            "user": {
                "fullName": full_name,
                "rank": rank,
                "serviceNumber": service_number,
                "profilePicture": profile_picture
            }
        }), 201

    except Exception as e:
        return jsonify({"msg": "Error during signup", "error": str(e)}), 500


# ---------------------- LOGIN ----------------------
@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"msg": "Missing JSON in request"}), 400

        service_number = data.get('serviceNumber')
        password = data.get('password')

        if not service_number or not password:
            return jsonify({"msg": "Missing service number or password"}), 400

        user = mongo.db.users.find_one({"serviceNumber": service_number})
        if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({"msg": "Invalid service number or password"}), 401

        access_token = create_access_token(
            identity=service_number,
            expires_delta=timedelta(days=7)
        )
        
        return jsonify({
            "msg": "Login successful",
            "access_token": access_token,
            "fullName": user.get("fullName"),
            "rank": user.get("rank"),
            "serviceNumber": user.get("serviceNumber"),
            "profilePicture": user.get("profilePicture", "")  
        }), 200

    except Exception as e:
        return jsonify({"msg": "Error during login", "error": str(e)}), 500