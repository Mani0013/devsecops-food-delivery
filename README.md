# FreshBite - End-to-End DevSecOps Food Delivery App

A modern, fully containerized React frontend (inspired by Zomato) with a complete DevSecOps pipeline: CI with security scans, Docker containerization, Kubernetes manifests, GitOps deployment (Argo CD), and monitoring — all deployed to AWS EKS.

Built with:
- Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui
- TanStack Query, React Hook Form, Zod, Framer Motion, Recharts, Lucide icons

## Project Highlights
- **CI/CD**: GitHub Actions with SonarCloud, OWASP Dependency-Check, Trivy (FS + image), Docker Scout
- **Containerization**: Multi-stage Dockerfile (Node build → Nginx serve)
- **Orchestration**: Kubernetes manifests + local Minikube testing
- **GitOps**: Argo CD for declarative deployments to AWS EKS
- **Monitoring**: Prometheus + Grafana (planned)
- **Security**: Zero high/critical npm vulnerabilities after remediation; base image risk accepted

![FreshBite App Home](assets/images/app-local.png)

## Architecture Overview

![Pipeline Diagram](assets/images/architecture.png)
*(High-level flow: GitHub → Actions CI → Docker Hub → Argo CD → EKS + Monitoring)*

## Phase 1 – Base App Preparation
- Cleaned Lovable.dev export
- Verified production build: `npm run build && npm run preview`
- Pushed to GitHub: https://github.com/Mani0013/devsecops-food-delivery


## Phase 2 – Containerization
- Multi-stage Dockerfile: Node 20-alpine (build) → nginx:alpine (runtime)
- Image size: ~26 MB compressed
- Pushed to Docker Hub: https://hub.docker.com/r/manideep003/freshbite

![Docker Build & Run](assets/images/docker-build-success.png)
![App in Docker](assets/images/app-in-docker.png)

## Phase 3 – GitHub Actions CI Pipeline
Automated on push/PR to main:
- SonarCloud: Code quality & security
- OWASP Dependency-Check: Dependency vulnerabilities
- Trivy: Filesystem & image scanning
- Docker Scout: Advanced image analysis
- Build & push to Docker Hub

![GitHub Actions Full Success](assets/images/github-actions-full-success.png)

**Security Remediation**:
- Initial OWASP scan: 8 vulnerable deps (12 vulns, including high-severity XSS in react-router)
- Fixed via `npm audit fix` → final report: **0 vulnerabilities**

![OWASP Clean Report](assets/images/owasp-clean-report.png)

**Container Security**:
- Docker Scout detected 1 high vulnerability in base image (libpng CVE in nginx:alpine)
- Risk: Low — static file serving only; no exploitable path
- Accepted for demo (production would use distroless or patched base)

![Docker Scout - 1 High](assets/images/docker-scout-1-high.png)

## Challenges & Solutions
1. **SonarCloud scan failure** ("missing sonar.projectKey / organization")  
   → Added `sonar-project.properties` file with correct keys → disabled Automatic Analysis in SonarCloud UI → scans passed consistently.

2. **Base image vulnerabilities** (high CVE in libpng from nginx:alpine)  
   → Evaluated risk (static serving → no exploit path) → accepted for project scope while keeping simple, lightweight base. (Explored distroless/slim variants but reverted to stable alpine for minimal changes.)

## Phase 4 – Kubernetes Manifests & Local Testing (In Progress)
- Deployment & Service manifests created
- Tested locally with Minikube
- Ready for Argo CD GitOps to AWS EKS

![Minikube Deployment](assets/images/minikube-pods.png)
![App via Minikube](assets/images/app-minikube.png)

## Next Phases
- Phase 5: Argo CD GitOps deployment to EKS
- Phase 6: Prometheus + Grafana monitoring
- Phase 7: Cost cleanup scripts, final architecture diagram, demo video

## Tech Stack Summary
- Frontend: Vite, React 18, TypeScript, Tailwind, shadcn/ui
- CI/CD: GitHub Actions, Docker Hub
- Security: SonarCloud, OWASP Dependency-Check, Trivy, Docker Scout
- Orchestration: Kubernetes, Minikube (local), AWS EKS (cloud)
- GitOps: Argo CD
