<div align="center">

# Second Brain

<img src="./readme-assets/Logo.png" width="340" />

</div>

## 🔗**지식을 저장하고** 연결하여 **사용하세요**<br>

**지식을 노트로 저장**하고 **여러 디바이스에서 사용**하여 개인의 지식을 활용할 수 있습니다. **크롬 익스텐션과 MCP**를 통해 지식을 **쉽게 저장**하고 **쉽게 꺼내어** 연결된 지식과 인사이트를 얻으세요.<br/>

> ## Second Brain 프로젝트는
> 정보과부화 시대에 정보들은 기억 속에서 사라지거나 메모장 어딘가에 묻혀버려 장기기억으로 전환되지 못한다는 **문제의식**에서 출발했습니다. 우리의 서비스는 LLM과 인터넷을 통해 얻은 지식과 정보를 저장하고 연결하여 지식을 구조화하고, 쉽게 꺼내쓰면서 마치 **두 번째 뇌**를 가진 것과 같은 경험을 하게 해줍니다.

- **개발 기간** : 2025.10.02 ~ 2025.11.20 **(7주)**
- **플랫폼** : Web & App & Chrome Extension & Wear OS
- **개발 인원** : 6명 <br><br>

</div> <br>

## 🔎 목차

<div>


### <a href="#skills">📲 기능 구성</a>

### <a href="#techStack">🛠️ 기술 스택</a>

### <a href="#directories">📂 프로젝트 구조도</a>

### <a href="#systemArchitecture">🌐 시스템 아키텍처</a>

### <a href="#developers">🌟 팀원 구성</a>

### <a href="#projectDeliverables">📦 프로젝트 산출물</a>

</div>

<br>



## 📲 기능 구성

<a name="skills"></a>

<div align="center">

<div>

## Web

![메인화면](/readme-assets/웹/gif/메인화면.gif)
![메인화면탐색](/readme-assets/웹/gif/메인화면탐색.gif)

> 지식 노트는 연관성에 따라 연결되어 시각화됩니다<br>
> 노트는 저장되는 즉시 자동으로 관련 지식과 연결됩니다

<details>
<summary>노트 작성 / 삭제 / 검색 보기</summary>
<div markdown="1">

![노트작성](/readme-assets/웹/gif/노트작성.gif)
![노트수정](/readme-assets/웹/gif/노트수정.gif)
![노트삭제](/readme-assets/웹/gif/노트삭제.gif)
![노트검색](/readme-assets/웹/gif/검색후이동.gif)

</div>
</details>

</div>

<div>

## Chrome Extension

크롬 익스텐션을 통해 웹에서 쉽게 정보를 저장하고 꺼내볼 수 있습니다

<details>
<summary>상세보기</summary>
<div markdown="1">

![드래그저장](/readme-assets/익스텐션/gif/드래그저장.gif)
![드래그추가](/readme-assets/익스텐션/gif/드래그추가.gif)
![페이지저장](/readme-assets/익스텐션/gif/추가한%20페이지%20노트로%20저장.gif)

>저장하고 싶은 정보를 드래그하여 context로 추가하거나 노트로 저장할 수 있고 URL 전체를 노트로 저장할 수 있습니다 <br>
> URL과 내용을 파싱하여 LLM을 통해 정리하고 노트로 저장합니다

저장한 노트를 검색하고 내 Second Brain에 이미 저장되어 있는지 확인할 수 있습니다

![노트검색](/readme-assets/익스텐션/gif/노트검색.gif)
![드래그검색](/readme-assets/익스텐션/gif/드래그검색.gif)

추가로 어떤 내용을 저장할 것인지 익스텐션을 통해 관리할 수 있습니다

![추가페이지](/readme-assets/익스텐션/gif/페이지%20추가.gif)
![이미추가된페이지](/readme-assets/익스텐션/gif/이미추가된페이지.gif)
![추가한페이지삭제](/readme-assets/익스텐션/gif/추가한%20페이지%20삭제.gif)
![임시노트삭제](/readme-assets/익스텐션/gif/임시노트삭제.gif)

</div>
</details>


</div>

<div>

## MCP

Second Brain을 LLM 서비스와 연결하여 지식을 생성하고 꺼내서 새로운 인사이트를 얻어보세요

<details>
<summary>상세보기</summary>
<div markdown="1">

![저장요청](/readme-assets/MCP/gif/1_저장요청.gif)
![노트생성성공](/readme-assets/MCP/gif/2_노트생성성공캡처.png)
![다중노트생성](/readme-assets/MCP/gif/4_다중노트생성요청캡처.png)

