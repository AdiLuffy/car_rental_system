# Backend (Spring Boot)

Run with:

mvn spring-boot:run

API endpoints:
- GET /api/cars — list approved, unsold cars
- POST /api/cars — submit a car to sell (added as pending)
- POST /api/cars/buy/{id} — buy a car
- GET /api/cars/pending — list pending approval cars
- POST /api/admin/approve/{id} — approve a pending car (admin)
- DELETE /api/admin/remove/{id} — remove a car

H2 console: http://localhost:8080/h2-console

