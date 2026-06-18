# 📚 BookStore — Kubernetes Ingress Demo

A hands-on demo for teaching **Kubernetes Ingress** using a simple 3-service BookStore application.

---

## 🏗️ Architecture

```
                          ┌─────────────────────────────────────┐
                          │         K8s Cluster                  │
                          │                                       │
  Browser / curl          │  ┌────────────────────────────────┐  │
      │                   │  │      Ingress Controller        │  │
      │  HTTP Request      │  │        (nginx)                 │  │
      └──────────────────►│  │                                │  │
                          │  │  bookstore.local/              │  │
                          │  │    ├─ /api/books   ──────────► books-svc:80    ──► [pod] [pod]
                          │  │    ├─ /api/reviews ──────────► reviews-svc:80  ──► [pod] [pod]
                          │  │    └─ /             ──────────► frontend-svc:80 ──► [pod] [pod]
                          │  └────────────────────────────────┘  │
                          │                                       │
                          │  All services: ClusterIP (internal)   │
                          │  Only ONE external IP (the Ingress!)  │
                          └─────────────────────────────────────┘
```

## 📁 Project Structure

```
k8s-ingress-demo/
├── frontend/
│   ├── app.js          # Express app — HTML UI
│   ├── package.json
│   └── Dockerfile      # Multi-stage build
├── books-service/
│   ├── app.js          # Express app — Book catalog API
│   ├── package.json
│   └── Dockerfile
├── reviews-service/
│   ├── app.js          # Express app — Reviews API
│   ├── package.json
│   └── Dockerfile
└── k8s/
    ├── 00-namespace.yaml       # Namespace: bookstore
    ├── 01-frontend.yaml        # Deployment + Service (frontend)
    ├── 02-books-service.yaml   # Deployment + Service (books)
    ├── 03-reviews-service.yaml # Deployment + Service (reviews)
    └── 04-ingress.yaml         # ⭐ The Ingress resource
```

---

## 🚀 Step-by-Step Lab Instructions

### Prerequisites
- Minikube or any K8s cluster
- kubectl configured
- Docker installed

---

### Step 1 — Start Minikube & Enable Ingress Addon

```bash
minikube start

# Enable the NGINX Ingress Controller addon
minikube addons enable ingress

# Verify the controller pod is running (wait ~60s)
kubectl get pods -n ingress-nginx
```

> **Teach:** An Ingress resource alone does nothing. You need an **Ingress Controller**
> (a running pod) that watches Ingress resources and programs the proxy accordingly.

---

### Step 2 — Build Docker Images

```bash
# Point Docker to Minikube's Docker daemon (so images are available inside the cluster)
eval $(minikube docker-env)

docker build -t bookstore-frontend:latest       ./frontend/
docker build -t bookstore-books-service:latest  ./books-service/
docker build -t bookstore-reviews-service:latest ./reviews-service/
```

---

### Step 3 — Deploy All Resources

```bash
# Apply in order (namespace first)
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-frontend.yaml
kubectl apply -f k8s/02-books-service.yaml
kubectl apply -f k8s/03-reviews-service.yaml

# Verify pods and services are up
kubectl get pods,svc -n bookstore
```

---

### Step 4 — Apply the Ingress

```bash
kubectl apply -f k8s/04-ingress.yaml

# Check the Ingress was created and has an IP
kubectl get ingress -n bookstore

# Describe it to see routing rules
kubectl describe ingress bookstore-ingress -n bookstore
```

---

### Step 5 — Add Local DNS Entry

```bash
# Get the Minikube IP
minikube ip    # e.g. 192.168.49.2

# Add to /etc/hosts  (replace IP with your minikube ip)
echo "192.168.49.2  bookstore.local" | sudo tee -a /etc/hosts
```

---

### Step 6 — Test the Routing 🎉

```bash
# Frontend (root path)
curl http://bookstore.local/

# Books API
curl http://bookstore.local/api/books
curl http://bookstore.local/api/books/3

# Reviews API
curl http://bookstore.local/api/reviews
```

Or open `http://bookstore.local` in your browser!

---

### Step 7 — Observe the Routing (Discussion Points)

```bash
# Watch which pod handles requests (notice HOSTNAME changes — load balancing!)
watch -n 1 'curl -s http://bookstore.local/api/books | python3 -m json.tool'

# Scale a service and watch traffic distribute
kubectl scale deployment books-service --replicas=4 -n bookstore
kubectl get pods -n bookstore -w

# Check Ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --tail=20
```

---

## 🎓 Key Concepts to Teach

| Concept | Explanation |
|---|---|
| **Ingress vs Service** | Service exposes pods inside cluster; Ingress exposes Services outside |
| **ClusterIP** | Services are internal-only — the Ingress is the single entry point |
| **Ingress Controller** | A pod that implements the Ingress spec (nginx, traefik, etc.) |
| **Path-based routing** | One IP, multiple backends based on URL path |
| **pathType: Prefix** | Matches path AND all sub-paths (e.g. /api/books matches /api/books/1) |
| **pathType: Exact** | Only matches the exact path |
| **Host-based routing** | Different domains → different backends (extend this demo!) |

---

## 🧹 Cleanup

```bash
kubectl delete namespace bookstore
```

This deletes everything in the namespace (Deployments, Services, Ingress).
