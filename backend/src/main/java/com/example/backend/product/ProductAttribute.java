package com.example.backend.product;

import com.example.backend.category.CategoryField;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "product_attributes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column
    private String name;

    @Column(name = "value_converted_to_string")
    private String stringValue;

    @Column
    private Integer integerValue;

    @Column
    private Double doubleValue;

    @Transient
    private Object value;

    public ProductAttribute(String name, String stringValue, Product product) {
        this.name = name;
        this.stringValue = stringValue;
        this.product = product;
    }

    public ProductAttribute(String name, Integer integerValue, Product product) {
        this.name = name;
        this.integerValue = integerValue;
        this.product = product;
    }

    public ProductAttribute(String name, Double doubleValue, Product product) {
        this.name = name;
        this.doubleValue = doubleValue;
        this.product = product;
    }
    public void updateValues(ProductAttributeDTO dto) {
        this.name = dto.getName();
        if (dto.getValue() instanceof String) {
            this.stringValue = (String) dto.getValue();
        } else if (dto.getValue() instanceof Integer) {
            this.integerValue = (Integer) dto.getValue();
        } else if (dto.getValue() instanceof Double) {
            this.doubleValue = (Double) dto.getValue();
        } else {
            throw new IllegalArgumentException("Unsupported value type: " + dto.getValue().getClass());
        }
    }

    public void setValue(Object value) {
        this.value = value;
        if (value instanceof String) {
            this.stringValue = (String) value;
        } else if (value instanceof Integer) {
            this.integerValue = (Integer) value;
        } else if (value instanceof Double) {
            this.doubleValue = (Double) value;
        } else {
            throw new IllegalArgumentException("Unsupported value type: " + value.getClass());
        }
    }

    public Object getValue() {
        if (this.stringValue != null) {
            return this.stringValue;
        } else if (this.integerValue != null) {
            return this.integerValue;
        } else if (this.doubleValue != null) {
            return this.doubleValue;
        } else {
            return null;
        }
    }
}
