### <a href="#Retro">프로젝트 회고</a>

<div align="center">

# Second Brain

<img src="./readme-assets/Logo.png" width="340" />

</div>

## 🔗**지식을 저장하고** 연결하여 **사용하세요**<br>

**지식을 노트로 저장**하고 **여러 디바이스에서 사용**하여 개인의 지식을 활용할 수 있습니다. **크롬 익스텐션과 MCP**를 통해 지식을 **쉽게 저장**하고 **쉽게 꺼내어** 연결된 지식과 인사이트를 얻으세요.<br/>

> ## Second Brain 프로젝트는
>
> 정보과부화 시대에 정보들은 기억 속에서 사라지거나 메모장 어딘가에 묻혀버려 장기기억으로 전환되지 못한다는 **문제의식**에서 출발했습니다. 우리의 서비스는 LLM과 인터넷을 통해 얻은 지식과 정보를 저장하고 연결하여 지식을 구조화하고, 쉽게 꺼내쓰면서 마치 **두 번째 뇌**를 가진 것과 같은 경험을 하게 해줍니다.

- **개발 기간** : 2025.10.02 ~ 2025.11.20 **(7주)**
- **플랫폼** : Web & App & Chrome Extension & Wear OS
- **개발 인원** : 6명 <br><br>

</div> <br>


## ✨ 핵심 특장점

<div align="center">

### 🧠 지능형 지식 연결
노트 작성 시 AI가 자동으로 관련 지식을 분석하여 연결합니다. 수동 태깅 없이도 **Neo4j 그래프 DB**와 **벡터 유사도 검색**을 통해 예상치 못한 인사이트를 발견할 수 있습니다.

### 🔍 자연어 검색
"어제 작성한 커피 관련 노트"처럼 자연스러운 질문으로 지식을 찾을 수 있습니다. **LLM 기반 검색 Agent**가 시간 필터, 키워드, 맥락을 이해하여 정확한 결과를 제공합니다.

### 🤖 LLM 서비스 연동 (MCP & Text to Query)
Claude, ChatGPT 등 선호하는 AI와 개인 지식을 연결하세요. **MCP 서버**를 통해 대화 중 새로운 지식을 저장하고, **Graph RAG**로 연결된 맥락과 함께 인사이트를 얻을 수 있습니다.

### 🌐 멀티 플랫폼 경험
Web, Chrome Extension, Mobile, Wear OS에서 일관된 경험을 제공합니다. 웹에서 드래그로 저장하고, 워치에서 음성으로 검색하세요.

</div>


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

<table>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">메인화면</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/web/메인화면.gif"/></td> 
    </tr>
  </tbody>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">메인화면 탐색</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/web/메인화면탐색.gif"/></td> 
    </tr>
  </tbody>
</table>

> 지식 노트는 연관성에 따라 연결되어 시각화됩니다<br>
> 노트는 저장되는 즉시 자동으로 관련 지식과 연결됩니다

<details>
<summary>기능 상세 보기</summary>
<div markdown="1">

<table>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">노트 작성</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/web/노트작성.gif"/></td> 
    </tr>
  </tbody>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">노트 수정</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/web/노트수정.gif"/></td> 
    </tr>
  </tbody>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">노트 삭제</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/web/노트삭제.gif"/></td> 
    </tr>
  </tbody>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">노트 검색</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/web/노트검색.gif"/></td> 
    </tr>
  </tbody>
</table>
</div>
</details>

</div>

<div>

## Chrome Extension

크롬 익스텐션을 통해 웹에서 쉽게 정보를 저장하고 꺼내볼 수 있습니다

<details>
<summary>기능 상세 보기</summary>
<div markdown="1">

<table width="100%">
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">드래그 기반 텍스트 저장</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/extension/드래그기반텍스트저장.gif"/></td> 
    </tr>
  </tbody>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">드래그 기반 텍스트 추가</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/extension/드래그기반텍스트추가.gif"/></td> 
    </tr>
  </tbody>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">전체 페이지 노트 저장</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/extension/전체페이지노트저장.gif"/></td> 
    </tr>
  </tbody>
