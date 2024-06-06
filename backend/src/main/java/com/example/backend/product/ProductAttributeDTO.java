package com.example.backend.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductAttributeDTO {
    private UUID id;
    private String name;
    private Object value;

    public static ProductAttributeDTO convertToDTO(ProductAttribute productAttribute) {
        return new ProductAttributeDTO(
                productAttribute.getId(),
                productAttribute.getName(),
                productAttribute.getValue()
        );
    }

    public static ProductAttribute convertToEntity(ProductAttributeDTO productAttributeDTO, Product product) {
        ProductAttribute productAttribute = new ProductAttribute();
        productAttribute.setId(productAttributeDTO.getId());
        productAttribute.setName(productAttributeDTO.getName());
        productAttribute.setProduct(product);

        if (productAttributeDTO.getValue() instanceof String) {
            productAttribute.setStringValue((String) productAttributeDTO.getValue());
        } else if (productAttributeDTO.getValue() instanceof Integer) {
            productAttribute.setIntegerValue((Integer) productAttributeDTO.getValue());
        } else if (productAttributeDTO.getValue() instanceof Double) {
            productAttribute.setDoubleValue((Double) productAttributeDTO.getValue());
        } else {
            throw new IllegalArgumentException("Unsupported value type: " + productAttributeDTO.getValue().getClass());
        }

        return productAttribute;
    }
}
