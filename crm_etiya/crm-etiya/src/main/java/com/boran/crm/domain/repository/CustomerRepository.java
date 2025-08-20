package com.boran.crm.domain.repository;

import com.boran.crm.domain.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends BaseRepository<Customer> {
    // Email ile müşteri bulma
    Optional<Customer> findByEmail(String email);
    
    // İsim içeren müşterileri bulma (case-insensitive)
    List<Customer> findByNameContainingIgnoreCase(String name);
    
    // Aktif müşterileri sayfalı getirme
    Page<Customer> findByIsActiveTrue(Pageable pageable);
    
    // Belirli bir tarihten sonra oluşturulan müşteriler
    @Query("SELECT c FROM Customer c WHERE c.createdAt >= :date")
    List<Customer> findNewCustomers(@Param("date") LocalDateTime date);
    
    // İsim, email veya telefon ile arama
    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "c.phone LIKE CONCAT('%', :search, '%')")
    Page<Customer> search(@Param("search") String search, Pageable pageable);
    
    // Görev sayısına göre müşterileri getirme
    @Query("SELECT c, COUNT(t) as taskCount FROM Customer c " +
           "LEFT JOIN c.tasks t GROUP BY c.id, c.name, c.email, c.phone, " +
           "c.isActive, c.address, c.notes, c.createdAt ORDER BY taskCount DESC")
    List<Object[]> findCustomersWithTaskCount();
    
    // Adres bilgisi olan müşterileri bulma
    List<Customer> findByAddressIsNotNull();
    
    // Not içeriğine göre müşterileri bulma
    List<Customer> findByNotesContainingIgnoreCase(String noteContent);

    // Dashboard için gerekli metodlar
    long countByIsActiveTrue();
    List<Customer> findTop5ByOrderByCreatedAtDesc();
}