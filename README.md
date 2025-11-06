# 🍽️ Restaurant API — Spring Boot Labs 1–5 

> **Author:** Phantawat Lueangsiriwattana  
> **Course:** Software Engineering — Kasetsart University  
> **Instructor:** Usa Sammapun  
>  
> A fully functional RESTful API built with **Spring Boot**, demonstrating key backend development concepts through five iterative labs:  
> - CRUD with Spring Data JPA  
> - Authentication with JWT  
> - Role-Based Authorization  
> - Pagination  
> - Validation, Error Handling, and Logging

---

## 🚀 Features Overview

| Lab | Focus Area | Key Features |
|:----|:------------|:--------------|
| **Lab 1** | Basic CRUD | JPA Entities, Repository, Controller, Service Layers |
| **Lab 2** | Authentication | JWT Tokens, Login/Signup, Secure Endpoints |
| **Lab 3** | Authorization | Role-Based Access (USER / ADMIN) |
| **Lab 4** | Pagination | Pageable APIs for large datasets |
| **Lab 5** | Validation & Logging | DTO validation, Exception handling, Login logs |

---

## 🧩 Tech Stack

- **Java 21**
- **Spring Boot 3.5.6**
- **Spring Web, Spring Data JPA**
- **Spring Security (JWT)**
- **H2 / PostgreSQL**
- **Lombok**
- **Validation API (Jakarta Validation)**
- **SLF4J Logging**

---

## 🗂️ Project Structure

```

restaurant/
├── pom.xml
├── .env
├── .gitignore
├── log/ (ignored)
└── src/
├── main/
│   ├── java/
│   │   └── ku/cs/restaurant/
│   │        ├── RestaurantApplication.java
│   │        ├── config/
│   │        │    └── JacksonConfig.java
│   │        ├── controller/
│   │        │    ├── AuthenticationController.java
│   │        │    ├── RestaurantController.java
│   │        │    └── GlobalExceptionHandler.java
│   │        ├── dto/
│   │        │    ├── LoginRequest.java
│   │        │    ├── SignupRequest.java
│   │        │    └── RestaurantRequest.java
│   │        ├── entity/
│   │        │    ├── Restaurant.java
│   │        │    └── User.java
│   │        ├── listener/
│   │        │    └── AuthenticationEventListener.java
│   │        ├── repository/
│   │        │    ├── RestaurantRepository.java
│   │        │    └── UserRepository.java
│   │        ├── security/
│   │        │    ├── SecurityConfig.java
│   │        │    ├── CustomUserDetailsService.java
│   │        │    ├── JwtUtil.java
│   │        │    ├── JwtAuthFilter.java
│   │        │    └── UnauthorizedEntryPointJwt.java
│   │        └── service/
│   │             ├── RestaurantService.java
│   │             └── UserService.java
│   └── resources/
│       ├── application.properties
│       ├── application-dev.properties
│       ├── application-test.properties
│       └── static/, templates/
└── test/
└── java/...

````

---

## ⚙️ Configuration

### `.env`
```env
SPRING_DATASOURCE_URL=jdbc:h2:mem:restaurant
SPRING_DATASOURCE_DRIVER=org.h2.Driver
SPRING_DATASOURCE_USERNAME=test
SPRING_DATASOURCE_PASSWORD=test
SPRING_JPA_HIBERNATE_DIALECT=org.hibernate.dialect.H2Dialect
JWT_SECRET=a34ece4e6bf181fdedf4c545bc7c138ad2d96ac39781f87a166a038c34893068
````

### `application.properties`

```properties
spring.application.name=restaurant
server.port=8090
spring.config.import=optional:classpath:.env[.properties]

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console/
spring.h2.console.settings.web-allow-others=true

# DataSource
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.driver.class.name=${SPRING_DATASOURCE_DRIVER}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

# JPA
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=${SPRING_JPA_HIBERNATE_DIALECT}

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=3600000

# Logging
logging.level.root=info
logging.level.org.springframework.web=info
logging.level.org.hibernate=warn
logging.level.ku.cs.restaurant.listener.AuthenticationEventListener=debug
logging.file.name=log/restaurant-api.log
```

---

## 🧠 LAB SUMMARIES

### 🧱 **Lab 1 – CRUD (JPA + REST)**

* Entities: `Restaurant`
* Basic CRUD endpoints in `RestaurantController`
* Repository & Service layers handle persistence
* Example endpoint:

  ```
  GET /api/restaurants
  POST /api/restaurants
  PUT /api/restaurants
  DELETE /api/restaurants/{id}
  ```

---

### 🔐 **Lab 2 – Authentication (JWT)**

* Added `User` entity + `UserRepository`
* `AuthenticationController` with:

    * `/api/auth/signup` — register new users
    * `/api/auth/login` — authenticate + return JWT
* JWT utilities: `JwtUtil`, `JwtAuthFilter`
* Secured routes using `SecurityConfig`
* Passwords encrypted using Argon2
* Example:

  ```
  POST /api/auth/signup
  POST /api/auth/login
  Authorization: Bearer <token>
  ```

---

### 🧾 **Lab 3 – Authorization (RBAC)**

