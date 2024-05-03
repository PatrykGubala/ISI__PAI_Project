package com.example.backend.service;

import com.example.backend.model.Product;
import java.util.List;
import java.util.UUID;

public interface ProductService {

    List<Product> getAllProducts();

    Product getProductById(UUID id);

    Product saveProduct(Product product);
    Product updateProduct(Product product);

    void deleteProduct(UUID id);
}
