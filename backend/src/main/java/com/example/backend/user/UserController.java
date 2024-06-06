package com.example.backend.user;

import com.example.backend.category.CategoryDTO;
import com.example.backend.category.CategoryRepository;
import com.example.backend.product.*;
import com.example.backend.category.CategoryService;
import com.example.backend.message.Message;
import com.example.backend.message.MessageService;
import com.example.backend.storage.StorageController;
import com.example.backend.storage.StorageService;
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
    private final CategoryRepository categoryRepository;
    private final StorageService storageService;
    private final MessageService messageService;

    @Autowired
    public UserController(UserService userService, ProductService productService, CategoryService categoryService, StorageService storageService, MessageService messageService, CategoryRepository categoryRepository) {
        this.userService = userService;
        this.productService = productService;
        this.categoryService = categoryService;
        this.storageService = storageService;
        this.messageService = messageService;
        this.categoryRepository = categoryRepository;

    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile(@AuthenticationPrincipal User user) {
        UserDTO userDTO = UserDTO.convertToDTO(user);
        return ResponseEntity.ok(userDTO);
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
    public ResponseEntity<?> addProduct(@RequestBody ProductDTO productDTO, @RequestParam UUID categoryId, @AuthenticationPrincipal User user) {
        CategoryDTO categoryDTO = categoryService.getCategoryById(categoryId);
        if (categoryDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
        }
        productDTO.setCategory(categoryDTO);
        productDTO.setUser(UserDTO.convertToDTO(user));

        ProductDTO savedProduct = productService.saveProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PostMapping("/addProductWithImage")
    @Transactional
    public ResponseEntity<?> addProductWithImages(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("categoryId") UUID categoryId,
            @RequestPart("images") MultipartFile[] images,
            @AuthenticationPrincipal User user) {

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            CategoryDTO categoryDTO = categoryService.getCategoryById(categoryId);
            if (categoryDTO == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
            }
            ProductDTO productDTO = new ProductDTO();
            productDTO.setName(name);
            productDTO.setDescription(description);
            productDTO.setPrice(price);
            productDTO.setCategory(categoryDTO);
            productDTO.setUser(UserDTO.convertToDTO(user));

            List<ProductImageDTO> productImageDTOs = new ArrayList<>();

            for (MultipartFile file : images) {
                try {
                    String filename = storageService.store(file);
                    String url = MvcUriComponentsBuilder.fromMethodName(StorageController.class, "serveFile", filename)
                            .build().toUri().toString();
                    ProductImageDTO productImageDTO = new ProductImageDTO();
                    productImageDTO.setImageUrl(url);
                    productImageDTOs.add(productImageDTO);
                } catch (Exception e) {
                    return new ResponseEntity<>("Failed to store image", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }

            productDTO.setImages(productImageDTOs);
            ProductDTO savedProduct = productService.saveProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
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
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable UUID productId, @RequestBody ProductDTO productDTO, @RequestParam("images") MultipartFile[] images, @AuthenticationPrincipal User user) {
        ProductDTO existingProduct = productService.getProductById(productId);
        if (existingProduct == null) {
            return ResponseEntity.notFound().build();
        }
        if (!existingProduct.getUser().getUserId().equals(user.getUserId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        productDTO.setId(productId);
        productDTO.setUser(UserDTO.convertToDTO(user));

        List<ProductImageDTO> productImageDTOs = new ArrayList<>();
        for (MultipartFile file : images) {
            String filename = storageService.store(file);
            String url = MvcUriComponentsBuilder.fromMethodName(StorageController.class, "serveFile", filename).build().toUri().toString();
            productImageDTOs.add(new ProductImageDTO(null, url));
        }
        productDTO.setImages(productImageDTOs);

        ProductDTO updatedProduct = productService.updateProduct(productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") UUID id, @AuthenticationPrincipal User user) {
        ProductDTO productDTO = productService.getProductById(id);
        if (productDTO == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!productDTO.getUser().getUserId().equals(user.getUserId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}
