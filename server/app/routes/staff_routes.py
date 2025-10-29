# from flask import Blueprint, request, jsonify
# from bson import ObjectId
# from datetime import datetime, timezone

# from itsdangerous import Serializer
# from app.models.staff_model import soldier_schema
# from app import mongo  
# from app.utils import serialize_list, serialize_doc

# staff_routes = Blueprint("staff_routes", __name__)

# # ------------------------------
# # ➕ ADD SOLDIER
# # ------------------------------
# @staff_routes.route("/add-staff", methods=["POST"])
# def add_soldier():
#     try:
#         data = request.get_json()

#         # ✅ Make sure required fields are provided
#         required_fields = ["firstName", "lastName", "rank", "serviceNumber"]
#         if not all(field in data and data[field] for field in required_fields):
#             return jsonify({"error": "Missing required fields"}), 400

#         # ✅ Build soldier document using schema
#         soldier = soldier_schema(data)

#         # 🔍 Check if soldier with same serviceNumber already exists
#         existing = mongo.db.soldiers.find_one({"serviceNumber": soldier["serviceNumber"]})
#         if existing:
#             return jsonify({"error": "A soldier with this service number already exists"}), 400

#         # ✅ Insert into MongoDB
#         mongo.db.soldiers.insert_one(soldier)

#         return jsonify({
#             "message": "Personnel added successfully",
#             "data": serialize_doc(soldier)
#         }), 201

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# # ------------------------------
# # 📋 GET ALL SOLDIERS
# # ------------------------------
# @staff_routes.route("/staff", methods=["GET"])
# def get_all_soldiers():
#     soldiers = list(mongo.db.soldiers.find())
#     for soldier in soldiers:
#         soldier["_id"] = str(soldier["_id"])
#     return jsonify(serialize_list(soldiers)), 200


# # ------------------------------
# # 🔍 GET ONE SOLDIER PROFILE
# # ------------------------------
# @staff_routes.route("/staff/<id>", methods=["GET"])
# def get_soldier(id):
#     if not ObjectId.is_valid(id):
#         return jsonify({"error": "Invalid ID format"}), 400
        
#     soldier = mongo.db.soldiers.find_one({"_id": ObjectId(id)})
#     if not soldier:
#         return jsonify({"error": "Soldier not found"}), 404
#     soldier["_id"] = str(soldier["_id"])
#     return jsonify(serialize_doc(soldier)), 200


# # ------------------------------
# # ✏️ EDIT SOLDIER
# # ------------------------------
# @staff_routes.route("/staff/<id>", methods=["PUT"])
# def update_soldier(id):
#     try:
#         if not ObjectId.is_valid(id):
#             return jsonify({"error": "Invalid ID format"}), 400
            
#         data = request.get_json()
        
#         # ✅ Remove _id from the data if it exists
#         if '_id' in data:
#             del data['_id']
        
#         # Build update data with new structure
#         update_data = {
#             "firstName": data.get("firstName"),
#             "lastName": data.get("lastName"),
#             "rank": data.get("rank"),
#             "serviceNumber": data.get("serviceNumber"),
#             "department": data.get("department"),
#             "corps": data.get("corps"),
#             "bankName": data.get("bankName"),
#             "accountNumber": data.get("accountNumber"),
#             "passport": data.get("passport"),
#             "status": data.get("status"),
#             "updatedAt": datetime.now(timezone.utc)
#         }
        
#         # Handle salary components
#         if any(key in data for key in ["conafss", "staffGrant", "specialForcesAllowance", "packingAllowance"]):
#             update_data["salary"] = {
#                 "conafss": float(data.get("conafss", 0)),
#                 "staffGrant": float(data.get("staffGrant", 0)),
#                 "specialForcesAllowance": float(data.get("specialForcesAllowance", 0)),
#                 "packingAllowance": float(data.get("packingAllowance", 0)),
#             }
        
