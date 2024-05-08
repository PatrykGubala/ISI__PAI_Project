package com.example.backend.category;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(UUID id);
    Category saveCategory(Category category);
    Category updateCategory(Category category);
    void deleteCategory(UUID id);
}