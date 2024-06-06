package com.example.backend.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        return optionalCategory.map(CategoryDTO::convertToDTO).orElse(null);
    }

    @Override
    public CategoryDTO saveCategory(CategoryCreateDTO categoryCreateDTO) {
        Category category = CategoryCreateDTO.convertToEntity(categoryCreateDTO, categoryRepository);
        Category savedCategory = categoryRepository.save(category);
        return CategoryDTO.convertToDTO(savedCategory);
    }

    @Override
    public void deleteCategory(UUID id) {
        categoryRepository.deleteById(id);
    }
}
