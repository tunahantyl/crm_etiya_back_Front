package com.boran.crm.domain.application;

import com.boran.crm.domain.entity.Task;
import com.boran.crm.domain.entity.TaskStatus;
import com.boran.crm.domain.entity.User;
import com.boran.crm.domain.entity.Customer;
import com.boran.crm.domain.repository.TaskRepository;
import com.boran.crm.domain.repository.UserRepository;
import com.boran.crm.domain.repository.CustomerRepository;
import com.boran.crm.domain.web.dto.request.TaskCreateRequest;
import com.boran.crm.domain.mapper.TaskMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
@Transactional
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final TaskMapper taskMapper;

    @Override
    public Task createTask(Task task) {
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.PENDING);
        }

        task.setCreatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    @Override
    public Task createTask(TaskCreateRequest request) {

        Task task = taskMapper.taskCreateRequestToTask(request);
        task.setStatus(TaskStatus.PENDING);
        task.setCreatedAt(LocalDateTime.now());


        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found with id: " + request.getCustomerId()));
            task.setCustomer(customer);
        }


        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getAssignedUserId()));
            task.setAssignedTo(assignedUser);
        }

        return createTask(task);
    }

    @Override
    public Task updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id)
                .map(task -> {

                    if (updatedTask.getTitle() != null) {
                        task.setTitle(updatedTask.getTitle());
                    }
                    if (updatedTask.getDescription() != null) {
                        task.setDescription(updatedTask.getDescription());
                    }
                    if (updatedTask.getDueDate() != null) {
                        task.setDueDate(updatedTask.getDueDate());
                    }
                    if (updatedTask.getPriority() != null) {
                        task.setPriority(updatedTask.getPriority());
                    }
                    if (updatedTask.getStatus() != null) {
                        task.setStatus(updatedTask.getStatus());
                    }

                    return taskRepository.save(task);
                })
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public Page<Task> findAll(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    @Override
    public Task assignTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        task.setAssignedTo(user);

        // Eğer task PENDING durumundaysa IN_PROGRESS'e çek
        if (task.getStatus() == TaskStatus.PENDING) {
            task.setStatus(TaskStatus.IN_PROGRESS);
        }

        return taskRepository.save(task);
    }

    @Override
    public Task updateTaskStatus(Long taskId, TaskStatus status) {
        return taskRepository.findById(taskId)
                .map(task -> {
                    task.setStatus(status);

                    // Eğer task tamamlandıysa, tamamlanma tarihini set et
                    if (status == TaskStatus.COMPLETED) {
                        task.setCompletedAt(LocalDateTime.now());
                    }

                    return taskRepository.save(task);
                })
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Override
    public List<Task> findTasksByCustomerId(Long customerId) {
        return taskRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Task> findTasksByAssignedUserId(Long userId) {
        return taskRepository.findByAssignedToId(userId);
    }

    @Override
    public List<Task> findOverdueTasks() {
        return taskRepository.findOverdueTasks(TaskStatus.COMPLETED, LocalDateTime.now());
    }

    @Override
    public List<Task> findTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    @Override
    public List<Task> findTasksByDueDateBetween(LocalDateTime start, LocalDateTime end) {
        return taskRepository.findByDueDateBetween(start, end);
    }

    @Override
    public long countTasksByStatus(TaskStatus status) {
        return taskRepository.countByStatus(status);
    }

    @Override
    public List<Task> findRecentTasks(int limit) {
        return taskRepository.findAllByOrderByCreatedAtDesc(org.springframework.data.domain.PageRequest.of(0, limit));
    }

    @Override
    public List<Task> findUpcomingDeadlines(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime future = now.plusDays(days);
        return taskRepository.findByDueDateBetweenAndStatusNot(now, future, TaskStatus.COMPLETED);
    }

    @Override
    public long countAllTasks() {
        return taskRepository.count();
    }

    @Override
    public long countTasksByAssignedUserId(Long userId) {
        return taskRepository.countByAssignedToId(userId);
    }

    @Override
    public long countCompletedTasksByUserId(Long userId) {
        return taskRepository.countByAssignedToIdAndStatus(userId, TaskStatus.COMPLETED);
    }

    @Override
    public long countPendingTasksByUserId(Long userId) {
        return taskRepository.countByAssignedToIdAndStatus(userId, TaskStatus.PENDING);
    }

    @Override
    public long countInProgressTasksByUserId(Long userId) {
        return taskRepository.countByAssignedToIdAndStatus(userId, TaskStatus.IN_PROGRESS);
    }

    @Override
    public long countOverdueTasks() {
        return taskRepository.countOverdueTasks(TaskStatus.COMPLETED, LocalDateTime.now());
    }

    @Override
    public List<String> getLastSixMonthsLabels() {
        List<String> labels = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        LocalDateTime now = LocalDateTime.now();

        for (int i = 5; i >= 0; i--) {
            LocalDateTime month = now.minusMonths(i);
            labels.add(month.format(formatter));
        }

        return labels;
    }

    @Override
    public List<Long> getCompletedTasksPerMonth() {
        List<Long> counts = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (int i = 5; i >= 0; i--) {
            LocalDateTime startOfMonth = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);

            long count = taskRepository.countByStatusAndCompletedAtBetween(TaskStatus.COMPLETED, startOfMonth, endOfMonth);
            counts.add(count);
        }

        return counts;
    }

    @Override
    public List<Long> getCreatedTasksPerMonth() {
        List<Long> counts = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (int i = 5; i >= 0; i--) {
            LocalDateTime startOfMonth = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);

            long count = taskRepository.countByCreatedAtBetween(startOfMonth, endOfMonth);
            counts.add(count);
        }

        return counts;
    }
}