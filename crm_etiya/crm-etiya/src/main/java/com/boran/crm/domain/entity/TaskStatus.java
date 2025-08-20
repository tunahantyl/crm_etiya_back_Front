package com.boran.crm.domain.entity;

public enum TaskStatus {
    PENDING("Beklemede"),
    IN_PROGRESS("Devam Ediyor"),
    COMPLETED("Tamamlandı"),
    CANCELLED("İptal Edildi");
    
    private final String displayName;
    
    TaskStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}