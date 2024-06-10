package com.example.backend.category;

import com.example.backend.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDTO::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDTO getCategoryById(UUID id) {
        return categoryRepository.findById(id)
                .map(CategoryDTO::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + id + " not found"));
    }

    @Override
    public CategoryDTO saveCategory(CategoryCreateDTO categoryCreateDTO) {
        Category category = CategoryCreateDTO.convertToEntity(categoryCreateDTO, categoryRepository);
        Category savedCategory = categoryRepository.save(category);
        return CategoryDTO.convertToDTO(savedCategory);
    }
    @Override
    public List<CategoryField> getCategoryFields(UUID id) {
        return categoryRepository.findById(id).map(Category::getFields).orElse(null);
    }
    @Override
    public void deleteCategory(UUID id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public Set<UUID> findAllCategoryIdsIncludingSubcategories(UUID categoryId) {
        Category rootCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
        Set<UUID> categoryIds = new HashSet<>();
        categoryIds.add(rootCategory.getCategoryId());
        Queue<Category> categoriesQueue = new LinkedList<>(rootCategory.getSubcategories());

        while (!categoriesQueue.isEmpty()) {
            Category currentCategory = categoriesQueue.poll();
            categoryIds.add(currentCategory.getCategoryId());
            categoriesQueue.addAll(currentCategory.getSubcategories());
        }
        return categoryIds;
    }

}
