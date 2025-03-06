# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers import router as file_router

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인에서 접근 허용
    allow_credentials=True,  # 자격 증명 허용 (예: 쿠키, Authorization 헤더 등)
    allow_methods=["*"],  # 모든 HTTP 메서드 허용 (GET, POST 등)
    allow_headers=["*"],  # 모든 헤더 허용
)

# 라우터 등록
app.include_router(file_router, prefix="/file", tags=["file"]) #@RequestMapping("/file")