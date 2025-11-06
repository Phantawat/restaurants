package ku.cs.restaurant.dto;

import lombok.Data;

@Data
public class RestaurantRequest {
    private String name;
    private double rating;
    private String location;
}
