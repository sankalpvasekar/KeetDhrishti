from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from services.cnn_predictor import predict_insect
from services.insect_info_llm import get_insect_details

app = FastAPI(title="KeetDhrishti API", version="1.0.0")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development; adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "KeetDhrishti Insect Classifier API is running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predict insect from uploaded image
    Returns: {
        "insect_name": str,
        "confidence": float,
        "details": str
    }
    """
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Generate unique temp filename
    import uuid
    temp_filename = f"{uuid.uuid4()}.jpg"
    temp_path = os.path.join(UPLOAD_DIR, temp_filename)

    # Save uploaded file
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to save file: {str(e)}")

    try:
        # 1. CNN prediction
        insect_name, confidence = predict_insect(temp_path)

        # 2. Get detailed information from LLM (Groq)
        llm_info = get_insect_details(insect_name)

        # 3. Cleanup: Remove temporary image file
        if os.path.exists(temp_path):
            os.remove(temp_path)

        # 4. Return combined JSON response
        return {
            "insect_name": insect_name,
            "confidence": confidence,
            "details": llm_info
        }
    except Exception as e:
        # Cleanup on error too
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Prediction flow failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Using port 8000 as configured in the frontend api.js
    uvicorn.run(app, host="0.0.0.0", port=8000)
