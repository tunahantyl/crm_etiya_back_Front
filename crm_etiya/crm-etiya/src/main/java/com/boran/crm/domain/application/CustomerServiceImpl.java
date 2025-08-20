package com.boran.crm.domain.application;

import com.boran.crm.domain.entity.Customer;
import com.boran.crm.domain.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    
    private final CustomerRepository customerRepository;

    @Override
    public Customer createCustomer(Customer customer) {
        // Email benzersizlik kontrolü
        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            throw new RuntimeException("Customer with email " + customer.getEmail() + " already exists");
        }
        
        // Varsayılan değerleri ayarla
        if (customer.isActive() == false) {
            customer.setActive(true);
        }
        
        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        return customerRepository.findById(id)
                .map(customer -> {
                    // Email güncellenmesi durumunda benzersizlik kontrolü
                    if (!customer.getEmail().equals(updatedCustomer.getEmail())) {
                        if (customerRepository.findByEmail(updatedCustomer.getEmail()).isPresent()) {
                            throw new RuntimeException("Customer with email " + updatedCustomer.getEmail() + " already exists");
                        }
                        customer.setEmail(updatedCustomer.getEmail());
                    }
                    
                    // Diğer alanları güncelle
                    if (updatedCustomer.getName() != null) {
                        customer.setName(updatedCustomer.getName());
                    }
                    if (updatedCustomer.getPhone() != null) {
                        customer.setPhone(updatedCustomer.getPhone());
                    }
                    if (updatedCustomer.getAddress() != null) {
                        customer.setAddress(updatedCustomer.getAddress());
                    }
                    if (updatedCustomer.getNotes() != null) {
                        customer.setNotes(updatedCustomer.getNotes());
                    }
                    
                    return customerRepository.save(customer);
                })
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    @Override
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        
        // Soft delete - sadece inactive yap
        customer.setActive(false);
        customerRepository.save(customer);
    }

    @Override
    public Optional<Customer> findById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public Page<Customer> findAll(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    @Override
    public Optional<Customer> findByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    @Override
    public List<Customer> findByNameContaining(String name) {
        return customerRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public Page<Customer> findActiveCustomers(Pageable pageable) {
        return customerRepository.findByIsActiveTrue(pageable);
    }

    @Override
    public Page<Customer> searchCustomers(String search, Pageable pageable) {
        return customerRepository.search(search, pageable);
    }

    @Override
    public void activateCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        customer.setActive(true);
        customerRepository.save(customer);
    }

    @Override
    public void deactivateCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        customer.setActive(false);
        customerRepository.save(customer);
    }

    @Override
    public long countActiveCustomers() {
        return customerRepository.countByIsActiveTrue();
    }

    @Override
    public List<Customer> findRecentCustomers(LocalDateTime since) {
        return customerRepository.findNewCustomers(since);
    }

    @Override
    public List<Customer> findTop5RecentCustomers() {
        return customerRepository.findTop5ByOrderByCreatedAtDesc();
    }

    @Override
    public List<Object[]> findCustomersWithTaskCount() {
        return customerRepository.findCustomersWithTaskCount();
    }

    @Override
    public long countAllCustomers() {
        return customerRepository.count();
    }
}