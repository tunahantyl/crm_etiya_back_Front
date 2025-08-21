package com.boran.crm.controller;

import com.boran.crm.domain.application.TaskService;
import com.boran.crm.domain.entity.Task;
import com.boran.crm.domain.entity.TaskStatus;
import com.boran.crm.domain.web.dto.request.TaskCreateRequest;
import com.boran.crm.domain.web.dto.response.TaskResponse;
import com.boran.crm.domain.web.dto.response.TaskListResponse;
import com.boran.crm.domain.mapper.TaskMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin
public class TaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;


    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskCreateRequest request) {
        Task task = taskService.createTask(request);
        return ResponseEntity.ok(taskMapper.taskToTaskResponse(task));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody Task task
    ) {
        return ResponseEntity.ok(taskService.updateTask(id, task));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<TaskListResponse>> getAllTasks(Pageable pageable) {
        Page<Task> tasks = taskService.findAll(pageable);
        List<TaskListResponse> response = taskMapper.tasksToTaskListResponses(tasks.getContent());
        return ResponseEntity.ok(response);
    }


    @PostMapping("/{taskId}/assign/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Task> assignTask(
            @PathVariable Long taskId,
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(taskService.assignTask(taskId, userId));
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestParam TaskStatus status
    ) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status));
    }


    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Task>> getTasksByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(taskService.findTasksByCustomerId(customerId));
    }

    @GetMapping("/assigned/{userId}")
    public ResponseEntity<List<Task>> getTasksByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(taskService.findTasksByAssignedUserId(userId));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Task>> getOverdueTasks() {
        return ResponseEntity.ok(taskService.findOverdueTasks());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable TaskStatus status) {
        return ResponseEntity.ok(taskService.findTasksByStatus(status));
    }

    @GetMapping("/due-date")
    public ResponseEntity<List<Task>> getTasksByDueDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        return ResponseEntity.ok(taskService.findTasksByDueDateBetween(start, end));
    }


    @GetMapping("/count/{status}")
    public ResponseEntity<Long> getTaskCountByStatus(@PathVariable TaskStatus status) {
        return ResponseEntity.ok(taskService.countTasksByStatus(status));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Task>> getRecentTasks(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(taskService.findRecentTasks(limit));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Task>> getUpcomingDeadlines(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(taskService.findUpcomingDeadlines(days));
    }
}