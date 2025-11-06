# 🍽️ Restaurant API — Spring Boot + Spring Data JPA

A simple **Spring Boot Web API** project that demonstrates how to build RESTful endpoints using **Spring Data JPA** with an **H2 in-memory database**.  
This lab follows the Kasetsart University "Spring Web API with Spring Data (JPA)" tutorial.

---

## 🚀 Features

- RESTful API built with **Spring Boot**
- Uses **Spring Data JPA** to manage data persistence
- In-memory **H2 Database** for development and testing
- Full CRUD operations:
  - Create (`POST`)
  - Read (`GET`)
  - Update (`PUT`)
  - Delete (`DELETE`)
- Search endpoints by **name** or **location**
- Simple service and repository architecture
- Environment variable configuration via `.env`

---

## 🏗️ Project Structure

```

restaurant/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ku/cs/restaurant/
│   │   │       ├── RestaurantApplication.java
│   │   │       ├── controller/
│   │   │       │   └── RestaurantController.java
│   │   │       ├── entity/
│   │   │       │   └── Restaurant.java
│   │   │       ├── repository/
│   │   │       │   └── RestaurantRepository.java
│   │   │       └── service/
│   │   │           └── RestaurantService.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       └── templates/
│   └── test/
│       └── java/
│           └── ku/cs/restaurant/
│               └── RestaurantApplicationTests.java
├── .env
├── .gitignore
├── pom.xml
└── README.md

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
````

### `application.properties`

```properties
spring.application.name=restaurant
server.port=8090
spring.config.import=optional:classpath:.env[.properties]

# Enable H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console/
spring.h2.console.settings.web-allow-others=true

# Datasource
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.driver.class.name=${SPRING_DATASOURCE_DRIVER}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

# JPA
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=${SPRING_JPA_HIBERNATE_DIALECT}
```

---

## 🧠 Entity Example

```java
@Data
@Entity
public class Restaurant {
    @Id
    @GeneratedValue
    private UUID id;
    private String name;
    private double rating;
    private String location;
    private Instant createdAt;
}
```

---

## 🌐 API Endpoints

| Method   | Endpoint                           | Description                 |
| :------- | :--------------------------------- | :-------------------------- |
| `GET`    | `/restaurants`                     | Get all restaurants         |
| `GET`    | `/restaurants/{id}`                | Get restaurant by ID        |
| `GET`    | `/restaurants/name/{name}`         | Get restaurant by name      |
| `GET`    | `/restaurants/location/{location}` | Get restaurants by location |
| `POST`   | `/restaurants`                     | Create a new restaurant     |
| `PUT`    | `/restaurants`                     | Update restaurant details   |
| `DELETE` | `/restaurants/{id}`                | Delete restaurant by ID     |

---

## 🧪 Example JSON (POST Request)

**Endpoint:** `POST http://localhost:8090/restaurants`
**Body (raw JSON):**

```json
{
  "name": "Art of Coffee",
  "rating": 5.0,
  "location": "Bangkhen"
}
```

---

## 🗄️ Access H2 Database

Open: [http://localhost:8090/h2-console](http://localhost:8090/h2-console)

| Field    | Value                    |
| :------- | :----------------------- |
| JDBC URL | `jdbc:h2:mem:restaurant` |
| Username | `test`                   |
| Password | `test`                   |

---

## ▶️ Running the Application

### From IntelliJ IDEA

1. Open `RestaurantApplication.java`
2. Click **Run ▶️**
3. Wait until the message appears:

   ```
   Tomcat started on port(s): 8090
   ```
4. Open your browser:

   * [http://localhost:8090/restaurants](http://localhost:8090/restaurants)

### From Command Line

```bash
./mvnw spring-boot:run
```

---

## 🧩 Technologies Used

* **Java 17+**
* **Spring Boot 3**
* **Spring Data JPA**
* **H2 Database**
* **Lombok**
* **Postman** (for testing)

---

## 🧑‍💻 Author

**Phantawat Lueangsiriwattana (Organ)**
Kasetsart University – Software & Knowledge Engineering
Instructor: Usa Sammapun

```

---

Would you like me to add a small **“How it works internally”** section (explaining the flow: controller → service → repository → database) for extra clarity in your README?
```
