package com.example.backend.user;

import com.example.backend.quality.Quality;
import com.example.backend.quality.QualityService;
import com.example.backend.category.Category;
import com.example.backend.product.Product;
import com.example.backend.category.CategoryService;
import com.example.backend.product.ProductService;
import com.example.backend.subcategory.Subcategory;
import com.example.backend.subcategory.SubcategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")

public class AdminController {

    private final UserService userService;
    private final CategoryService categoryService;
    private final ProductService productService;
    private final SubcategoryService subcategoryService;
    private final QualityService qualityService;

    @Autowired
    public AdminController(UserService userService, CategoryService categoryService, ProductService productService, SubcategoryService subcategoryService, QualityService qualityService) {
        this.userService = userService;
        this.categoryService = categoryService;
        this.productService = productService;
        this.subcategoryService = subcategoryService;
        this.qualityService = qualityService;
    }
    @PostMapping("/addCategory")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        Category savedCategory = categoryService.saveCategory(category);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable("id") UUID id, @RequestBody Category category) {
        Category existingCategory = categoryService.getCategoryById(id);
        if (existingCategory == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        category.setCategoryId(id);
        Category updatedCategory = categoryService.saveCategory(category);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") UUID id) {
        Category category = categoryService.getCategoryById(id);
        if (category == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/addSubcategory")
    public ResponseEntity<Subcategory> addSubcategory(@RequestBody Subcategory subcategory) {
        Subcategory savedSubcategory = subcategoryService.saveSubcategory(subcategory);
        return new ResponseEntity<>(savedSubcategory, HttpStatus.CREATED);
    }

    @PutMapping("/subcategories/{id}")
    public ResponseEntity<Subcategory> updateSubcategory(@PathVariable("id") UUID id, @RequestBody Subcategory subcategory) {
        Subcategory existingSubcategory = subcategoryService.getSubcategoryById(id);
        if (existingSubcategory == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        subcategory.setSubcategoryId(id);
        Subcategory updatedSubcategory = subcategoryService.saveSubcategory(subcategory);
        return new ResponseEntity<>(updatedSubcategory, HttpStatus.OK);
    }

    @DeleteMapping("/subcategories/{id}")
    public ResponseEntity<Void> deleteSubcategory(@PathVariable("id") UUID id) {
        Subcategory subcategory = subcategoryService.getSubcategoryById(id);
        if (subcategory == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        subcategoryService.deleteSubcategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PostMapping("/addQuality")
    public ResponseEntity<Quality> addQuality(@RequestBody Quality quality) {
        Quality savedQuality = qualityService.saveQuality(quality);
        return new ResponseEntity<>(savedQuality, HttpStatus.CREATED);
    }

    @PutMapping("/qualities/{id}")
    public ResponseEntity<Quality> updateQuality(@PathVariable("id") UUID id, @RequestBody Quality quality) {
        Quality existingQuality = qualityService.getQualityById(id);
        if (existingQuality == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        quality.setQualityId(id);
        Quality updatedQuality = qualityService.saveQuality(quality);
        return new ResponseEntity<>(updatedQuality, HttpStatus.OK);
    }

    @DeleteMapping("/qualities/{id}")
    public ResponseEntity<Void> deleteQuality(@PathVariable("id") UUID id) {
        Quality quality = qualityService.getQualityById(id);
        if (quality == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        qualityService.deleteQuality(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUserDTOs();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") UUID id, @RequestBody User user) {
        User updatedUser = userService.saveUser(user);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@PathVariable("id") UUID id, @RequestBody Product product) {
        Product newProduct = productService.saveProduct(product);
        return ResponseEntity.ok(newProduct);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable("id") UUID id,@RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(product);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

}
