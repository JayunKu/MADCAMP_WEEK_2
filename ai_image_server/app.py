# Flask라는 웹 서버 프레임워크에서 필요한 기능들 불러오기
from flask import Flask, request, jsonify
from model import generate_image_and_upload_to_gcs  # 모델 처리 함수 불러오기

# Flask 앱(서버)을 만든다
app = Flask(__name__)

# 브라우저에서 '/' 경로로 접속하면 실행될 함수 정의
@app.route("/")
def health_check():
    # 클라이언트에게 문자열을 응답하고, 상태 코드 200(정상)을 함께 보냄
    return "AI Image Server is running!", 200

# 프론트에서 프롬프트를 받아 이미지를 생성하고 GCS에 저장하는 API
@app.route("/generate", methods=["POST"])
def generate_image():
    # JSON body에서 'prompt'를 꺼낸다
    data = request.get_json()
    prompt = data.get("prompt")

    # prompt가 없으면 400 에러 반환
    if not prompt:
        return jsonify({"message": "Prompt is required"}), 400

    try:
        # 이미지 생성 및 GCS 업로드, key 또는 URL 반환
        image_key = generate_image_and_upload_to_gcs(prompt)

        # model.py에서 반환하는게 filename일 경우 성공 응답
        # return jsonify({"image_key": image_key}), 200

        # model.py에서 반환하는게 공개 URL일 경우 성공 응답
        return jsonify({"image_id": image_key}), 200
    except Exception as e:
        # 에러 발생 시 500 응답
        return jsonify({"message": str(e)}), 500

# 이 파일(app.py)이 직접 실행될 때만 서버를 실행하도록 설정
if __name__ == "__main__":
    # 0.0.0.0은 외부에서 이 서버에 접근 가능하게 함, 포트는 5000번 사용
    app.run(host="0.0.0.0", port=5000)
