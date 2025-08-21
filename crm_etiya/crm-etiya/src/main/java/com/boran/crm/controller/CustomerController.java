package com.boran.crm.controller;

import com.boran.crm.domain.application.CustomerService;
import com.boran.crm.domain.entity.Customer;
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
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin
public class CustomerController {

    private final CustomerService customerService;

    // Temel CRUD endpoint'leri
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.createCustomer(customer));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable Long id,
            @RequestBody Customer customer
    ) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customer));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return customerService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<Page<Customer>> getAllCustomers(Pageable pageable) {
        return ResponseEntity.ok(customerService.findAll(pageable));
    }

    // Filtreleme ve arama endpoint'leri
    @GetMapping("/active")
    public ResponseEntity<Page<Customer>> getActiveCustomers(Pageable pageable) {
        return ResponseEntity.ok(customerService.findActiveCustomers(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Customer>> searchCustomers(
            @RequestParam String query,
            Pageable pageable
    ) {
        return ResponseEntity.ok(customerService.searchCustomers(query, pageable));
    }

    @GetMapping("/by-name")
    public ResponseEntity<List<Customer>> getCustomersByName(@RequestParam String name) {
        return ResponseEntity.ok(customerService.findByNameContaining(name));
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<Customer> getCustomerByEmail(@PathVariable String email) {
        return customerService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Müşteri durumu yönetimi
    @PostMapping("/{id}/activate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> activateCustomer(@PathVariable Long id) {
        customerService.activateCustomer(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/deactivate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deactivateCustomer(@PathVariable Long id) {
        customerService.deactivateCustomer(id);
        return ResponseEntity.ok().build();
    }

    // Dashboard ve raporlama endpoint'leri
    @GetMapping("/count/active")
    public ResponseEntity<Long> getActiveCustomerCount() {
        return ResponseEntity.ok(customerService.countActiveCustomers());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Customer>> getRecentCustomers(
            @RequestParam(defaultValue = "7") int days
    ) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return ResponseEntity.ok(customerService.findRecentCustomers(since));
    }

    @GetMapping("/top5-recent")
    public ResponseEntity<List<Customer>> getTop5RecentCustomers() {
        return ResponseEntity.ok(customerService.findTop5RecentCustomers());
    }

    @GetMapping("/with-task-count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<Object[]>> getCustomersWithTaskCount() {
        return ResponseEntity.ok(customerService.findCustomersWithTaskCount());
    }
}