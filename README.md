# 말그림

텔레스트레이션 아시죠? 다 같이 웃고 떠들면서 분위기 풀리는 게임!

아이스 브레이킹 하면 또 술자리인데... 술자리에서도 이런 게임 할 수 있으면 얼마나 재밌을까요?

그림은 AI한테 맡기고, 우린 그냥 웃으면 되는 거죠! 😎

## 🎮 Services

- **로그인**
  - 구글 소셜 로그인을 지원합니다.
  - 비회원으로도 게임을 즐길 수 있습니다.
  - 소셜 로그인을 한 유저는 전적 기록 및 승률 확인이 가능합니다.
- **게임방**
  - 방을 만들고 코드를 통해 다른 사람을 초대할 수 있습니다.
  - 방장은 게임 시작, 인원 설정, 게임 모드 설정 등 게임 관련 설정을 할 수 있습니다.
- **페이커 모드**
  - 게임에 참여한 플레이어 중 한 명이 페이커가 되어 다른 플레이어들을 속입니다.
  - 페이커는 다른 플레이어들과 다른 제시어를 받게 되며, 다른 플레이어들은 페이커를 찾아내야 합니다.
- **게임 진행**
  - 플레이어는 전달받은 이미지를 보고 연상되는 단어를 입력합니다.
  - 입력한 단어를 기반으로 AI가 새로운 이미지를 생성하여 다음 플레이어에게 전달합니다.
  - 마지막 플레이어는 첫 번째 플레이어가 입력한 단어를 맞혀야 합니다.
- **게임 결과**
  - 게임이 끝나면 승리 팀이 표시됩니다.
  - 소셜 로그인을 한 유저는 승률이 기록됩니다.

## 🛠️ Tech Stack

### Frontend

- **Language**: TypeScript
- **Framework**: React
- **CSS Library**: emotionJS

### Backend

- **Language**: TypeScript
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: Redis, Mysql

### AI Image Server

- **Language**: Python
- **Framework**: Flask
- **AI Model**: [childrens_stories_v1_semireal](https://huggingface.co/ducnapa/childrens_stories_v1_semireal)
- **Libraries**: diffusers, pytorch

### ETC

- **VCS**: Git

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MySQL
- Redis

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/JayunKu/MADCAMP_WEEK_2.git
    cd MADCAMP_WEEK_2
    ```

2.  **Install frontend dependencies:**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

3.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    cd ..
    ```

4.  **Install AI image server dependencies:**
    ```bash
    cd ai_image_server
    pip install -r requirements.txt
    cd ..
    ```

## 🏃‍ Running the application

1.  **Run the backend server:**
    ```bash
    cd backend
    npm run start:dev
    ```

2.  **Run the frontend server:**
    ```bash
    cd frontend
    npm run start
    ```

3.  **Run the AI image server:**
    ```bash
    cd ai_image_server
    python app.py
