package com.example.backend.quality;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "qualities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quality {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID qualityId;

    @Column(nullable = false, unique = true)
    private String name;

}
