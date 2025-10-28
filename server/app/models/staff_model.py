from datetime import datetime, timezone

def soldier_schema(data):
    current_time = datetime.now(timezone.utc)  

    return {
        # Basic Info
        "firstName": data.get("firstName"),
        "lastName": data.get("lastName"),
        "rank": data.get("rank"),
        "serviceNumber": data.get("serviceNumber"),
        "department": data.get("department"),
        "corps": data.get("corps"),
        
        # Bank Details
        "bankName": data.get("bankName"),
        "accountNumber": data.get("accountNumber"),
        
        # Salary Components (Earnings) - Just store the values
        "salary": {
            "conafss": float(data.get("conafss", 0)),
            "staffGrant": float(data.get("staffGrant", 0)),
            "specialForcesAllowance": float(data.get("specialForcesAllowance", 0)),
            "packingAllowance": float(data.get("packingAllowance", 0)),
        },
        
        # Deductions - Just store the values
        "deductions": {
            "electricityBill": float(data.get("electricityBill", 0)),
            "waterRate": float(data.get("waterRate", 0)),
            "newisDeduction": float(data.get("newisDeduction", 0)),
            "benevolent": float(data.get("benevolent", 0)),
            "quarterRental": float(data.get("quarterRental", 0)),
            "incomeTax": float(data.get("incomeTax", 0)),
        },
        
        # Status & Metadata
        "status": data.get("status", "active"),
        "passport": data.get("passport"),
        "createdBy": data.get("createdBy"),
        "createdAt": current_time,
        "updatedAt": current_time,
    }