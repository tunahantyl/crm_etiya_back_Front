package com.boran.crm.domain.web.dto.response;

import com.boran.crm.domain.entity.TaskStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private Integer priority;
    private Float estimatedHours;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    
    // İlişkili entity bilgileri
    private Long customerId;
    private String customerName;
    private Long assignedUserId;
    private String assignedUserName;
}
