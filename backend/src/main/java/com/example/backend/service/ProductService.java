package com.example.backend.service;

import com.example.backend.model.Product;
import java.util.List;

public interface ProductService {

    List<Product> getAllProducts();

    Product getProductById(Long id);

    Product saveProduct(Product product);
    Product updateProduct(Product product);

    void deleteProduct(Long id);
}