#         # Handle deductions
#         if any(key in data for key in ["electricityBill", "waterRate", "newisDeduction", "benevolent", "quarterRental", "incomeTax"]):
#             update_data["deductions"] = {
#                 "electricityBill": float(data.get("electricityBill", 0)),
#                 "waterRate": float(data.get("waterRate", 0)),
#                 "newisDeduction": float(data.get("newisDeduction", 0)),
#                 "benevolent": float(data.get("benevolent", 0)),
#                 "quarterRental": float(data.get("quarterRental", 0)),
#                 "incomeTax": float(data.get("incomeTax", 0)),
#             }
        
#         # Remove None values
#         update_data = {k: v for k, v in update_data.items() if v is not None}
        
#         # Update in database
#         result = mongo.db.soldiers.find_one_and_update(
#             {"_id": ObjectId(id)},
#             {"$set": update_data},
#             return_document=True
#         )
        
#         if not result:
#             return jsonify({"error": "Staff not found"}), 404
        
#         result['_id'] = str(result['_id'])
        
#         return jsonify({
#             "message": "Staff updated successfully",
#             "data": serialize_doc(result)
#         }), 200
        
#     except Exception as e:
#         print(f"Error updating staff: {str(e)}")
#         return jsonify({"error": str(e)}), 400

# # ------------------------------
# # 🗑️ DELETE SOLDIER
# # ------------------------------
# @staff_routes.route("/staff/<id>", methods=["DELETE"])
# def delete_soldier(id):
#     try:
#         if not ObjectId.is_valid(id):
#             return jsonify({"error": "Invalid ID format"}), 400
            
#         result = mongo.db.soldiers.delete_one({"_id": ObjectId(id)})
        
#         if result.deleted_count == 0:
#             return jsonify({"error": "Staff not found"}), 404
            
#         return jsonify({"message": "Staff deleted successfully"}), 200
        
#     except Exception as e:
#         print(f"Error deleting staff: {str(e)}")
#         return jsonify({"error": str(e)}), 400





from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime, timezone

from itsdangerous import Serializer
from app.models.staff_model import soldier_schema
from app import mongo  
from app.utils import serialize_list, serialize_doc

staff_routes = Blueprint("staff_routes", __name__)

