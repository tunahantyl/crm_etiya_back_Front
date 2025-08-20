package com.boran.crm.domain.web;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskCreateRequest {
    private String title;
    private String description;
    private Long customerId;
    private Long assignedUserId;
    private LocalDateTime dueDate;
    private Integer priority;
    private Float estimatedHours;
}


