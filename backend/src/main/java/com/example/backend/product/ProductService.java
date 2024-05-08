package com.example.backend.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(UUID id);
    Product saveProduct(Product product);
    Product updateProduct(Product product);
    void deleteProduct(UUID id);
    Page<Product> findProducts(Specification<Product> spec, Pageable pageable);
}