# ------------------------------
# ➕ ADD SOLDIER
# ------------------------------
@staff_routes.route("/add-staff", methods=["POST"])
def add_soldier():
    try:
        data = request.get_json()

        # ✅ Make sure required fields are provided
        required_fields = ["firstName", "lastName", "rank", "serviceNumber"]
        if not all(field in data and data[field] for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # ✅ Build soldier document using schema
        soldier = soldier_schema(data)

        # 🔍 Check if soldier with same serviceNumber already exists
        existing = mongo.db.soldiers.find_one({"serviceNumber": soldier["serviceNumber"]})
        if existing:
            return jsonify({"error": "A soldier with this service number already exists"}), 400

        # ✅ Insert into MongoDB
        mongo.db.soldiers.insert_one(soldier)

        return jsonify({
            "message": "Personnel added successfully",
            "data": serialize_doc(soldier)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------------------
# 📋 GET ALL SOLDIERS
# ------------------------------
@staff_routes.route("/staff", methods=["GET"])
def get_all_soldiers():
    soldiers = list(mongo.db.soldiers.find())
    for soldier in soldiers:
        soldier["_id"] = str(soldier["_id"])
    return jsonify(serialize_list(soldiers)), 200


# ------------------------------
# 🔍 GET ONE SOLDIER PROFILE
# ------------------------------
@staff_routes.route("/staff/<id>", methods=["GET"])
def get_soldier(id):
    if not ObjectId.is_valid(id):
        return jsonify({"error": "Invalid ID format"}), 400
        
    soldier = mongo.db.soldiers.find_one({"_id": ObjectId(id)})
    if not soldier:
        return jsonify({"error": "Soldier not found"}), 404
    soldier["_id"] = str(soldier["_id"])
    return jsonify(serialize_doc(soldier)), 200


# ------------------------------
# 🔄 TOGGLE SOLDIER STATUS
# ------------------------------
@staff_routes.route("/staff/<id>/toggle-status", methods=["PATCH"])
def toggle_soldier_status(id):
    try:
        if not ObjectId.is_valid(id):
            return jsonify({"error": "Invalid ID format"}), 400
        
        # Get current soldier
        soldier = mongo.db.soldiers.find_one({"_id": ObjectId(id)})
        if not soldier:
            return jsonify({"error": "Personnel not found"}), 404
        
        # Toggle status
        current_status = soldier.get("status", "active")
        new_status = "inactive" if current_status == "active" else "active"
        
        # Update in database
        result = mongo.db.soldiers.find_one_and_update(
            {"_id": ObjectId(id)},
            {
                "$set": {
                    "status": new_status,
                    "updatedAt": datetime.now(timezone.utc)
                }
            },
            return_document=True
        )
        
        result['_id'] = str(result['_id'])
        
        return jsonify({
            "message": f"Personnel status changed to {new_status}",
            "data": serialize_doc(result)
        }), 200
        
    except Exception as e:
        print(f"Error toggling status: {str(e)}")
        return jsonify({"error": str(e)}), 400


# ------------------------------
# ✏️ EDIT SOLDIER
# ------------------------------
@staff_routes.route("/staff/<id>", methods=["PUT"])
def update_soldier(id):
    try:
        if not ObjectId.is_valid(id):
            return jsonify({"error": "Invalid ID format"}), 400
            
        data = request.get_json()
        
        # ✅ Remove _id from the data if it exists
        if '_id' in data:
            del data['_id']
        
        # Build update data with new structure
        update_data = {
            "firstName": data.get("firstName"),
            "lastName": data.get("lastName"),
            "rank": data.get("rank"),
            "serviceNumber": data.get("serviceNumber"),
            "unit": data.get("unit"),
            "corps": data.get("corps"),
            "bankName": data.get("bankName"),
            "accountNumber": data.get("accountNumber"),
            "passport": data.get("passport"),
            "status": data.get("status"),
            "updatedAt": datetime.now(timezone.utc)
        }
        
        # Handle salary components
        if any(key in data for key in ["conafss", "staffGrant", "specialForcesAllowance", "packingAllowance"]):
            update_data["salary"] = {
                "conafss": float(data.get("conafss", 0)),
                "staffGrant": float(data.get("staffGrant", 0)),
                "specialForcesAllowance": float(data.get("specialForcesAllowance", 0)),
                "packingAllowance": float(data.get("packingAllowance", 0)),
            }
        
        # Handle deductions
        if any(key in data for key in ["electricityBill", "waterRate", "nawisDeduction", "benevolent", "quarterRental", "incomeTax"]):
            update_data["deductions"] = {
                "electricityBill": float(data.get("electricityBill", 0)),
                "waterRate": float(data.get("waterRate", 0)),
                "nawisDeduction": float(data.get("nawisDeduction", 0)),
                "benevolent": float(data.get("benevolent", 0)),
                "quarterRental": float(data.get("quarterRental", 0)),
                "incomeTax": float(data.get("incomeTax", 0)),
            }
        
        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        # Update in database
        result = mongo.db.soldiers.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": update_data},
            return_document=True
        )
        
        if not result:
            return jsonify({"error": "Staff not found"}), 404
        
        result['_id'] = str(result['_id'])
        
        return jsonify({
            "message": "Staff updated successfully",
            "data": serialize_doc(result)
        }), 200
        
    except Exception as e:
        print(f"Error updating staff: {str(e)}")
        return jsonify({"error": str(e)}), 400

# ------------------------------
# 🗑️ DELETE SOLDIER
# ------------------------------
@staff_routes.route("/staff/<id>", methods=["DELETE"])
def delete_soldier(id):
    try:
        if not ObjectId.is_valid(id):
            return jsonify({"error": "Invalid ID format"}), 400
            
        result = mongo.db.soldiers.delete_one({"_id": ObjectId(id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Staff not found"}), 404
            
        return jsonify({"message": "Staff deleted successfully"}), 200
        
    except Exception as e:
        print(f"Error deleting staff: {str(e)}")
        return jsonify({"error": str(e)}), 400