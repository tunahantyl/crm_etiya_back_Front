package com.boran.crm.domain.mapper;


import com.boran.crm.domain.entity.Customer;
import com.boran.crm.domain.web.dto.request.CustomerRequest;
import com.boran.crm.domain.web.dto.response.CustomerResponse;
import org.mapstruct.MappingTarget;

import java.util.List;

public interface CustomerMapper {
    Customer toEntity(CustomerRequest request);


    CustomerResponse toResponse(Customer customer);

    List<CustomerResponse> toResponseList(List<Customer> customers);


    void update(@MappingTarget Customer entity, CustomerRequest request);

}
