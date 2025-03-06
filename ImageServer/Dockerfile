# 1. 빌드 단계: Python 이미지를 사용하여 의존성 설치
FROM python:3.9

# 작업 디렉토리 설정
WORKDIR /code

# 로컬의 파일을 컨테이너로 복사
#COPY . .
COPY requirements.txt /code/requirements.txt

# pip 업데이트 및 requirements.txt로 의존성 설치
#RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 빌드 단계에서 복사한 의존성 설치된 애플리케이션 파일들 복사
COPY . /code

# FastAPI 애플리케이션을 실행할 포트 설정
EXPOSE 8000

# FastAPI 애플리케이션 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
