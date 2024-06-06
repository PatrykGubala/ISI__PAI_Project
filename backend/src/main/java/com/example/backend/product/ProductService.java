package com.example.backend.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    List<ProductDTO> getAllProducts();
    ProductDTO getProductById(UUID id);
    ProductDTO saveProduct(ProductDTO productDTO);
    ProductDTO updateProduct(ProductDTO productDTO);
    void deleteProduct(UUID id);
    Page<ProductDTO> findProducts(Specification<Product> spec, Pageable pageable);
}
