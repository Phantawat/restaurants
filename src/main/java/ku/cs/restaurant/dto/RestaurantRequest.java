package ku.cs.restaurant.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RestaurantRequest {

    @Getter
    @NotBlank(message = "Name is mandatory")
    private String name;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private double rating;

    @NotBlank(message = "Location is mandatory")
    private String location;


}