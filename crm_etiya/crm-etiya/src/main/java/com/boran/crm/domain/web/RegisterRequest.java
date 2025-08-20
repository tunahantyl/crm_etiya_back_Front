package com.boran.crm.domain.web;

import com.boran.crm.domain.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private Role role; // Opsiyonel - null ise USER olacak
}
