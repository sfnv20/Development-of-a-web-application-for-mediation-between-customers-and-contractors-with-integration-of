package com.project.Agency;

import lombok.Data;

@Data
public class OrderDTO {
    private Long id;
    private String title;
    private String description;
    private String deadline;
    private String status;
    private String clientName;
    private String executorName;
}
