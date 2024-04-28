package com.example.backend.service;

import com.example.backend.model.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category saveCategory(Category category);
    Category updateCategory(Category category);
    void deleteCategory(Long id);
}