</table>

> 저장하고 싶은 정보를 드래그하여 context로 추가하거나 노트로 저장할 수 있고 URL 전체를 노트로 저장할 수 있습니다 <br>
> URL과 내용을 파싱하여 LLM을 통해 정리하고 노트로 저장합니다

<br/>

저장한 노트를 검색하고 내 Second Brain에 이미 저장되어 있는지 확인할 수 있습니다

<table>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">노트 검색</th>
    </tr>
    <tr>
      <td><img width="80%" src="./readme-assets/extension/노트검색.gif"/></td> 
    </tr>
  </tbody>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">드래그 텍스트 기반 노트 검색</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/extension/드래그텍스트기반노트검색.gif"/></td> 
    </tr>
  </tbody>
</table>
<br/>

추가로 어떤 내용을 저장할 것인지 익스텐션을 통해 관리할 수 있습니다

<table>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">페이지 추가</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/extension/페이지%20추가.gif"/></td> 
    </tr>
  </tbody>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">이미 추가된 페이지일 경우</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/extension/이미추가된페이지.gif"/></td> 
    </tr>
  </tbody>
</table>
<table>
  <tbody align="center">
    <tr>
      <th style="text-align: center" width="50%">추가한 페이지 삭제</th>
      <th style="text-align: center" width="50%">임시 노트 삭제</th>
    </tr>
    <tr>
      <td width="50%"><img width="80%" src="./readme-assets/extension/추가한%20페이지%20삭제.gif"/></td>
      <td width="50%"><img width="80%" src="./readme-assets/extension/임시노트삭제.gif"/></td>
    </tr>
  </tbody>
</table>
</div>
</details>

</div>

<div>

## MCP

Second Brain을 LLM 서비스와 연결하여 지식을 생성하고 꺼내서 새로운 인사이트를 얻어보세요

<details>
<summary>기능 상세 보기</summary>
<div markdown="1">

<table>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">저장 요청하기</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/MCP/1_저장요청.gif"/></td> 
    </tr>
  </tbody>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">노트 생성</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/MCP/2_노트생성성공캡처.png"/></td> 
    </tr>
  </tbody>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">다중 노트 생성</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/MCP/4_다중노트생성요청캡처.png"/></td> 
    </tr>
  </tbody>
</table>

> 저장 요청을 통해 새로 알게 된 지식이나 대화 내용을 요약하여 노트로 저장합니다

<br>
<table>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">그래프 형성</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/MCP/3_그래프형성캡처.png"/></td> 
    </tr>
  </tbody>
</table>

> 저장된 노트는 관련성 있는 노트들과 자동으로 연결됩니다

<br>

<table>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">노트 검색</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/MCP/5_노트검색및연관노트조회새로운인사이트제공.gif"/></td> 
    </tr>
  </tbody>
  <tbody align="center">
    <tr>
      <th style="text-align: center; width:100%;">노트 검색 결과</th>
    </tr>
    <tr>
      <td><img width="100%" src="./readme-assets/MCP/6_노트검색과연관노트검색.png"/></td> 
    </tr>
  </tbody>
</table>

> Graph 검색을 지원하여 LLM이 더 많은 context와 연결성을 이해하고 답변할 수 있습니다

</div>
</details>

</div>

<div>

## Watch & Mobile

워치와 모바일에서 내가 저장한 노트를 자연어로 검색하고 확인할 수 있습니다

<details>
<summary>기능 상세 보기</summary>
<div markdown="1">
<table>
  <tbody align="center"> 
    <tr>
      <th style="text-align: center">검색</th>
      <th style="text-align: center">노트 검색 결과</th>
    </tr>
    <tr>
      <td width="50%"><img width="80%" src="./readme-assets/mobile/모바일검색.gif"/></td> 
      <td width="50%"><img width="80%" src="./readme-assets/mobile/노트.gif"/></td>
    </tr>
  </tbody>
</table>

