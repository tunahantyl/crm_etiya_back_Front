package com.boran.crm.domain.repository;

import com.boran.crm.domain.entity.User;
import com.boran.crm.domain.entity.Role;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends BaseRepository<User> {
    // Email (username olarak kullanılıyor) ile kullanıcı bulma
    Optional<User> findByEmail(String email);
    
    // Aktif kullanıcıları bulma
    List<User> findByIsActiveTrue();
    
    // Email ile kullanıcı var mı kontrolü
    boolean existsByEmail(String email);
    
    // Role'e göre kullanıcıları bulma
    List<User> findByRole(Role role);
    
    @Query("SELECT DISTINCT u FROM User u JOIN u.assignedTasks t")
    List<User> findUsersWithAssignedTasks();
    
    // Belirli bir müşterinin görevlerine atanmış kullanıcıları bulma
    @Query("SELECT DISTINCT u FROM User u JOIN u.assignedTasks t WHERE t.customer.id = :customerId")
    List<User> findUsersByCustomerId(@Param("customerId") Long customerId);
    
    // Dashboard istatistikleri
    long countByIsActive(boolean isActive);
}