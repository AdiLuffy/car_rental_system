# Frontend (React + Vite)

Install and run:

```bash
cd frontend
npm install
npm run dev
```

- App expects backend at `http://localhost:8080`.
- Routes: `/` home, `/sell` submit car, `/admin` admin dashboard.

Hosting:
- Build with `npm run build` and deploy the `dist` to Vercel/Netlify.
- For CORS, ensure backend allows requests from the deployed site.
