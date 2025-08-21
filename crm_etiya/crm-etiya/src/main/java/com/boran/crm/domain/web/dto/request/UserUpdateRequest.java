package com.boran.crm.domain.web.dto.request;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String fullName;
    private boolean active;
    // Şifre ayrı endpoint'te güncellenir, burada dahil etmiyoruz
}