> 저장 요청을 통해 새로 알게 된 지식이나 대화 내용을 요약하여 노트로 저장합니다

<br>

![그래프형성](/readme-assets/MCP/gif/3_그래프형성캡처.png)
> 저장된 노트는 관련성 있는 노트들과 자동으로 연결됩니다

<br>

![노트검색](/readme-assets/MCP/gif/5_노트검색및연관노트조회새로운인사이트제공.gif)
![노트검색결과](/readme-assets/MCP/gif/6_노트검색과연관노트검색.png)

> Graph 검색을 지원하여 LLM이 더 많은 context와 연결성을 이해하고 답변할 수 있습니다

</div>
</details>

</div>

<div>

## Watch & Mobile

워치와 모바일에서 내가 저장한 노트를 자연어로 검색하고 확인할 수 있습니다

<details>
<summary>상세보기</summary>
<div markdown="1">

![모바일검색](/readme-assets/모바일/gif/모바일검색.gif)
![워치검색](/readme-assets/워치/워치%20음성인식1.png)
![워치검색](/readme-assets/워치/워치알림2.png)
![검색결과](/readme-assets/모바일/gif/노트%20스와이프.gif)

> 검색 결과를 모바일에서 확인하고 스와이프를 통해 연관 노트를 계속해서 서칭할 수 있습니다

</div>
</details>

</div>


</div>
<br>

## 🛠️ 기술 스택

<a name="techStack"></a>

<div align="center">

<a href="/exec/porting_manual.pdf" style="font-size:30px;">📃 **포팅 메뉴얼**</a>

</div>

---

<div align="center">

