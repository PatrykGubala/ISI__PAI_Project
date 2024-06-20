package com.example.backend.product;

import com.example.backend.category.*;
import com.example.backend.search.SearchCriteria;
import com.example.backend.search.SearchOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;


@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;

    @Autowired
    public ProductController(ProductService productService,CategoryService categoryService ) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "category", required = false) UUID categoryId,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam MultiValueMap<String, String> attributes) {

        Pageable pageable = PageRequest.of(page, size);
        Specification<Product> spec = Specification.where(null);

        if (name != null && !name.isEmpty()) {
            spec = spec.and(new ProductSpecification(new SearchCriteria("name", name, SearchOperation.LIKE)));
        }
        if (categoryId != null) {
            Set<UUID> allRelevantCategoryIds = categoryService.findAllCategoryIdsIncludingSubcategories(categoryId);
            spec = spec.and(new ProductSpecification(new SearchCriteria("category.id", allRelevantCategoryIds, SearchOperation.IN)));
        }
        if (minPrice != null) {
            spec = spec.and(new ProductSpecification(new SearchCriteria("price", minPrice, SearchOperation.GREATER_THAN)));
        }
        if (maxPrice != null) {
            spec = spec.and(new ProductSpecification(new SearchCriteria("price", maxPrice, SearchOperation.LESS_THAN)));
        }

        if (categoryId != null) {
            CategoryDTO category = categoryService.getCategoryById(categoryId);
            System.out.println("Category Fields: " + category.getFields());
            for (String key : attributes.keySet()) {
                if (!"page".equals(key) && !"size".equals(key) && !"name".equals(key) && !"category".equals(key) && !"minPrice".equals(key) && !"maxPrice".equals(key)) {
                    try {
                        String baseKey = key.replaceFirst("(Min|Max)$", "");
                        CategoryField field = category.getFields().stream()
                                .filter(f -> f.getName().equals(baseKey))
                                .findFirst()
                                .orElseThrow(() -> new IllegalArgumentException("Field not found: " + baseKey));

                        if (field.getFieldType() == FieldType.ENUM) {
                            Set<String> enumValues = Set.of(attributes.getFirst(key).split(","));
                            spec = spec.and(new ProductSpecification(new SearchCriteria("attributes." + baseKey, enumValues, SearchOperation.IN)));
                        } else if (field.getFieldType() == FieldType.RANGE) {
                            if (key.endsWith("Min")) {
                                Double minValue = Double.valueOf(attributes.getFirst(key));
                                spec = spec.and(new ProductSpecification(new SearchCriteria("attributes." + baseKey, minValue, SearchOperation.GREATER_THAN_OR_EQUAL)));
                            } else if (key.endsWith("Max")) {
                                Double maxValue = Double.valueOf(attributes.getFirst(key));
                                spec = spec.and(new ProductSpecification(new SearchCriteria("attributes." + baseKey, maxValue, SearchOperation.LESS_THAN_OR_EQUAL)));
                            }
                        }
                    } catch (IllegalArgumentException e) {
                        System.err.println("Error processing attribute: " + key + " - " + e.getMessage());
                        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                    }
                }
            }
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