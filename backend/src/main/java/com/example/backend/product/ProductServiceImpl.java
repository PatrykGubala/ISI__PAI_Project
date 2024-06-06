package com.example.backend.product;

import com.example.backend.category.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.example.backend.product.ProductDTO.convertToEntity;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductDTO getProductById(UUID id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        return optionalProduct.map(ProductDTO::convertToProductDTO).orElse(null);
    }

    @Override
    public ProductDTO saveProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO,categoryRepository);
        Product savedProduct = productRepository.save(product);
        return ProductDTO.convertToProductDTO(savedProduct);
    }

    @Override
    public ProductDTO updateProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO,categoryRepository);
        Product updatedProduct = productRepository.save(product);
        return ProductDTO.convertToProductDTO(updatedProduct);
    }

    @Override
    public void deleteProduct(UUID id) {
        productRepository.deleteById(id);
    }

    @Override
    public Page<ProductDTO> findProducts(Specification<Product> spec, Pageable pageable) {
        Page<Product> products = productRepository.findAll(spec, pageable);
        return products.map(ProductDTO::convertToProductDTO);
    }
    @Override
    public List<Product> getProductsByUserId(UUID userId) {
        return productRepository.findByUserUserId(userId);
    }
}
