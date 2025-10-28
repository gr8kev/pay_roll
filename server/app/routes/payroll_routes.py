from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from datetime import datetime, timezone
from app import mongo
from app.models.payroll_model import payroll_schema, payroll_personnel_item
from app.utils import serialize_list
import json

payroll_routes = Blueprint("payroll_routes", __name__)

# ------------------------------
# 🧹 SANITIZER — Prevent MongoDB 8-byte int overflow
# ------------------------------
def sanitize_for_mongo(obj):
    if isinstance(obj, dict):
        clean = {}
        for k, v in obj.items():
            if isinstance(v, (int, float)):
                # Remove infinity/nan and large numbers
                if not (float('-inf') < v < float('inf')):
                    clean[k] = 0
                elif abs(v) > 9_000_000_000_000_000_000:  # beyond 9e18
                    clean[k] = float(v)
                else:
                    clean[k] = v
            elif isinstance(v, str):
                # Convert numeric strings safely
                try:
                    num = float(v)
                    clean[k] = num if abs(num) < 9_000_000_000_000_000_000 else str(v)
                except ValueError:
                    clean[k] = v
            elif isinstance(v, list):
                clean[k] = [sanitize_for_mongo(i) for i in v]
            elif isinstance(v, dict):
                clean[k] = sanitize_for_mongo(v)
            else:
                clean[k] = v
        return clean
    return obj

# ------------------------------
# 📋 GET ACTIVE PERSONNEL FOR PAYROLL
# ------------------------------
@payroll_routes.route("/payroll/active-personnel", methods=["GET"])
def get_active_personnel():
    """
    Get all active personnel for payroll processing
    """
    try:
        # Fetch only active soldiers
        soldiers = list(mongo.db.soldiers.find({"status": "active"}))
        
        personnel_list = []
        total_amount = 0
        
        for soldier in soldiers:
            soldier['_id'] = str(soldier['_id'])
            personnel_item = payroll_personnel_item(soldier)
            personnel_list.append(personnel_item)
            total_amount += float(personnel_item.get('netPay', 0))
        
        return jsonify({
            "personnel": personnel_list,
            "totalAmount": float(total_amount),
            "count": len(personnel_list)
        }), 200
        
    except Exception as e:
        print(f"Error fetching active personnel: {str(e)}")
        return jsonify({"error": str(e)}), 400

# ------------------------------
# 💾 CREATE/APPROVE PAYROLL
# ------------------------------
@payroll_routes.route("/payroll/approve", methods=["POST"])
def approve_payroll():
    """
    Approve and save payroll to history
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get("month") or not data.get("year"):
            return jsonify({"error": "Month and year are required"}), 400
        
        if not data.get("personnel") or len(data.get("personnel", [])) == 0:
            return jsonify({"error": "No personnel data provided"}), 400
        
        # Check for existing payroll
        existing_payroll = mongo.db.payrolls.find_one({
            "month": data.get("month"),
            "year": data.get("year")
        })
        if existing_payroll:
            return jsonify({"error": f"Payroll for {data.get('month')} {data.get('year')} already exists"}), 400
        
        # Calculate total using netPay
        total_amount = sum([float(p.get("netPay", 0)) for p in data.get("personnel", [])])
        
        # Create payroll record
        payroll_data = payroll_schema(data, data.get("personnel"), total_amount)
        payroll_data["status"] = "approved"
        payroll_data["approvedBy"] = data.get("approvedBy", "Admin")
        payroll_data["approvedAt"] = datetime.now(timezone.utc)
        
        # ✅ Sanitize data before saving to Mongo
        payroll_data = sanitize_for_mongo(payroll_data)

        # Debug print (optional)
        print("---- Sanitized payroll data preview ----")
        print(json.dumps(payroll_data, indent=2, default=str))
        print("---------------------------------------")
        
        # Insert into DB
        result = mongo.db.payrolls.insert_one(payroll_data)
        payroll_data["_id"] = str(result.inserted_id)
        
        return jsonify({
            "message": "Payroll approved and saved successfully",
            "data": payroll_data
        }), 201
        
    except Exception as e:
        print(f"Error approving payroll: {str(e)}")
        return jsonify({"error": str(e)}), 400

# ------------------------------
# 📜 GET PAYROLL HISTORY
# ------------------------------
@payroll_routes.route("/payroll/history", methods=["GET"])
def get_payroll_history():
    try:
        limit = int(request.args.get("limit", 50))
        filter_query = {}
        
        year = request.args.get("year")
        status = request.args.get("status")
        if year:
            filter_query["year"] = int(year)
        if status:
            filter_query["status"] = status

        payrolls = list(mongo.db.payrolls.find(filter_query).limit(limit))
        payrolls.sort(key=lambda x: x.get('createdAt', ''), reverse=True)

        for payroll in payrolls:
            payroll['_id'] = str(payroll['_id'])

        return jsonify({
            "payrolls": payrolls,
            "total": len(payrolls),
            "page": 1,
            "limit": limit
        }), 200

    except Exception as e:
        print(f"Error fetching payroll history: {str(e)}")
        return jsonify({"error": str(e)}), 400

# ------------------------------
# 📄 GET SINGLE PAYROLL BY ID
# ------------------------------
@payroll_routes.route("/payroll/<id>", methods=["GET"])
def get_payroll_by_id(id):
    """
    Get a specific payroll record by ID
    """
    try:
        if not ObjectId.is_valid(id):
            return jsonify({"error": "Invalid ID format"}), 400
        
        payroll = mongo.db.payrolls.find_one({"_id": ObjectId(id)})
        
        if not payroll:
            return jsonify({"error": "Payroll not found"}), 404
        
        payroll['_id'] = str(payroll['_id'])
        return jsonify(payroll), 200
        
    except Exception as e:
        print(f"Error fetching payroll: {str(e)}")
        return jsonify({"error": str(e)}), 400

# ------------------------------
# 🗑️ DELETE PAYROLL
# ------------------------------
@payroll_routes.route("/payroll/<id>", methods=["DELETE"])
def delete_payroll(id):
    """
    Delete a payroll record (use with caution)
    """
    try:
        if not ObjectId.is_valid(id):
            return jsonify({"error": "Invalid ID format"}), 400
        
        result = mongo.db.payrolls.delete_one({"_id": ObjectId(id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Payroll not found"}), 404
        
        return jsonify({"message": "Payroll deleted successfully"}), 200
        
    except Exception as e:
        print(f"Error deleting payroll: {str(e)}")
        return jsonify({"error": str(e)}), 400
