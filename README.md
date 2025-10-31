# dsp-web-interface-94827-94837

## Configuring backend API URL

The frontend uses an Axios client configured via the environment variable `REACT_APP_API_BASE_URL`. For local development, ensure your backend is running (default port 3010) and set:

- Create a `.env` file in `dsp_web_frontend/` (same folder as package.json)
- Add `REACT_APP_API_BASE_URL=http://localhost:3010`
- Restart `npm start` after changes to `.env`

An example `.env.example` is provided at `dsp_web_frontend/.env.example`.

If you see a "Network error" during signup or login, verify:
- Backend server is running on the expected port (default 3010)
- CORS is enabled (it is enabled by default in this backend)
- The URL in `REACT_APP_API_BASE_URL` matches the backend
- Browser console/network tab shows the request going to the correct host/port