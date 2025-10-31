# HTTPS Smoke Test (Local Dev)

This guide validates end-to-end auth flow with HTTPS backend on https://localhost:3011 and React frontend over HTTPS.

Prereqs:
- Backend: env includes `HOST=0.0.0.0`, `PORT=3011`, `JWT_SECRET=dev_secret`, `HTTPS_ENABLE=true`, `HTTPS_KEY_PATH`, `HTTPS_CERT_PATH`
- Frontend: `.env` contains `REACT_APP_API_BASE_URL=https://localhost:3011`

1) Backend health
- curl -i -k https://localhost:3011/health
Expect 200 JSON: {"success":true,"message":"OK"}

2) CORS allows exact HTTPS origin
- Ensure backend CORS_ALLOWED_ORIGINS includes `https://localhost:3000` (and/or `https://127.0.0.1:3000`) when not in dev-allow-all.
- Do NOT include `http://` origins if your frontend is served via `https://`; keep list strict (no wildcard).
- Backend logs "CORS allowed origins:" on startup.

3) Preflight OPTIONS /auth/signup (HTTPS)
- curl -i -k -X OPTIONS https://localhost:3011/auth/signup \
  -H "Origin: https://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type"
Expect 204 with Access-Control-Allow-Origin and -Headers. If the origin is not in CORS_ALLOWED_ORIGINS, expect 403 with JSON error.

4) Signup
- curl -i -k -X POST https://localhost:3011/auth/signup \
  -H "Origin: https://localhost:3000" \
  -H "Content-Type: application/json" \
  --data '{"name":"Test","email":"fresh@example.com","password":"Passw0rd!"}'
Expect 201 JSON. Retry with same email to see 409.

5) Login
- curl -i -k -X POST https://localhost:3011/auth/login \
  -H "Origin: https://localhost:3000" \
  -H "Content-Type: application/json" \
  --data '{"email":"fresh@example.com","password":"Passw0rd!"}'
Expect 200 JSON with token.

6) Frontend config
- In dsp_web_frontend/.env set:
  REACT_APP_API_BASE_URL=https://localhost:3011
- Restart npm start. Console should log:
  [API] Base URL resolved to: https://localhost:3011
- Network tab shows absolute HTTPS URLs.

7) Certificate trust
- If browser/axios shows certificate errors, install/trust mkcert CA:
  mkcert -install
  mkcert localhost 127.0.0.1 ::1
- Update backend .env with the generated key/cert paths and restart.

Notes:
- withCredentials is not required unless you add cookie-based auth.
- Backend binds 0.0.0.0; access via https://localhost:3011 from the same machine.
