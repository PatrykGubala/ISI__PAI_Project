package com.example.backend.category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryCreateDTO {
    private String name;
    private String description;
    private UUID parentCategoryId;
    private List<CategoryField> fields;

    public static Category convertToEntity(CategoryCreateDTO categoryCreateDTO, CategoryRepository categoryRepository) {
        Category parentCategory = categoryCreateDTO.getParentCategoryId() != null ? categoryRepository.findById(categoryCreateDTO.getParentCategoryId()).orElse(null) : null;
        return new Category(UUID.randomUUID(), categoryCreateDTO.getName(), categoryCreateDTO.getDescription(), parentCategory, null, categoryCreateDTO.getFields());
    }
}