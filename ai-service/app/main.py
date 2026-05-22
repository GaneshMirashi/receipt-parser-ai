from fastapi import FastAPI, UploadFile, File

app = FastAPI()


@app.get("/")
def home():
    return {"message": "AI Service Running"}


@app.post("/extract")
async def extract_receipt(
    receipt: UploadFile = File(...)
):
    return {
        "filename": receipt.filename,
        "content_type": receipt.content_type
    }