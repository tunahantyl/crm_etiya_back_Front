package com.boran.crm.domain.web;

import com.boran.crm.domain.entity.TaskStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskListResponse {
    private Long id;
    private String title;
    private TaskStatus status;
    private LocalDateTime dueDate;
    private String assignedUserName;
    private String customerName;
    private Integer priority;
}
