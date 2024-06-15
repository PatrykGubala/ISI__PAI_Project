package com.example.backend.category;

import com.example.backend.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public CategoryDTO saveCategory(CategoryCreateDTO categoryCreateDTO) {
        Category parentCategory = null;

        // Load the parent category if it is specified
        if (categoryCreateDTO.getParentCategoryId() != null) {
            parentCategory = categoryRepository.findById(categoryCreateDTO.getParentCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent Category not found with ID: " + categoryCreateDTO.getParentCategoryId()));
        }

        // Create the new category
        Category category = new Category(UUID.randomUUID(), categoryCreateDTO.getName(), categoryCreateDTO.getDescription(), parentCategory, new ArrayList<>(), categoryCreateDTO.getFields());

        // Save the category
        Category savedCategory = categoryRepository.save(category);

        // If there is a parent category, add the new category to its subcategories
        if (parentCategory != null) {
            parentCategory.getSubcategories().add(savedCategory);
            categoryRepository.save(parentCategory);
        }

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
