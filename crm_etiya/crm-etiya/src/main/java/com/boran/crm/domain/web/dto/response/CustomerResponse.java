package com.boran.crm.domain.web.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerResponse {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private boolean isActive;

}
