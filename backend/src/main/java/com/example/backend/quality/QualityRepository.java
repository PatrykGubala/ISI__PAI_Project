package com.example.backend.quality;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QualityRepository extends JpaRepository<Quality, UUID> {
}

