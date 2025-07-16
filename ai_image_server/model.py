import uuid
import torch
from diffusers import StableDiffusionPipeline
from google.cloud import storage
from PIL import Image
from deep_translator import GoogleTranslator
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "../madcamp-malgreem-fd2ecdff2f9c.json"

# ✨ 변경 포인트: 테스트할 모델 이름만 이 변수에서 바꾸면 됨!
MODEL_NAME = "ducnapa/childrens_stories_v1_semireal"  # 👈 이 줄만 수정하면 됨

# GCS 설정
GCS_BUCKET_NAME = "madcamp-malgreem-image"  # 👈 실제 GCS 버킷 이름으로 교체
IMAGE_DIR = "./generated_images"

# 파이프라인 로드 (서버 시작 시 한 번만 실행). AI 모델 불러와 pipe에 저장하고 GPU 메모리로 이동.
pipe = StableDiffusionPipeline.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16,
    weights_only=False
).to("cuda")

def translate_prompt(prompt: str) -> str:
    translated = GoogleTranslator(source='auto', target='en').translate(prompt)
    #print(f"[번역] 입력 프롬프트: {prompt}")
    #print(f"[번역] 번역된 프롬프트: {translated}")
    return translated

# 이미지 생성 및 GCS 업로드 함수
def generate_image_and_upload_to_gcs(prompt: str) -> str:

    negative_prompt = "creepy, dark, weird, ugly, monster"
    default_prompt = "minimalistic, naively drawn, crayon drawing made by a child, on a pure white background, smiling face, no background elements"
    translated_prompt = translate_prompt(prompt)
    full_prompt = f"{translated_prompt}, {default_prompt}"
    print(prompt)

    # 1. 이미지 생성
    with torch.autocast("cuda"):
        image = pipe(full_prompt, negative_prompt=negative_prompt).images[0]

    # 2. 로컬 저장
    os.makedirs(IMAGE_DIR, exist_ok=True)
    filename = f"{uuid.uuid4()}.png"
    image_path = os.path.join(IMAGE_DIR, filename)
    image.save(image_path)

    # 3. GCS 업로드
    client = storage.Client()
    bucket = client.bucket(GCS_BUCKET_NAME)
    blob = bucket.blob(filename)
    blob.upload_from_filename(image_path)

    #blob.make_public() #공개 URL 만들기

    # # 4. GCS 키 반환
    return filename


# #GCS에 올리는 거 없이 이미지 생성까지만 테스트
# import uuid
# import torch
# from diffusers import StableDiffusionPipeline
# from PIL import Image
# import os

# MODEL_NAME = "nitrosocke/classic-anim-diffusion"

# # 로컬 저장 위치

# IMAGE_DIR = "./generated_images"

# # 파이프라인 로드 (한 번만 실행)
# pipe = StableDiffusionPipeline.from_pretrained(
#     MODEL_NAME,
#     torch_dtype=torch.float16
# )
# pipe = pipe.to("cuda")

# # 이미지 생성 및 로컬 저장 함수 (GCS 업로드 없음)
# def generate_image_and_upload_to_gcs(prompt: str) -> str:
#     # 1. 이미지 생성
#     negative_prompt = "creepy, scary, ugly, horror, dark, grey background"

#     # 1. 이미지 생성
#     with torch.autocast("cuda"):
#         image = pipe(prompt, negative_prompt=negative_prompt).images[0]

#     # 2. 로컬 저장 (디렉토리 생성 포함)

#     os.makedirs(IMAGE_DIR, exist_ok=True)
#     filename = f"{uuid.uuid4()}.png"
#     image_path = os.path.join(IMAGE_DIR, filename)
#     image.save(image_path)

#     # 3. key(파일명)만 반환
#     return filename

