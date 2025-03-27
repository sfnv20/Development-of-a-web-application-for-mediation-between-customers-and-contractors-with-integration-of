package com.project.Agency;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class OrderRequest {
    private String title;
    private String description;
    private LocalDate deadline; // Дедлайн у форматі ISO-8601 (наприклад, "2025-04-01")
}
