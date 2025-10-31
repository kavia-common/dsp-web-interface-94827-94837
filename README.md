# dsp-web-interface-94827-94837

## Configuring backend API URL

The frontend uses an Axios client configured via the environment variable `REACT_APP_API_BASE_URL`. For local development, ensure your backend is running (default port 3010) and set:

- Create a `.env` file in `dsp_web_frontend/` (same folder as package.json)
- Add `REACT_APP_API_BASE_URL=http://localhost:3010`
- Restart `npm start` after changes to `.env`

An example `.env.example` is provided at `dsp_web_frontend/.env.example`.

The backend requires a `JWT_SECRET` in its environment to sign tokens. Create a `.env` in `dsp-auth-backend/` and set:
- `JWT_SECRET=some_dev_secret`
- Optionally set `SQLITE_DB_PATH` (defaults to `data/app.db`)
- Optionally set `CORS_ALLOWED_ORIGINS` to a comma-separated list (e.g. `http://localhost:3000,http://127.0.0.1:3000`). In development, if you omit `CORS_ALLOWED_ORIGINS` and set `NODE_ENV=development`, all origins will be allowed temporarily to ease debugging.
- A `.env.example` is provided at `dsp-auth-backend/.env.example`.

New diagnostics:
- Frontend logs: `[API] Base URL resolved to:` and for auth calls `[API] Request URL: <full URL>`.
- Backend logs on startup: host, port, environment, and `CORS allowed origins`.
- Health check endpoint: `GET /health` returns `{ success: true, message: "OK" }`.

If you see a "Network error" during signup or login, verify:
1. Backend server is running on the expected host/port (default `0.0.0.0:3010` → reachable at `http://localhost:3010`).
2. CORS allows your frontend origin (`http://localhost:3000` or `http://127.0.0.1:3000`) and preflight OPTIONS receives `204` with `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers`.
3. The URL in `REACT_APP_API_BASE_URL` matches the backend (open console to see `[API] Base URL resolved to:`).
4. The Browser console/network tab shows request to the expected host/port and no blocked “Mixed Content”.
5. You receive either a 201 Created on signup or a clear 4xx JSON error with `message` (e.g., 409 for duplicate email), not an Axios `ERR_NETWORK`.

HTTPS/HTTP mismatch:
- If your frontend is served over HTTPS (e.g. via a tunnel), calling an HTTP backend (http://localhost:3010) may be blocked by the browser (Mixed Content).
- Solutions:
  - Run/load the frontend over HTTP during local dev, or
  - Expose the backend via HTTPS and set `REACT_APP_API_BASE_URL` to that HTTPS URL, or
  - Use a local reverse proxy to terminate TLS and forward to the backend.

Manual test:
1. Start backend: `NODE_ENV=development JWT_SECRET=dev HOST=0.0.0.0 PORT=3010 node src/index.js`
2. Check health: `curl -i http://localhost:3010/health` → expect `200` JSON.
3. Test preflight: `curl -i -X OPTIONS http://localhost:3010/auth/signup -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: content-type"`
4. From the app, sign up with a new email. Expect `201`. If already exists, you should see `409` with JSON `{ success:false, message: "Email already in use" }`.