> 검색 결과를 모바일에서 확인하고 스와이프를 통해 연관 노트를 계속해서 서칭할 수 있습니다

<br/>

<table width="100%">
  <tbody align="center"> 
    <tr>
      <th style="text-align: center" colspan="2">음성 검색</th>
    </tr>
    <tr>
      <td width="50%"><img width="90%" src="./readme-assets/watch/워치%20음성인식1.png"/></td> 
      <td width="50%"><img width="90%" src="./readme-assets/watch/워치 음성인식2.png"/></td>
    </tr>
  </tbody>
  <tbody align="center"> 
    <tr>
      <th style="text-align: center" colspan="2">음성 검색 알림</th>
    </tr>
    <tr>
      <td width="50%"><img width="90%" src="./readme-assets/watch/워치알림1.png"/></td> 
      <td width="50%"><img width="90%" src="./readme-assets/watch/워치알림2.png"/></td>
    </tr>
  </tbody>
</table>

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

<div align="center">

### 🤝 Collaboration

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
            <img src="./readme-assets/profile/이석재.jpg" width="160px" /> <br> 이석재 <br>(Team Leader & Backend) </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/soomkim00">
            <img src="./readme-assets/profile/김수민.jpg" width="160px" /> <br> 김수민 <br>(Backend) </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/CometAve">
            <img src="./readme-assets/profile/노혜성.jpg" width="160px" /> <br> 노혜성 <br>(Full Stack) </a> <br></td>
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
        <img src="./readme-assets/profile/박진호.jpg" width="160px" /> <br> 박진호 <br>(Backend & AI) </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/yeneua">
        <img src="./readme-assets/profile/yena_kim.jpg" width="160px" /> <br> 김예나 <br>(Frontend) </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/seok0205">
        <img src="./readme-assets/profile/jungseok.jpg" width="160px" /> <br> 유정석 <br>(DevOps) </a> <br></td>
    </tr>
    <tr>
        <td width="280px">
          <sub>
            - Neo4j 지식 그래프 연결 서비스 구현<br>
            - LLM을 활용해 자연어 동적쿼리 작성 Agent 구현<br>
            - 동적쿼리와 유사도 검색을 결합한 검색 Agent 구현<br>
            - URL & text context 파싱 및 요약 Agent 구현<br>
            - FastAPI를 활용해 Agent & Neo4j 로직 엔드포인트 제공<br>
            - Neo4j 그래프 연결 비동기 처리를 위한 RabbitMQ 이벤트 컨슈머 워커 구성<br>
            - LangChain/LangGraph를 활용한 전체 Agent 워크플로우 설계 및 구현
          </sub>
        </td>
        <td width="280px">
          <sub>
            - 3D 그래프 시각화 및 인터렉션 구현<br> 
            - Glass UI 공통 컴포넌트 개발 및 최적화<br> 
            - 검색 기능 구현: 디바운싱, 무한 스크롤 적용을 통한 UX 최적화<br> 
            - 무한 스크롤 성능 최적화 (Intersection Observer 활용)<br> 
            - Android 앱 UX/UI 개발<br>
            - 서비스 전반 디자인 컨셉 수립<br>
            - 프로젝트 관리 및 문서화: Notion 기반 프로젝트 문서화, Jira 이슈 및 일정 운영
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
<h3><a href="./readme-assets/E107_발표자료.pdf" target="_blank">📢 발표 자료</a></h3>

<div>

## 프로젝트 회고

<a name="Retro"></a>

### 역할
- Neo4j 기반 지식 그래프 서비스 설계 및 구현
- FastAPI를 활용한 AI 서비스 백엔드 개발
- LangChain/LangGraph 기반 요약 및 검색 Agent 개발
- MCP(Model Context Protocol) 서버 구축을 통한 LLM 연동

<details>
<summary>프로젝트 진행 개인 회고</summary>

# SecondBrain 프로젝트 회고

## 프로젝트 개요

