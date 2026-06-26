# PathWise AI – Product Requirements Document (PRD) v1.0

## 1. Executive Summary

PathWise AI is an AI-powered career guidance platform that helps students and aspiring professionals identify skill gaps, generate personalized learning roadmaps, and track progress toward their target careers.

The platform acts as a virtual career mentor by analyzing a user's current skills, comparing them with industry requirements, and recommending a structured learning path with curated resources.

---

# 2. Problem Statement

Students and career switchers face three major challenges:

1. Lack of clarity about career paths.
2. Difficulty identifying missing skills required for target roles.
3. No personalized roadmap for achieving career goals.

Current learning platforms provide content but do not provide a customized path based on an individual's existing skills and career aspirations.

PathWise AI solves this by providing AI-generated career roadmaps and skill-gap analysis.

---

# 3. Target Audience

### Primary Audience

* College Students
* Fresh Graduates
* Self-Learners
* Career Switchers

### Secondary Audience

* Early Career Professionals looking to upskill

---

# 4. User Personas

## Persona 1: AIML Student

Name: Sahithya

Goals:

* Become an AI Engineer
* Learn required skills systematically
* Track learning progress

Pain Points:

* Unsure what to learn next
* Too many learning resources
* No structured roadmap

---

## Persona 2: Career Switcher

Goals:

* Transition into technology roles
* Understand required skills
* Follow a guided learning plan

Pain Points:

* Doesn't know where to start
* Lacks mentorship
* Limited learning time

---

# 5. Target Roles Supported in MVP

1. AI Engineer
2. Data Scientist
3. Full Stack Developer
4. Frontend Developer
5. Backend Developer

---

# 6. MVP Features

## Feature 1: Authentication

Users can:

* Sign Up
* Login
* Logout
* Login with Google
* Login with GitHub

Priority: Must Have

---

## Feature 2: User Profile

Users can store:

* Name
* Education
* Skills
* Interests
* Target Career Role

Priority: Must Have

---

## Feature 3: Skill Assessment

Users complete a short assessment.

Assessment evaluates:

* Programming Knowledge
* Technical Skills
* Domain Knowledge

Priority: Must Have

---

## Feature 4: Skill Gap Analysis

System compares:

Current Skills
vs
Target Role Requirements

Output:

* Existing Skills
* Missing Skills
* Readiness Score

Priority: Must Have

---

## Feature 5: AI Roadmap Generator

Input:

* Current Skills
* Assessment Score
* Target Role
* Weekly Learning Hours

Output:

* Personalized Learning Path
* Milestones
* Timeline

Priority: Must Have

---

## Feature 6: Resource Recommendation Engine

For every roadmap milestone:

Recommend:

* YouTube Videos
* Documentation
* Courses
* Projects

Priority: Must Have

---

## Feature 7: Progress Tracking

Track:

* Completed Topics
* Progress Percentage
* Roadmap Completion Status

Priority: Must Have

---

## Feature 8: Dashboard

Display:

* Career Goal
* Roadmap Progress
* Skill Gap Summary
* Recommended Tasks

Priority: Must Have

---

# 7. Features Deferred to Future Releases

The following features are NOT included in MVP:

* Resume Parsing
* LinkedIn Profile Import
* AI Code Review
* Job Matching Engine
* Resume Builder
* Cover Letter Generator
* Recruiter Portal
* Enterprise Dashboard
* Skill Credentialing
* Voice Mentor

---

# 8. Success Metrics

### User Metrics

* 100+ Registered Users
* 70% Assessment Completion Rate
* 50% Roadmap Generation Rate

### Product Metrics

* Roadmap Generation < 10 seconds
* Dashboard Load Time < 3 seconds

---

# 9. Tech Stack

Frontend:

* Next.js
* TypeScript
* Tailwind CSS

Backend:

* Node.js
* Express.js

Database:

* PostgreSQL (Supabase)

Authentication:

* Supabase Auth

AI:

* OpenAI API

Deployment:

* Vercel
* Railway

---

# 10. MVP Goal

Enable a student to:

1. Create an account.
2. Select a target role.
3. Complete a skill assessment.
4. Receive skill-gap analysis.
5. Generate a personalized AI roadmap.
6. Track learning progress.
7. Access recommended learning resources.

If a user can successfully complete these seven actions, the MVP is considered successful.
