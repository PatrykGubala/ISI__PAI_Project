package com.example.backend.user;

import com.example.backend.category.Category;
import com.example.backend.category.CategoryService;
import com.example.backend.product.Product;
import com.example.backend.product.ProductImage;
import com.example.backend.product.ProductService;
import com.example.backend.storage.StorageController;
import com.example.backend.storage.StorageService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user")
@PreAuthorize("hasRole('USER')")
public class UserController {

    private final UserService userService;
    private final ProductService productService;
    private final CategoryService categoryService;
    private final StorageService storageService;

    @Autowired
    public UserController(UserService userService, ProductService productService, CategoryService categoryService, StorageService storageService) {
        this.userService = userService;
        this.productService = productService;
        this.categoryService = categoryService;
        this.storageService = storageService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile(@AuthenticationPrincipal User user) {
        UserDTO userDTO = userService.convertToDTO(user);
        if (userDTO != null) {
            return ResponseEntity.ok(userDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") UUID id, @RequestBody User user) {
        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhoneNumber(user.getPhoneNumber());
        User updatedUser = userService.updateUser(existingUser);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") UUID id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/addProduct")
    public ResponseEntity<Product> addProduct(@RequestBody Product product, @RequestParam UUID categoryId) {
        Category category = categoryService.getCategoryById(categoryId);
        if (category == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        product.setCategory(category);

        Product savedProduct = productService.saveProduct(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @PostMapping("/addProductWithImage")
    @Transactional
    public ResponseEntity<Product> addProductWithImages(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("categoryId") UUID categoryId,
            @RequestPart("images") MultipartFile[] images) {

        Category category = categoryService.getCategoryById(categoryId);
        if (category == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(category);

        List<ProductImage> productImages = new ArrayList<>();

        for (MultipartFile file : images) {
            String filename = storageService.store(file);
            String url = MvcUriComponentsBuilder.fromMethodName(StorageController.class, "serveFile", filename)
                    .build().toUri().toString();
            ProductImage productImage = new ProductImage();
            productImage.setImageUrl(url);
            productImage.setProduct(product);
            productImages.add(productImage);
        }

        product.setImages(productImages);

        Product savedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable UUID productId, @RequestBody Product productDetails, @RequestParam("images") MultipartFile[] images) {
        Product existingProduct = productService.getProductById(productId);
        if (existingProduct == null) {
            return ResponseEntity.notFound().build();
        }
        existingProduct.setName(productDetails.getName());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setPrice(productDetails.getPrice());

        List<ProductImage> productImages = new ArrayList<>();
        for (MultipartFile file : images) {
            String filename = storageService.store(file);
            String url = MvcUriComponentsBuilder.fromMethodName(StorageController.class, "serveFile", filename).build().toUri().toString();
            productImages.add(new ProductImage(null, url, existingProduct));
        }
        existingProduct.setImages(productImages);
        productService.saveProduct(existingProduct);

        return ResponseEntity.ok(existingProduct);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}
