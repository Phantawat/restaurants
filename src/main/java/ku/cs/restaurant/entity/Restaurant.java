package ku.cs.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
@Entity
public class Restaurant {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(unique = true)
    private String name;
    private double rating;
    private String location;
    private Instant createdAt;
    private Instant updatedAt;
}
