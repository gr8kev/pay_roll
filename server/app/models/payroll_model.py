from datetime import datetime, timezone

def payroll_schema(data, personnel_list, total_amount):
    """Schema for payroll records"""
    current_time = datetime.now(timezone.utc)
    
    return {
        "month": data.get("month"),  
        "year": data.get("year"),    
        "personnel": personnel_list,
        "totalAmount": float(total_amount),
        "status": data.get("status", "pending"),
        "approvedBy": data.get("approvedBy"),
        "approvedAt": None,
        "createdBy": data.get("createdBy", "Admin"),
        "createdAt": current_time,
        "updatedAt": current_time,
        "notes": data.get("notes", "")
    }

def payroll_personnel_item(soldier):
    """Individual personnel item in payroll"""
    return {
        "_id": str(soldier.get("_id")),
        "firstName": soldier.get("firstName"),
        "lastName": soldier.get("lastName"),
        "rank": soldier.get("rank"),
        "serviceNumber": soldier.get("serviceNumber"),
        "unit": soldier.get("unit"),
        "corps": soldier.get("corps"),
        "bankName": soldier.get("bankName"),
        "accountNumber": soldier.get("accountNumber"),
        
        # Salary breakdown
        "salary": soldier.get("salary", {}),
        "deductions": soldier.get("deductions", {}),
        "totalEarnings": soldier.get("totalEarnings", 0),
        "totalDeductions": soldier.get("totalDeductions", 0),
        "netPay": soldier.get("netPay", 0),
        
        "status": soldier.get("status", "active")
    }