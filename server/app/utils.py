from datetime import datetime
from bson import ObjectId

def serialize_doc(doc):
    """
    Convert MongoDB document to JSON-serializable dict.
    Converts ObjectId -> str and datetime -> ISO string.
    """
    serialized = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            serialized[key] = str(value)
        elif isinstance(value, datetime):
            serialized[key] = value.isoformat()
        else:
            serialized[key] = value
    return serialized


def serialize_list(docs):
    """
    Serialize list of MongoDB documents.
    """
    return [serialize_doc(doc) for doc in docs]
