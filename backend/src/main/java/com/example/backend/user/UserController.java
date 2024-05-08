package com.example.backend.user;

import com.example.backend.category.Category;
import com.example.backend.product.Product;
import com.example.backend.product.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/user")
@PreAuthorize("hasRole('USER')")
public class UserController {

    private final UserService userService;
    private final ProductService productService;

    @Autowired
    public UserController(UserService userService, ProductService productService) {
        this.userService = userService;
        this.productService = productService;

    }
    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }


    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") UUID id, @RequestBody User user) {
        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhoneNumber(user.getPhoneNumber());
        User updatedUser = userService.updateUser(existingUser);
        return new ResponseEntity(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") UUID id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        userService.deleteUser(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/addProduct")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Product savedProduct = productService.saveProduct(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
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