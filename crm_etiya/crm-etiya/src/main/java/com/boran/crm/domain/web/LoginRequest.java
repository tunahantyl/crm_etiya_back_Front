package com.boran.crm.domain.web;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
