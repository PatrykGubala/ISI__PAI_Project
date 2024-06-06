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
public class CategoryDTO {
    private UUID categoryId;
    private String name;
    private String description;
    private UUID parentCategoryId;
    private List<UUID> subcategoryIds;
    private List<CategoryField> fields;

    public static CategoryDTO convertToDTO(Category category) {
        UUID parentCategoryId = category.getParentCategory() != null ? category.getParentCategory().getCategoryId() : null;
        List<UUID> subcategoryIds = category.getSubcategories() != null ?
                category.getSubcategories().stream().map(Category::getCategoryId).collect(Collectors.toList()) : null;
        return new CategoryDTO(category.getCategoryId(), category.getName(), category.getDescription(), parentCategoryId, subcategoryIds, category.getFields());
    }

    public static Category convertToEntity(CategoryDTO categoryDTO, CategoryRepository categoryRepository) {
        Category parentCategory = categoryDTO.getParentCategoryId() != null ? categoryRepository.findById(categoryDTO.getParentCategoryId()).orElse(null) : null;
        List<Category> subcategories = categoryDTO.getSubcategoryIds() != null ?
                categoryDTO.getSubcategoryIds().stream().map(categoryRepository::findById).map(opt -> opt.orElse(null)).collect(Collectors.toList()) : null;
        return new Category(categoryDTO.getCategoryId(), categoryDTO.getName(), categoryDTO.getDescription(), parentCategory, subcategories, categoryDTO.getFields());
    }
}
