package com.boran.crm.domain.mapper;

import com.boran.crm.domain.entity.Task;
import com.boran.crm.domain.web.dto.request.TaskCreateRequest;
import com.boran.crm.domain.web.dto.response.TaskResponse;
import com.boran.crm.domain.web.dto.response.TaskListResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.Builder;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true))
public interface TaskMapper {

    Task taskCreateRequestToTask(TaskCreateRequest request);

    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "assignedTo.id", target = "assignedUserId")
    @Mapping(source = "assignedTo.fullName", target = "assignedUserName")
    TaskResponse taskToTaskResponse(Task task);

    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "assignedTo.fullName", target = "assignedUserName")
    TaskListResponse taskToTaskListResponse(Task task);

    List<TaskListResponse> tasksToTaskListResponses(List<Task> tasks);

    @Named("formatPriority")
    default Integer formatPriority(Integer priority) {
        return priority != null ? priority : 0;
    }
}