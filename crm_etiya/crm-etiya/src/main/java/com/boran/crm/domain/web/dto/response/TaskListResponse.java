package com.boran.crm.domain.web.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskListResponse {
    private Long id;
    private String title;
    private String status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS")
    private LocalDateTime dueDate;

    private String assignedUserName;
    private String customerName;
    private Integer priority;
}
