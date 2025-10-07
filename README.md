# APDS7311 — Secure International Payments Portal (Full Project)

This repository contains a secure customer portal and staff portal for an international payments flow (Node/Express + MongoDB backend, React + Tailwind frontend). It includes security features required for the assignment: password hashing, input whitelisting, SSL (local), CSRF protection, JWT tokens (HttpOnly cookies), Helmet/CSP, rate limiting, input sanitization, and staff verification.

---

## Quick start (Windows PowerShell, Node.js v18+)

1. Clone/prepare folder:
   - Put this project at:
     `C:\Users\RC_Student_Lab\OneDrive - ADvTECH Ltd\School\APDS7311`
   - Open PowerShell and `cd` there.

2. Backend setup
```powershell
cd backend
npm install
# generate SSL certs (self-signed) — accept prompts
mkdir ssl
cd ssl
openssl req -nodes -new -x509 -keyout key.pem -out cert.pem -days 365
# go back
cd ..
# copy .env.example -> .env and edit (MONGO_URI if using Atlas)
copy .env.example .env
# optionally create MongoDB database (local or Atlas)
npm run seed
npm start