### 🌕 Frontend

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)<br>
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcn&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white)<br>
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=tanstack&logoColor=white)
![TanStack Router](https://img.shields.io/badge/TanStack_Router-FF4154?style=for-the-badge&logo=tanstack&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

|   **Category**   |          **Version**           |
| :--------------: | :----------------------------: |
|    **React**     |              v18               |
| **Tailwind CSS** | v3(web) / v4(Chrome Extension) |

<br>

</div>

---

<div align="center">

### 🌑 Backend

![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jwt&logoColor=white)
![Spring Security](https://img.shields.io/badge/SpringSecurity-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)<br>
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)<br>
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

|   **Category**    | **Version** |
| :---------------: | :---------: |
|     **Java**      |     17      |
|  **Spring Boot**  |    3.5.7    |
| **Elasticsearch** |    8.7.1    |

</div>

---

<div align="center">

### 🤖 AI - Backend

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)<br>
![Neo4j](https://img.shields.io/badge/Neo4j-4479A1?style=for-the-badge&logo=neo4j&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)<br>
![LangChain](https://img.shields.io/badge/LangChain-4CAF50?style=for-the-badge&logo=langchain&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-4CAF50?style=for-the-badge&logo=langgraph&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

| **Category** | **Version** |
| :----------: | :---------: |
|  **Python**  |    3.13+    |


<a href="/knowledge-graph-service/README.md" style="font-size:20px;">README-AI-Backend</a><br>
<a href="/agent-MCP/README.md" style="font-size:20px;">README-MCP-Server</a>

<br>
</div>

---

<div align="center">

### ⚙️ DevOps

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS EC2](https://img.shields.io/badge/AWS%20EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS%20S3-569A31?style=for-the-badge&logo=amazonaws&logoColor=white)<br>
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Kibana](https://img.shields.io/badge/Kibana-005571?style=for-the-badge&logo=kibana&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)<br>
![Nginx](https://img.shields.io/badge/Nginx-269539?style=for-the-badge&logo=nginx&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-FF3E00?style=for-the-badge&logo=n8n&logoColor=white)


|    **Category**    |        **Spec**        |
| :----------------: | :--------------------: |
| **Instance Type**  |       T2.XLARGE        |
|      **CPU**       |        4 vCPUs         |
|      **RAM**       |         16 GB          |
| **Storage (Disk)** | SSD: 320 GB, HDD: 6 TB |
|     **Docker**     |        v28.1.1         |
| **Docker Compose** |        v2.38.2         |
|    **Jenkins**     |         2.520          |
|     **Nginx**      |      nginx/1.18.0      |

</div>

### 🤝 Collaboration

<div align="center">

![GitLab](https://img.shields.io/badge/gitlab-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white)
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)
![Notion](https://img.shields.io/badge/notion-000000.svg?style=for-the-badge&logo=notion&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)
![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)

</div>

<br>

## 📂 프로젝트 구조도

<a name="directories"></a>

```
S13P31E107/...
├─ backend/secondbrain/...
│  ├─ Dockerfile
│  └─ main.py
│
├─ agent-MCP/...
│  ├─ services/...
│  ├─ .env-example
│  └─ main.py
│
├─ knowledge-graph-service/...
│  ├─ app/...
│  ├─ Dockerfile
│  └─ main.py
│
├─ extension/...
│  ├─ src/...
│  ├─ Dockerfile
│  ├─ package.json
│  └─ README.md
│
├─ frontend/...
│  └─ secondbrain/...
│     ├─ Dockerfile
│     ├─ src/...
│     └─ package.json
│
├─ mobile_watch/...
│  └─ secondbrain/...
│     ├─ build.gradle.kts
│     ├─ mobile/...
│     │   ├─ src/...
|     │   └─ build.gradle.kts
│     └─ wear/...
│         ├─ src/...
|         └─ build.gradle.kts
│
└─ Deploy/...
   ├─ jenkins, grafana, nginx.../...
   ├─ docker-compose.yml
   └─ Jenkinsfile
```

## 🌐 시스템 아키텍처

<a name="systemArchitecture"></a>

### 🖧 System Architecture

<div align="center">

<img src="./readme-assets/architecture.png"/>
</div>

### 🚀 Code Review Pipeline - n8n

<div align="center">

<table>
  <tr>
    <td align="center" width="50%"><b>Quick Review</b></td>
    <td align="center" width="50%"><b>Deep Review</b></td>
  </tr>
  <tr>
    <td align="center"><img src="./readme-assets/n8n/n8n_quick_review.png"/></td>
    <td align="center"><img src="./readme-assets/n8n/n8n_detail_review.png"/></td>
  </tr>
</table>
<table>
  <tr>
    <td align="center" width="33%"><b>Main Workflow</b></td>
    <td align="center" width="33%"><b>Quick Review Workflow</b></td>
    <td align="center" width="33%"><b>Detail Review Workflow</b></td>
  </tr>
  <tr>
    <td align="center"><img src="./readme-assets/n8n/n8n_e107.png"/></td>
    <td align="center"><img src="./readme-assets/n8n/n8n_quickeye.png"/></td>
    <td align="center"><img src="./readme-assets/n8n/n8n_deepdive.png"/></td>
  </tr>
</table>

</div>

### 📢 Collaboration & Event Notification

<div align="center">

<table>
  <tr>
    <td align="center" width="50%"><b>❌ Jenkins Pipeline Failure</b></td>
    <td align="center" width="50%"><b>✅ Jenkins Pipeline Success</b></td>
  </tr>
  <tr>
    <td align="center"><img src="./readme-assets/JenkinsFailed.png"/></td>
    <td align="center"><img src="./readme-assets/JenkinsSuccess.png"/></td>
  </tr>
  <tr>
    <td align="center" width="50%"><b>🗨️ Jira Issue Notification</b></td>
    <td align="center" width="50%"><b>🔀 Merge Request Created Notification</b></td>
  </tr>
  <tr>
    <td align="center"><img src="./readme-assets/JiraHook.png"/></td>
    <td align="center"><img src="./readme-assets/MRgenerated.png"/></td>
  </tr>
  <tr>
    <td align="center" width="50%"><b>Server Resource Notification - Fireing</b></td>
    <td align="center" width="50%"><b>Server Resource Notification - Resolved</b></td>
  </tr>
  <tr>
    <td align="center"><img src="./readme-assets/alertmanager_fire.png"/></td>
    <td align="center"><img src="./readme-assets/alertmanager_resolve.png"/></td>
  </tr>
</table>

</div>

<br>

## 🌟 팀원 구성

<a name="developers"></a>

<div align="center">

<div align="center">
<table>
    <tr>
        <td width="33%" align="center"> <a href="https://github.com/01seok">
            <img src="./readme-assets/이석재.jpg" width="160px" /> <br> 이석재 <br>(Team Leader & Backend) </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/soomkim00">
            <img src="./readme-assets/김수민.jpg" width="160px" /> <br> 김수민 <br>(Backend) </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/CometAve">
            <img src="./readme-assets/노혜성.jpg" width="160px" /> <br> 노혜성 <br>(Full Stack) </a> <br></td>
    </tr>
    <tr>
      <td width="280px">
        <sub>
          - Elasticsearch와 Neo4j를 결합한 하이브리드 검색 엔진(RRF) 및 병렬 처리 구현<br>
          - RabbitMQ 기반의 비동기 메시지 처리를 통한 데이터 파이프라인 구축 및 트랜잭션 최적화<br>
          - Spring Scheduler와 STOMP 프로토콜을 활용한 실시간 리마인더 및 알림 시스템 개발<br>
          - 모바일 앱 백엔드 연동
        </sub>
      </td>
      <td width="280px">
        <sub>
          - 노트 CRUD, 다중 삭제 API 구현<br>
          - RabbitMQ 기반 리마인더 알림, 활성화 목록 조회 API 구현<br>
          - AWS S3 연결 및 파일 업로드 기능 구현<br>
          - 기능 단위 테스트 코드 작성<br>
          - 발표 스크립트 작성 및 발표
        </sub>
      </td>
      <td width="280px">
        <sub>
          - Authorization Code Pattern 기반 JWT 인증 및 Redis Refresh Token 로테이션 구현 <br>
          - Redis 기반 실시간 Draft 저장 시스템 구현 (멱등성 보장) <br>
          - 크롬 익스텐션 UI 개발 <br>
          - 크롬 익스텐션: Shadow DOM 격리, Drag-to-Search, OAuth 2.0 New Tab 방식 구현 <br>
          - Milkdown 에디터 통합, 성능 최적화 (3D UI, Vite)<br>
          - Docker 기반 로컬 개발 환경 구축
        </sub>
      </td>
    </tr>

</table>

<table>
    <tr>
        <td width="33%" align="center"> <a href="https://github.com/PPPP98">
        <img src="./readme-assets/" width="160px" /> <br> 박진호 <br>(Backend & AI) </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/yeneua">
        <img src="./readme-assets/" width="160px" /> <br> 김예나 <br>(Frontend) </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/seok0205">
        <img src="./readme-assets/jungseok.jpg" width="160px" /> <br> 유정석 <br>(DevOps) </a> <br></td>
    </tr>
    <tr>
        <td width="280px">
          <sub>
            - FastAPI를 활용해 Agent & Neo4j 로직 서비스 제공<br>
            - Neo4j 그래프 연결 비동기 처리를 위한 RabbitMQ 이벤트 컨슈머 워커 구성<br>
            - LangChain/LangGraph를 활용한 Agent 워크플로우 설계 및 구현
          </sub>
        </td>
        <td width="280px">
          <sub>
            -  <br>
            -  <br>
            -  <br>
            - 
          </sub>
        </td>
        <td width="280px">
          <sub>
            - Android 앱 개발: Retrofit을 이용한 REST API 연동, 음성 인식 및 검색 기능 구현<br>
            - Wear OS 앱 개발: Wear Compose UI 구현, 음성 인식(STT) 및 모바일 기기와의 데이터 동기화(Data Layer API)<br>
            - Blue/Green 무중단 배포 파이프라인 구축 및 자동 롤백 시스템 구현<br>
            - n8n 기반 AI 코드 리뷰 자동화 워크플로우 구축<br>
            - Prometheus & Grafana 기반의 서버 리소스 모니터링 대시보드 구축<br>
            - MR, Server Resource 관련 이벤트, 오류 등을 MatterMost를 통해 자동 알림 구현
          </sub>
        </td>
    </tr>

</table>
</div>
<br>

</div>

<br>


## 📦 프로젝트 산출물

<a name="projectDeliverables"></a>

<h3>🖼️ 화면 설계서</h3>
<div align="center">

<img src="./readme-assets/Figma.png"/>
</div>

<h3>✅ Swagger API Docs</h3>
<details align="left">
  <summary>
    <strong>자세히</strong>
  </summary>

  <div align="center">

  <img src="./readme-assets/SpringBootSwagger.png"/>
  <img src="./readme-assets/FastAPISwagger.png"/>
  </div>
</details>

<h3><a href="https://lemon-parrotfish-cb5.notion.site/2921d7b5e16e8090a358dce66d4f1d2c" target="_blank">🗓️ 일정표</a></h3>
<h3><a href="https://lemon-parrotfish-cb5.notion.site/2841d7b5e16e8133ace2e1505b37ca66" target="_blank">✅ 요구사항 정의서</a></h3>
<h3><a href="https://lemon-parrotfish-cb5.notion.site/2841d7b5e16e81a1a4dcc03071016a08" target="_blank">📋 기능 명세서</a></h3>