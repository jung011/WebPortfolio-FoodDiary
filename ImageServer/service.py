# FileService.py

from config import FILE_PATH, FILE_URL
import os
import uuid
from fastapi import HTTPException
from fastapi.responses import FileResponse

class FileService:

    def upload(self, file):
        if file is None:
            raise HTTPException(status_code=400, detail="No file uploaded")

        original_filename = file.filename
        extension = original_filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{extension}"
        file_path = os.path.join(FILE_PATH, unique_filename)

        # 파일 저장
        try:
            with open(file_path, "wb") as f:
                f.write(file.file.read())
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to save the file")

        # 저장된 파일 URL 생성
        file_url = f"{FILE_URL}{unique_filename}"

        return file_url

    def get_image(self, file_name: str):
        file_path = os.path.join(FILE_PATH, file_name)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")

        return FileResponse(file_path)
