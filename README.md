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
- **Monitoring**: Prometheus + Grafana (implemented)
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

## Phase 4 – Kubernetes Manifests & Local Testing
- Created `deployment.yaml` (2 replicas) and `service.yaml` (NodePort)
- Tested locally with Minikube
- App successfully running at Minikube service URL

![Minikube Pods & Service](assets/images/minikube-pods.png)
![App Running in Minikube](assets/images/app-in-minikube.png)
![Minikube Dashboard](assets/images/minikube-dashboard-pods.png)

## Phase 5 – GitOps with Argo CD on AWS EKS
- Created minimal EKS cluster with eksctl (t3.small nodes, ap-south-1)
- Installed Argo CD in-cluster
- Created Application synced to GitHub kubernetes/ path
- Auto-sync enabled → push change → Argo deploys to EKS

![EKS Cluster Nodes](assets/images/eks-nodes.png)
![Argo CD Dashboard](assets/images/argo-dashboard.png)
![freshbite-app Synced in Argo](assets/images/argo-app-synced.png)
![Argo Resource Tree - Pod Running](assets/images/argo-resource-tree.png)
![FreshBite Live on EKS Public URL](assets/images/app-eks-public.png)
![App Pods Running on EKS](assets/images/eks-pods-running.png)

## Phase 6 – Monitoring with Prometheus + Grafana
- Installed kube-prometheus-stack via Helm in monitoring namespace
- Port-forward Grafana UI
- Imported dashboards: Node Exporter Full, Kubernetes Cluster Monitoring, Pod Metrics
- Verified real-time metrics for nodes, cluster, and FreshBite pod (CPU, memory, etc.)

![Grafana Login & Home](assets/images/grafana-login.png)
![Node Exporter Dashboard - Node Metrics](assets/images/grafana-nodes.png)
![Kubernetes Cluster Monitoring Dashboard](assets/images/grafana-cluster.png)
![FreshBite Pod Metrics (CPU/Quota)](assets/images/grafana-pod-freshbite.png)

## Tech Stack Summary
- Frontend: Vite, React 18, TypeScript, Tailwind, shadcn/ui
- CI/CD: GitHub Actions, Docker Hub
- Security: SonarCloud, OWASP Dependency-Check, Trivy, Docker Scout
- Orchestration: Kubernetes, Minikube (local), AWS EKS (cloud)
- GitOps: Argo CD
- Monitoring: Prometheus, Grafana
