package com.boran.crm.domain.web.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CustomerRequest {
    private String username;
    private String email;
    private String phone;

}