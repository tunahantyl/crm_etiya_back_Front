package com.boran.crm.domain.repository;

import com.boran.crm.domain.entity.BaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface BaseRepository<T extends BaseEntity> extends JpaRepository<T, Long> {
    // Tüm repository'lerde ortak olacak metodlar buraya yazılır
}