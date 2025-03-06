# controllers.py

from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from fastapi.responses import FileResponse
from service import FileService # FileService 클래스 import
from config import FILE_PATH, FILE_URL
import os

router = APIRouter() #@RequestMapping("/file")

# FileService 인스턴스 생성
file_service = FileService() #private final FileService fileService;

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if file is None:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # 파일 업로드 메소드 호출
    file_url = file_service.upload(file)
    print(file_url)
    return file_url


@router.get("/{file_name}", response_class=FileResponse)
async def get_image(file_name: str):
    return file_service.get_image(file_name)
