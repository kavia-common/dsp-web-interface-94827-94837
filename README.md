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
- Optionally set `CORS_ALLOWED_ORIGINS` to a comma-separated list (e.g. `http://localhost:3000,http://127.0.0.1:3000`). In development, you may set `*` to allow all origins temporarily.
- A `.env.example` is provided at `dsp-auth-backend/.env.example`.

New diagnostics:
- Frontend logs: `[API] Base URL resolved to:` and for auth calls `[API] Request URL: <full URL>`.
- Backend logs on startup: port, environment, and `CORS allowed origins`.
- Health check endpoint: `GET /health` returns `{ success: true, message: "OK" }`.

If you see a "Network error" during signup or login, verify:
- Backend server is running on the expected port (default 3010)
- CORS is enabled for http://localhost:3000 and http://127.0.0.1:3000 (preflight OPTIONS supported). In development you can set `NODE_ENV=development` and omit `CORS_ALLOWED_ORIGINS` to allow all origins temporarily or set `CORS_ALLOWED_ORIGINS=*`.
- The URL in `REACT_APP_API_BASE_URL` matches the backend (open console to see `[API] Base URL resolved to:`)
- Browser console/network tab shows the request going to the correct host/port and the preflight OPTIONS 204 succeeds
- You receive either a 201 Created on signup or a clear 4xx JSON error with `message`

Manual test:
1. Start backend: `NODE_ENV=development JWT_SECRET=dev node src/index.js`
2. Check health: `curl -i http://localhost:3010/health`
3. From the app, sign up with a new email. Expect 201. If already exists, you should see 409 with JSON `{ success:false, message: "Email already in use" }`.