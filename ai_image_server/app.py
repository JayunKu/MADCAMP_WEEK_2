# Flask라는 웹 서버 프레임워크에서 필요한 기능들 불러오기
from flask import Flask, request, jsonify

# Flask 앱(서버)을 만든다
app = Flask(__name__)

# 브라우저에서 '/' 경로로 접속하면 실행될 함수 정의
@app.route("/")
def health_check():
    # 클라이언트에게 문자열을 응답하고, 상태 코드 200(정상)을 함께 보냄
    return "AI Image Server is running!", 200

# 이 파일(app.py)이 직접 실행될 때만 서버를 실행하도록 설정
if __name__ == "__main__":
    # 0.0.0.0은 외부에서 이 서버에 접근 가능하게 함, 포트는 5000번 사용
    app.run(host="0.0.0.0", port=5000)
