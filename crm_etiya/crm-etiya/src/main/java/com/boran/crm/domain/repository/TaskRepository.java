package com.boran.crm.domain.repository;

import com.boran.crm.domain.entity.Task;
import com.boran.crm.domain.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends BaseRepository<Task> {
    // Müşteriye ait görevleri bulma
    List<Task> findByCustomerId(Long customerId);

    // Kullanıcıya atanmış görevleri bulma
    List<Task> findByAssignedToId(Long userId);

    // Duruma göre görevleri bulma
    List<Task> findByStatus(TaskStatus status);

    // Gecikmiş görevleri bulma
    @Query("SELECT t FROM Task t WHERE t.status != :completedStatus AND t.dueDate < :now")
    List<Task> findOverdueTasks(
            @Param("completedStatus") TaskStatus completedStatus,
            @Param("now") LocalDateTime now
    );

    // Yaklaşan görevleri bulma (örn: önümüzdeki 7 gün)
    @Query("SELECT t FROM Task t WHERE t.status != :completedStatus " +
            "AND t.dueDate BETWEEN :start AND :end")
    List<Task> findUpcomingTasks(
            @Param("completedStatus") TaskStatus completedStatus,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    // Kullanıcının duruma göre görevlerini sayfalı getirme
    Page<Task> findByAssignedToIdAndStatus(
            Long userId,
            TaskStatus status,
            Pageable pageable
    );

    // Önceliğe göre görevleri sıralama
    @Query("SELECT t FROM Task t WHERE t.status != :completedStatus " +
            "ORDER BY t.priority DESC, t.dueDate ASC")
    List<Task> findPriorityTasks(@Param("completedStatus") TaskStatus completedStatus);

    // Görev istatistikleri
    @Query("SELECT t.status, COUNT(t) FROM Task t GROUP BY t.status")
    List<Object[]> getTaskStatistics();

    // Tahmini süreye göre görevleri bulma
    List<Task> findByEstimatedHoursGreaterThan(Float hours);

    // Tamamlanma süresine göre görevleri bulma
    List<Task> findByCompletedAtBetween(LocalDateTime start, LocalDateTime end);

    // Tarih aralığına göre görevleri bulma
    List<Task> findByDueDateBetween(LocalDateTime start, LocalDateTime end);

    // Tamamlanmış olmayan görevlerde tarih aralığı filtresi
    List<Task> findByDueDateBetweenAndStatusNot(LocalDateTime start, LocalDateTime end, TaskStatus status);

    // En yeni görevleri (dinamik limit için Pageable ile) getirme
    List<Task> findAllByOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);

    // Müşteri ve durum bazlı görevleri bulma
    List<Task> findByCustomerIdAndStatus(Long customerId, TaskStatus status);

    // Dashboard için gerekli metodlar
    long countByStatus(TaskStatus status);
    List<Task> findTop5ByStatusOrderByDueDateAsc(TaskStatus status);

    // Task trend analizi için
    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = :status AND " +
            "DATE(t.createdAt) = DATE(:date)")
    long countByStatusAndDate(
            @Param("status") TaskStatus status,
            @Param("date") LocalDateTime date
    );

    // Dashboard için ek istatistik metodları
    long countByAssignedToId(Long userId);
    long countByAssignedToIdAndStatus(Long userId, TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status != :completedStatus AND t.dueDate < :now")
    long countOverdueTasks(
            @Param("completedStatus") TaskStatus completedStatus,
            @Param("now") LocalDateTime now
    );

    // Aylık trendler için
    long countByStatusAndCompletedAtBetween(TaskStatus status, LocalDateTime start, LocalDateTime end);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}