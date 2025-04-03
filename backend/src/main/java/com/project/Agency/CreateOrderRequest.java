package com.project.Agency;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class CreateOrderRequest {
    // Геттери та сеттери
    private Long clientId;
    private String title;
    private String description;
    private String deadline;

}
