package com.example.backend.configuration;

import com.example.backend.storage.StorageService;
import com.example.backend.storage.StorageServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class StorageConfig {

    @Value("${storage.location}")
    private String storageLocation;

    @Bean
    public StorageService storageService() {
        return new StorageServiceImpl(storageLocation);
    }
}

