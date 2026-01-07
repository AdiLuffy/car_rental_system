# How to Start the Application

## Start Backend Server (Port 8080)

1. Open a terminal
2. Navigate to the backend directory:
   ```bash
   cd "/Users/adithyadanda/Desktop/car rental system/backend"
   ```
3. Start the Spring Boot server:
   ```bash
   mvn spring-boot:run
   ```
4. Wait for the message: "Started Application" (takes about 10-30 seconds)

## Start Frontend Server (Port 5173)

1. Open a **new terminal** (keep backend running)
2. Navigate to the frontend directory:
   ```bash
   cd "/Users/adithyadanda/Desktop/car rental system/frontend"
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. The frontend will be available at: http://localhost:5173

## Verify Both Servers Are Running

- Backend: http://localhost:8080 (you should see a Whitelabel Error Page or H2 console)
- Frontend: http://localhost:5173 (you should see the login page)

## Troubleshooting

If you get "port already in use" errors:
- Backend (8080): `lsof -ti:8080 | xargs kill -9`
- Frontend (5173): `lsof -ti:5173 | xargs kill -9`

Then restart the servers.
