\# PathWise AI – System Architecture



\## High-Level Architecture



```text

&#x20;               ┌──────────────────────┐

&#x20;               │      User Browser    │

&#x20;               └──────────┬───────────┘

&#x20;                          │

&#x20;                          ▼

&#x20;               ┌──────────────────────┐

&#x20;               │ Next.js Frontend     │

&#x20;               │ React + Tailwind CSS │

&#x20;               └──────────┬───────────┘

&#x20;                          │ REST API

&#x20;                          ▼

&#x20;               ┌──────────────────────┐

&#x20;               │ Express.js Backend   │

&#x20;               │ Node.js              │

&#x20;               └──────┬───────┬───────┘

&#x20;                      │       │

&#x20;        ┌─────────────┘       └───────────────┐

&#x20;        ▼                                     ▼

┌───────────────────┐              ┌──────────────────┐

│ Supabase          │              │ OpenAI API       │

│ PostgreSQL DB     │              │ AI Roadmap       │

│ Authentication    │              │ Skill Analysis   │

└───────────────────┘              └──────────────────┘

```



\## Responsibilities



\### Frontend



\* User Interface

\* Dashboard

\* Authentication Pages

\* Skill Assessment

\* Roadmap Display



\### Backend



\* Business Logic

\* API Endpoints

\* Authentication Validation

\* AI Requests

\* Database Operations



\### Supabase



\* User Authentication

\* PostgreSQL Database

\* User Profiles

\* Progress Tracking



\### OpenAI API



\* Skill Gap Analysis

\* Personalized Roadmap Generation

\* Learning Recommendations



\# User Flow



```text

Landing Page

&#x20;     │

&#x20;     ▼

Sign Up / Login

&#x20;     │

&#x20;     ▼

Create Profile

&#x20;     │

&#x20;     ▼

Choose Target Career

&#x20;     │

&#x20;     ▼

Take Skill Assessment

&#x20;     │

&#x20;     ▼

Skill Gap Analysis

&#x20;     │

&#x20;     ▼

AI Generates Roadmap

&#x20;     │

&#x20;     ▼

Dashboard

&#x20;     │

&#x20;     ▼

Track Progress

&#x20;     │

&#x20;     ▼

Complete Learning Path

```



\# Database Architecture



\## Core Database Tables



\### 1. users



Stores authentication information.



| Field      | Type      |

| ---------- | --------- |

| id         | UUID      |

| full\_name  | Text      |

| email      | Text      |

| created\_at | Timestamp |



\---



\### 2. profiles



Stores user profile information.



| Field       | Type |

| ----------- | ---- |

| id          | UUID |

| user\_id     | UUID |

| college     | Text |

| degree      | Text |

| skills      | JSON |

| interests   | JSON |

| target\_role | Text |



\---



\### 3. career\_roles



Stores available career options.



| Field       | Type |

| ----------- | ---- |

| id          | UUID |

| role\_name   | Text |

| description | Text |



Examples:



\* AI Engineer

\* Data Scientist

\* Full Stack Developer

\* Frontend Developer

\* Backend Developer



\---



\### 4. role\_skills



Stores skills required for each role.



| Field      | Type    |

| ---------- | ------- |

| id         | UUID    |

| role\_id    | UUID    |

| skill\_name | Text    |

| importance | Integer |



Example:



AI Engineer



\* Python

\* NumPy

\* Pandas

\* Machine Learning

\* TensorFlow

\* Deep Learning



\---



\### 5. assessments



Stores assessment scores.



| Field        | Type      |

| ------------ | --------- |

| id           | UUID      |

| user\_id      | UUID      |

| score        | Integer   |

| completed\_at | Timestamp |



\---



\### 6. roadmaps



Stores AI-generated learning roadmaps.



| Field              | Type    |

| ------------------ | ------- |

| id                 | UUID    |

| user\_id            | UUID    |

| generated\_plan     | JSON    |

| estimated\_duration | Integer |



\---



\### 7. progress



Tracks user progress.



| Field                 | Type    |

| --------------------- | ------- |

| id                    | UUID    |

| user\_id               | UUID    |

| completed\_skill       | Text    |

| completion\_percentage | Integer |



\---



\### 8. learning\_resources



Stores recommended learning resources.



| Field         | Type |

| ------------- | ---- |

| id            | UUID |

| skill\_name    | Text |

| title         | Text |

| url           | Text |

| resource\_type | Text |



Resource Types:



\* YouTube

\* Documentation

\* Course

\* Project



\# Entity Relationships



```text

Users

&#x20;│

&#x20;├──────────► Profile (1:1)

&#x20;│

&#x20;├──────────► Assessments (1:M)

&#x20;│

&#x20;├──────────► Roadmaps (1:M)

&#x20;│

&#x20;└──────────► Progress (1:M)



Career Roles

&#x20;     │

&#x20;     └────────► Role Skills (1:M)



Role Skills

&#x20;     │

&#x20;     └────────► Learning Resources (1:M)

```



\# API Architecture



The backend exposes REST APIs for communication between the frontend and the database.



\## Authentication APIs



| Method | Endpoint         | Description         |

| ------ | ---------------- | ------------------- |

| POST   | /api/auth/signup | Register a new user |

| POST   | /api/auth/login  | User login          |

| POST   | /api/auth/logout | Logout user         |



\---



\## Profile APIs



| Method | Endpoint     | Description      |

| ------ | ------------ | ---------------- |

| GET    | /api/profile | Get user profile |

| POST   | /api/profile | Create profile   |

| PUT    | /api/profile | Update profile   |



\---



\## Assessment APIs



| Method | Endpoint               | Description           |

| ------ | ---------------------- | --------------------- |

| POST   | /api/assessment/start  | Start assessment      |

| POST   | /api/assessment/submit | Submit answers        |

| GET    | /api/assessment/result | Get assessment result |



\---



\## Skill Gap APIs



| Method | Endpoint       | Description                 |

| ------ | -------------- | --------------------------- |

| POST   | /api/skill-gap | Generate skill gap analysis |



\---



\## Roadmap APIs



| Method | Endpoint              | Description         |

| ------ | --------------------- | ------------------- |

| POST   | /api/roadmap/generate | Generate AI roadmap |

| GET    | /api/roadmap          | Get roadmap         |



\---



\## Progress APIs



| Method | Endpoint      | Description     |

| ------ | ------------- | --------------- |

| PUT    | /api/progress | Update progress |

| GET    | /api/progress | Get progress    |



\---



\## Resource APIs



| Method | Endpoint       | Description            |

| ------ | -------------- | ---------------------- |

| GET    | /api/resources | Get learning resources |



\# Project Folder Structure



```text

pathwise-ai/



frontend/

├── app/

├── components/

├── pages/

├── services/

├── hooks/

├── styles/

└── public/



backend/

├── src/

│   ├── controllers/

│   ├── routes/

│   ├── services/

│   ├── middleware/

│   ├── models/

│   ├── config/

│   └── utils/



docs/

├── PRD.md

├── Vision.md

├── MVP-Scope.md

└── Architecture.md

```



\## Responsibilities



Frontend



\* UI

\* Forms

\* Dashboard

\* API Calls



Backend



\* Business Logic

\* Authentication

\* Database

\* AI Integration



Docs



\* Project Documentation

\* Architecture

\* Requirements





