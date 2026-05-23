from fastapi import FastAPI, UploadFile, File
from app.service.gemini_service import extract_receipt_data
app = FastAPI()


@app.get("/")
def home():
    return {"message": "AI Service Running"}


@app.post("/extract")
async def extract_receipt(
    receipt: UploadFile = File(...)
):
    
    image_data = await receipt.read()

    extracted_data = await extract_receipt_data(
        image_data
    )

    return extracted_data