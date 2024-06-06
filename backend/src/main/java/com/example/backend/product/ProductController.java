package com.example.backend.product;

import com.example.backend.search.SearchCriteria;
import com.example.backend.search.SearchOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "category", required = false) UUID categoryId,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice) {

        Pageable pageable = PageRequest.of(page, size);
        Specification<Product> spec = Specification.where(null);

        if (name != null && !name.isEmpty()) {
            spec = spec.and(new ProductSpecification(new SearchCriteria("name", name, SearchOperation.LIKE)));
        }
        if (categoryId != null) {
            spec = spec.and(new ProductSpecification(new SearchCriteria("category.id", categoryId, SearchOperation.EQUALITY)));
        }
        if (minPrice != null) {
            spec = spec.and(new ProductSpecification(new SearchCriteria("price", minPrice, SearchOperation.GREATER_THAN)));
        }
        if (maxPrice != null) {
            spec = spec.and(new ProductSpecification(new SearchCriteria("price", maxPrice, SearchOperation.LESS_THAN)));
        }
        Page<ProductDTO> products = productService.findProducts(spec, pageable);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable("id") UUID id) {
        ProductDTO productDTO = productService.getProductById(id);
        if (productDTO == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productDTO, HttpStatus.OK);
    }
}