**Second Brain**은 정보 과부화 시대에 지식을 효과적으로 저장하고 연결하여, 마치 두 번째 뇌를 가진 것처럼 개인 지식을 활용할 수 있게 하는 서비스입니다. 7주간의 개발 기간 동안 Web, Mobile, Watch, Chrome Extension 플랫폼을 구축하며 Neo4j 기반 지식 그래프와 LLM을 결합한 지능형 노트 시스템을 구현했습니다.

***

## 주요 기술적 성과

### 1. Polyglot Persistence 아키텍처 구축

#### 구현 내용
PostgreSQL과 Neo4j를 결합한 하이브리드 데이터베이스 아키텍처를 설계했습니다. PostgreSQL은 정형 데이터와 빠른 CRUD 작업을 담당하고, Neo4j는 노트 간 관계성을 그래프로 표현하여 연결 검색을 최적화했습니다.

지식 그래프 생성 과정(임베딩 → 유사도 계산 → 관계 연결)의 지연시간 문제를 해결하기 위해 RabbitMQ 기반 비동기 처리 파이프라인을 구축했습니다. 사용자는 PostgreSQL에 노트가 저장되는 즉시 응답을 받고, 백그라운드에서 Consumer Worker가 그래프 연결을 처리하여 사용자 경험을 크게 개선했습니다.
(1500ms -> 250ms)

#### 배운 점과 개선 과제
메시지 큐 기반 아키텍처에서 **데이터 정합성 보장**의 중요성을 깨달았습니다. 개발 중 서버 장애나 Consumer Worker 오류로 인한 메시지 유실 사례를 경험했고, 이를 통해 분산 시스템에서의 신뢰성 확보가 얼마나 중요한지 이해하게 되었습니다.

향후 개선 방향으로 PostgreSQL에 그래프 형성 상태를 추적하는 테이블을 추가하여, 유실된 메시지를 감지하고 재처리하는 메커니즘을 구현할 계획입니다. 실제 프로덕션 환경에서는 **Dead Letter Queue**와 재시도 로직을 통한 더 견고한 설계가 필요함을 학습했습니다.

***

### 2. LLM 기반 Agent 시스템 개발

#### 2-1. 요약 Agent

Chrome Extension을 통해 수집된 웹 콘텐츠를 자동으로 요약하여 구조화된 노트로 변환하는 Agent를 LangChain/LangGraph로 구현했습니다.

**주요 도전과제:**

**응답 지연 문제**  
LLM 호출의 특성상 발생하는 지연시간을 해결하기 위해 FastAPI의 `async/await` 비동기 처리를 적용했습니다. 그러나 대량 요청 처리를 위해서는 멀티프로세스 아키텍처로의 확장이 필요하다는 과제를 확인했습니다.

**Context Window 관리**  
사용자가 대용량 웹페이지를 요약하려 할 때 LLM의 컨텍스트 윈도우 초과 문제가 발생했습니다. 이를 해결하기 위해 파싱된 콘텐츠를 청크 단위로 분할하고, 각 청크를 순차적으로 처리하여 요약하는 파이프라인을 구축했습니다.

#### 2-2. 검색 Agent

"어제 작성한 커피 관련 노트"와 같은 자연어 질의를 처리할 수 있는 지능형 검색 Agent를 개발했습니다.

**검색 파이프라인:**
1. LLM을 활용한 시간 필터 추출 (Text-to-Query)
2. LLM 기반 검색 쿼리 재작성 및 임베딩
3. 벡터 유사도 검색 수행
4. LLM을 통한 관련성 재평가 및 최종 결과 반환

**성과와 트레이드오프:**  
사용자는 키워드가 아닌 자연어로 지식을 검색할 수 있게 되었지만, 멀티 에이전트 워크플로우로 인한 응답 지연은 불가피했습니다. LLM 호출을 줄이는 것보다 **UX 설계로 지연을 수용**하는 방향을 선택했고, Mobile/Watch 앱에서 "내 지식에서 찾는 중" 같은 피드백으로 사용자 경험을 개선했습니다.

***

