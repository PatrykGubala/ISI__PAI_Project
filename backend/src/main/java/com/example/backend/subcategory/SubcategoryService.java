package com.example.backend.subcategory;

import java.util.List;
import java.util.UUID;

public interface SubcategoryService {
    List<Subcategory> getAllSubcategories();
    Subcategory getSubcategoryById(UUID id);
    Subcategory saveSubcategory(Subcategory subcategory);
    Subcategory updateSubcategory(Subcategory subcategory);
    void deleteSubcategory(UUID id);
}