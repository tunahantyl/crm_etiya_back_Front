package com.boran.crm.domain.web.dto.response;

import com.boran.crm.domain.entity.Role;
import lombok.Data;

@Data
public class UserListResponse {
    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private boolean active;
}
