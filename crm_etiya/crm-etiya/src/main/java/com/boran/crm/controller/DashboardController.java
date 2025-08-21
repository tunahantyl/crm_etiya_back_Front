package com.boran.crm.controller;

import com.boran.crm.domain.application.CustomerService;
import com.boran.crm.domain.application.TaskService;
import com.boran.crm.domain.application.UserService;
import com.boran.crm.domain.entity.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin
public class DashboardController {

    private final CustomerService customerService;
    private final TaskService taskService;
    private final UserService userService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Genel istatistikler
        stats.put("totalCustomers", customerService.countActiveCustomers());
        stats.put("totalTasks", taskService.countAllTasks());
        stats.put("completedTasks", taskService.countTasksByStatus(TaskStatus.COMPLETED));
        stats.put("pendingTasks", taskService.countTasksByStatus(TaskStatus.PENDING));
        stats.put("inProgressTasks", taskService.countTasksByStatus(TaskStatus.IN_PROGRESS));
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/user")
    public ResponseEntity<Map<String, Object>> getUserStats(Principal principal) {
        Map<String, Object> stats = new HashMap<>();
        
        // Kullanıcının email'ini al
        String userEmail = principal.getName();
        
        // Kullanıcıyı bul
        var user = userService.findByEmail(userEmail);
        if (user.isPresent()) {
            Long userId = user.get().getId();
            
            // Kullanıcıya özel istatistikler
            stats.put("assignedTasks", taskService.countTasksByAssignedUserId(userId));
            stats.put("completedTasks", taskService.countCompletedTasksByUserId(userId));
            stats.put("pendingTasks", taskService.countPendingTasksByUserId(userId));
            stats.put("inProgressTasks", taskService.countInProgressTasksByUserId(userId));
        }
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Admin özel istatistikler
        stats.put("totalUsers", userService.countAllUsers());
        stats.put("activeUsers", userService.countActiveUsers());
        stats.put("totalCustomers", customerService.countAllCustomers());
        stats.put("activeCustomers", customerService.countActiveCustomers());
        stats.put("totalTasks", taskService.countAllTasks());
        stats.put("completedTasks", taskService.countTasksByStatus(TaskStatus.COMPLETED));
        stats.put("pendingTasks", taskService.countTasksByStatus(TaskStatus.PENDING));
        stats.put("inProgressTasks", taskService.countTasksByStatus(TaskStatus.IN_PROGRESS));
        stats.put("overdueTasks", taskService.countOverdueTasks());
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/chart/task-status")
    public ResponseEntity<Map<String, Long>> getTaskStatusChart() {
        Map<String, Long> chartData = new HashMap<>();
        
        chartData.put("pending", taskService.countTasksByStatus(TaskStatus.PENDING));
        chartData.put("inProgress", taskService.countTasksByStatus(TaskStatus.IN_PROGRESS));
        chartData.put("completed", taskService.countTasksByStatus(TaskStatus.COMPLETED));
        
        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/chart/monthly-trends")
    public ResponseEntity<Map<String, Object>> getMonthlyTrends() {
        Map<String, Object> trends = new HashMap<>();
        
        // Son 6 aylık trend verileri
        trends.put("labels", taskService.getLastSixMonthsLabels());
        trends.put("completed", taskService.getCompletedTasksPerMonth());
        trends.put("created", taskService.getCreatedTasksPerMonth());
        
        return ResponseEntity.ok(trends);
    }
}
