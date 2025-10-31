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

If you see a "Network error" during signup or login, verify:
- Backend server is running on the expected port (default 3010)
- CORS is enabled for http://localhost:3000 and http://127.0.0.1:3000 (preflight OPTIONS supported)
- The URL in `REACT_APP_API_BASE_URL` matches the backend (open console to see `[API] Base URL resolved to:`)
- Browser console/network tab shows the request going to the correct host/port
- You receive either a 201 Created on signup or a clear 4xx JSON error with `message`