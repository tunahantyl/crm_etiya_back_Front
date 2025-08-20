package com.boran.crm.domain.application;

import com.boran.crm.domain.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CustomerService {
    // Temel CRUD operasyonları
    Customer createCustomer(Customer customer);
    Customer updateCustomer(Long id, Customer customer);
    void deleteCustomer(Long id);
    Optional<Customer> findById(Long id);
    Page<Customer> findAll(Pageable pageable);
    
    // Arama ve filtreleme
    Optional<Customer> findByEmail(String email);
    List<Customer> findByNameContaining(String name);
    Page<Customer> findActiveCustomers(Pageable pageable);
    Page<Customer> searchCustomers(String search, Pageable pageable);
    
    // Business metodları
    void activateCustomer(Long id);
    void deactivateCustomer(Long id);
    
    // Dashboard ve raporlama
    long countActiveCustomers();
    long countAllCustomers();
    List<Customer> findRecentCustomers(LocalDateTime since);
    List<Customer> findTop5RecentCustomers();
    List<Object[]> findCustomersWithTaskCount();
}