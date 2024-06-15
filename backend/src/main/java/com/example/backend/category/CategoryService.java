package com.example.backend.category;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface CategoryService {
    List<CategoryDTO> getAllCategories();
    CategoryDTO getCategoryById(UUID id);
    CategoryDTO saveCategory(CategoryCreateDTO categoryDTO);
    void deleteCategory(UUID id);
    List<CategoryField> getCategoryFields(UUID id);
    Set<UUID> findAllCategoryIdsIncludingSubcategories(UUID categoryId);

    }