import os

# 파일 관련 설정
FILE_URL = os.getenv("FILE_URL", "http://localhost:8000/file/")  # 파일을 접근할 URL
FILE_PATH = os.getenv("FILE_PATH", "D:/portfolio/")  # 파일이 저장될 로컬 경로


# 파일 저장 경로가 존재하는지 확인하고 없으면 생성
if not os.path.exists(FILE_PATH):
    os.makedirs(FILE_PATH)
