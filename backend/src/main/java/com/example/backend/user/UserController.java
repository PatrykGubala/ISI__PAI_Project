package com.example.backend.user;

import com.example.backend.category.Category;
import com.example.backend.subcategory.Subcategory;
import com.example.backend.category.CategoryService;
import com.example.backend.message.Message;
import com.example.backend.message.MessageService;
import com.example.backend.product.Product;
import com.example.backend.product.ProductImage;
import com.example.backend.product.ProductService;
import com.example.backend.storage.StorageController;
import com.example.backend.storage.StorageService;
import com.example.backend.subcategory.SubcategoryService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final ProductService productService;
    private final CategoryService categoryService;
    private final StorageService storageService;
    private final MessageService messageService;
    private final SubcategoryService subcategoryService;

    @Autowired
    public UserController(UserService userService, ProductService productService, CategoryService categoryService, StorageService storageService, MessageService messageService, SubcategoryService subcategoryService) {
        this.userService = userService;
        this.productService = productService;
        this.categoryService = categoryService;
        this.storageService = storageService;
        this.messageService = messageService;
        this.subcategoryService = subcategoryService;
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
        User updatedUser = userService.saveUser(existingUser);
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
    public ResponseEntity<?> addProduct(@RequestBody Product product, @RequestParam UUID categoryId,@RequestParam UUID subcategoryId, @AuthenticationPrincipal User user) {
        Category category = categoryService.getCategoryById(categoryId);
        Subcategory subcategory = subcategoryService.getSubcategoryById(subcategoryId);
        if (category == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
        }
        if(subcategory == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subcategory not found");
        }
        product.setCategory(category);
        product.setSubcategory(subcategory);
        product.setUser(user);

        Product savedProduct = productService.saveProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body("Product added successfully");
    }



    @PostMapping("/addProductWithImage")
    @Transactional
    public ResponseEntity<?> addProductWithImages(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("categoryId") UUID categoryId,
            @RequestParam("subcategoryId") UUID subcategoryId,
            @RequestPart("images") MultipartFile[] images,
            @AuthenticationPrincipal User user) {

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            Category category = categoryService.getCategoryById(categoryId);
            Subcategory subcategory = subcategoryService.getSubcategoryById(subcategoryId);
            if (category == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
            }
            if (subcategory == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subcategory not found");
            }
            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setCategory(category);
            product.setSubcategory(subcategory);
            product.setUser(user);

            List<ProductImage> productImages = new ArrayList<>();

            for (MultipartFile file : images) {
                try {
                    String filename = storageService.store(file);
                    String url = MvcUriComponentsBuilder.fromMethodName(StorageController.class, "serveFile", filename)
                            .build().toUri().toString();
                    ProductImage productImage = new ProductImage();
                    productImage.setImageUrl(url);
                    productImage.setProduct(product);
                    productImages.add(productImage);
                } catch (Exception e) {
                    return new ResponseEntity<>("Failed to store image", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }

            product.setImages(productImages);
            Product savedProduct = productService.saveProduct(product);
            if (savedProduct != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body("Product with images added successfully");
            } else {
                return ResponseEntity.status(HttpStatus.CREATED).body("Product not added");
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/addMessage")
    public ResponseEntity<Message> addMessage(@RequestBody Message message) {
        Message savedMessage = messageService.saveMessage(message);
        return ResponseEntity.status(201).body(savedMessage);
    }
    @PutMapping("/products/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable UUID productId, @RequestBody Product productDetails, @RequestParam("images") MultipartFile[] images, @AuthenticationPrincipal User user) {
        Product existingProduct = productService.getProductById(productId);
        if (existingProduct == null) {
            return ResponseEntity.notFound().build();
        }
        if (!existingProduct.getUser().getUserId().equals(user.getUserId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
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
    public ResponseEntity<String> deleteProduct(@PathVariable("id") UUID id, @AuthenticationPrincipal User user) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!product.getUser().getUserId().equals(user.getUserId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}
