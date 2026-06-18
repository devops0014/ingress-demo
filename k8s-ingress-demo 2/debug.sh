#!/bin/bash
# ============================================================
# debug.sh — Run this when you get a 404 or things don't work
# Usage: bash debug.sh
# ============================================================

NS="bookstore"
echo ""
echo "========================================"
echo " K8s Ingress Debug Script"
echo "========================================"

echo ""
echo "── 1. IngressClass (must show 'nginx') ──"
kubectl get ingressclass

echo ""
echo "── 2. Ingress resource ──"
kubectl get ingress -n $NS
echo ""
kubectl describe ingress bookstore-ingress -n $NS | grep -A 30 "Rules:"

echo ""
echo "── 3. Services ──"
kubectl get svc -n $NS

echo ""
echo "── 4. Pods (all must be Running) ──"
kubectl get pods -n $NS

echo ""
echo "── 5. Endpoints (must NOT be <none>) ──"
kubectl get endpoints -n $NS

echo ""
echo "── 6. Ingress controller pod logs (last 20 lines) ──"
kubectl logs -n ingress-nginx \
  $(kubectl get pods -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx -o jsonpath='{.items[0].metadata.name}') \
  --tail=20

echo ""
echo "── 7. /etc/hosts entry ──"
grep bookstore.local /etc/hosts || echo "❌ bookstore.local not found in /etc/hosts!"
echo ""
echo "   Add it with:"
echo "   echo \"\$(minikube ip)  bookstore.local\" | sudo tee -a /etc/hosts"

echo ""
echo "── 8. Quick connectivity test ──"
echo "Testing http://bookstore.local ..."
curl -sv http://bookstore.local 2>&1 | grep -E "< HTTP|Connected|refused|could not"