* Roles: `ROLE_USER`, `ROLE_ADMIN`
* Added role-based access control:

    * Users can **read** restaurants
    * Admins can **create/update/delete**
* Modify user role in DB:

  ```sql
  UPDATE user_info SET role='ROLE_ADMIN' WHERE username='admin';
  ```
* Secure config:

  ```java
  .requestMatchers(HttpMethod.GET, "/api/restaurants/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
  .requestMatchers(HttpMethod.POST, "/api/restaurants").hasAuthority("ROLE_ADMIN")
  ```

---

### 📄 **Lab 4 – Pagination**

* Added pagination support with `PageRequest`
* Endpoint:

  ```
  GET /api/restaurants?offset=0&pageSize=5&sortBy=name
  ```
* Added `JacksonConfig.java` to handle JSON serialization of `Page<Restaurant>`.

---

### 🧰 **Lab 5 – Validation, Error Handling, and Logging**

#### ✅ Input Validation

Used Jakarta Validation:

```java
@NotBlank, @Size, @Min, @Max, @Pattern
```

Applied to:

* `SignupRequest.java`
* `LoginRequest.java`
* `RestaurantRequest.java`

#### ✅ Global Exception Handling

`GlobalExceptionHandler.java` handles:

* `MethodArgumentNotValidException`
* `EntityNotFoundException`
* `EntityExistsException`

Returns consistent JSON error responses.

#### ✅ Logging

* `AuthenticationEventListener.java` logs:

    * Successful logins
    * Failed login attempts (invalid user/password)
* Log file: `/log/restaurant-api.log`
* `.gitignore` updated to exclude `/log`

---

## 🧪 API Summary

| HTTP   | Endpoint                | Role         | Description                  |
| ------ | ----------------------- | ------------ | ---------------------------- |
| POST   | `/api/auth/signup`      | Public       | Register new user            |
| POST   | `/api/auth/login`       | Public       | Login and get JWT            |
| GET    | `/api/restaurants`      | USER / ADMIN | List restaurants (paginated) |
| POST   | `/api/restaurants`      | ADMIN        | Create restaurant            |
| PUT    | `/api/restaurants`      | ADMIN        | Update restaurant            |
| DELETE | `/api/restaurants/{id}` | ADMIN        | Delete restaurant            |

---

## 🧠 Example JWT Flow

```bash
# 1. Register user
curl -X POST http://localhost:8090/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"username": "admin", "password": "password123", "name": "Admin"}'

# 2. Login and get token
curl -X POST http://localhost:8090/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "admin", "password": "password123"}'

# 3. Use token to access secured route
curl -X GET http://localhost:8090/api/restaurants \
-H "Authorization: Bearer <your_token_here>"
```

---

## 📊 Example Pagination

```
GET /api/restaurants?pageSize=5&offset=1&sortBy=rating
```

Response:

```json
{
  "content": [
    { "id": "...", "name": "Cafe Mew", "rating": 5.0, "location": "Bangkok" },
    { "id": "...", "name": "KU Bistro", "rating": 4.5, "location": "Kasetsart" }
  ],
  "pageable": { "pageNumber": 1, "pageSize": 5 },
  "totalPages": 3,
  "totalElements": 15
}
```

---

## 🧾 Example Validation Errors

Request:

```json
{
  "username": "jo",
  "password": "123",
  "name": ""
}
```

Response:

```json
{
  "username": "Username must be at least 4 characters",
  "password": "Password must be at least 8 characters",
  "name": "Name is mandatory"
}
```

---

## 🪵 Example Logs

Located in `log/restaurant-api.log`

```
INFO  AuthenticationEventListener : admin successfully logged in at 2025-10-16T16:10:00Z
WARN  AuthenticationEventListener : Failed login attempt [incorrect PASSWORD]
```

---

## 🧱 Database Info

| Environment | DB         | URL                                           |
| ----------- | ---------- | --------------------------------------------- |
| **Test**    | H2         | `jdbc:h2:mem:restaurant`                      |
| **Dev**     | PostgreSQL | `jdbc:postgresql://localhost:5432/restaurant` |

---

## 🧰 Build & Run

### 🏗️ Build

```bash
mvn clean install
```

### ▶️ Run

```bash
./mvnw spring-boot:run
```

### 🌐 Access

* API Root: [http://localhost:8090/api](http://localhost:8090/api)
* H2 Console: [http://localhost:8090/h2-console](http://localhost:8090/h2-console)

---

## ✅ Summary of Learning Outcomes

| Concept            | Description                           |
| ------------------ | ------------------------------------- |
| **JPA**            | Entity modeling, CRUD repository      |
| **JWT Auth**       | Stateless login, token validation     |
| **RBAC**           | Role-based authorization (admin/user) |
| **Pagination**     | Efficient data retrieval              |
| **Validation**     | DTO-level data safety                 |
| **Error Handling** | Consistent API error responses        |
| **Logging**        | Security event tracking               |

---

## 🧾 License

This project is for **educational purposes only** as part of the Spring Web API Labs under Kasetsart University’s Software Engineering curriculum.


