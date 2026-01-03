# Car Market — Major Project Starter

This workspace contains a minimal Spring Boot backend and a React frontend scaffold for a car marketplace where users can buy/sell cars; sellers' submissions require admin approval.

Run backend:

```bash
cd backend
mvn spring-boot:run
```

Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Notes:
- Backend uses H2 in-memory DB with sample data. Admin actions are simple endpoints under `/api/admin`.
- This is a clean, minimal UI; extend styling or add authentication for production.