### 3. MCP 서버를 통한 LLM 연동

**Second Brain의 핵심 차별화 포인트**는 개인 지식을 LLM과 연결하는 것입니다. Graph RAG 방식으로 지식의 연결성을 활용하여, 사용자가 LLM과의 대화를 통해 새로운 인사이트를 얻을 수 있도록 MCP 서버를 구현했습니다.

#### 구현 방식
Text-to-Query 기반의 MCP Tool을 설계하여, LLM이 자연어 명령으로 노트를 생성하고 검색할 수 있도록 했습니다. 완전 자유도의 쿼리 생성보다는 **구조화된 파라미터**를 제공하는 Query Builder 함수를 MCP Tool로 노출하여, LLM이 정확하게 사용할 수 있도록 했습니다.

**예시:**
- 시간 필터(time_filter)
- 탐색 깊이(depth)
- 검색 쿼리(query)

#### 의사결정 배경
초기 요구사항에서는 서비스 내부에 챗봇을 구현하는 방향이 있었지만, 이미 우수한 LLM 서비스(Claude, ChatGPT 등)가 존재하는 상황에서 **MCP 프로토콜을 통한 통합**이 더 효과적이라고 판단했습니다. 결과적으로 사용자는 자신이 선호하는 LLM 서비스에서 Second Brain의 지식을 활용할 수 있게 되었습니다.

***

### 4. 자동 지식 연결 파이프라인

#### 설계 철학
초기에는 수동 노트 연결을 고려했지만, **실제 인간의 기억 형성 과정**에서는 그런 수고가 없다는 점에 착안했습니다. 새로운 지식은 자연스럽게 기존 지식과 연결되므로, 이를 자동화하는 것이 핵심이라고 판단했습니다.

#### 구현 결과
노트 임베딩 벡터 간 코사인 유사도와 키워드 매칭을 기반으로 관련 노트를 자동 연결하는 파이프라인을 구축했습니다. 사용자가 예상하지 못한 연결이 만들어지면서 새로운 인사이트를 발견하는 경험을 제공할 수 있었습니다.

#### 한계와 향후 연구 방향
현재 프로토타입은 유사도와 키워드 매칭만으로 연결을 구성하는데, 이것이 **최적의 방법은 아니라는 점**을 인지하고 있습니다. 개인 지식을 디지털 그래프로 효과적으로 표현하는 방법론은 더 깊은 연구가 필요한 영역임을 알게되었습니다.

***

## 기술적 도전과 학습

### LangChain/LangGraph 학습 곡선
개발 시기에 새로운 버전으로 업데이트되어 레퍼런스가 부족했지만, 공식 문서를 적극 활용하여 빠르게 적응했습니다. 이 과정에서 **문서 독해력과 자기주도 학습 능력**의 중요성을 재확인했습니다.

### 비동기 처리와 성능 최적화
FastAPI의 비동기 처리, RabbitMQ를 통한 메시지 큐, 그리고 Neo4j의 벡터 인덱스를 결합하여 성능을 최적화하는 경험을 쌓았습니다. 특히 **트레이드오프를 인식하고 적절한 지점을 선택**하는 능력이 성장했습니다.

***

## 마치며

SecondBrain 프로젝트를 통해 **분산 시스템 설계, LLM Agent 개발, 그래프 데이터베이스 활용**이라는 세 가지 핵심 역량을 성장시킬 수 있었습니다. 특히 기술 선택의 순간마다 사용자 경험과 기술적 제약 사이의 균형을 고민하며, 엔지니어로서의 의사결정 능력을 키울 수 있었습니다.

7주라는 짧은 기간 동안 프로토타입을 완성했지만, 실제 프로덕션 수준의 서비스로 발전시키기 위해서는 **안정성, 확장성, 사용자 경험**의 세 측면에서 지속적인 개선이 필요합니다. 이번 프로젝트에서 마주한 도전과제들은 다음 프로젝트에서 더 나은 설계를 할 수 있는 소중한 자산이 되었습니다.


</details>

</div>