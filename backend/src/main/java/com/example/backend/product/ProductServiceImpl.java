package com.example.backend.product;

import com.example.backend.category.CategoryDTO;
import com.example.backend.category.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.example.backend.product.ProductDTO.convertToEntity;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductAttributeRepository productAttributeRepository;
    @Autowired
    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository,ProductAttributeRepository productAttributeRepository) {
        this.productAttributeRepository = productAttributeRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductDTO getProductById(UUID id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        return optionalProduct.map(ProductDTO::convertToProductDTO).orElse(null);
    }

    @Override
    @Transactional
    public ProductDTO saveProduct(ProductDTO productDTO) {
        Product product = ProductDTO.convertToEntity(productDTO, categoryRepository);
        boolean isNew = product.getId() == null;

        if (!isNew) {
            Product finalProduct = product;
            Product existingProduct = productRepository.findById(product.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + finalProduct.getId()));
            updateExistingProduct(existingProduct, productDTO);
            product = existingProduct;
        }

        product = productRepository.save(product);

        processAttributes(product, productDTO.getProductAttributes(), isNew);

        return ProductDTO.convertToProductDTO(product);
    }

    private void processAttributes(Product product, List<ProductAttributeDTO> attributeDTOs, boolean isNew) {
        if (!isNew) {
            productAttributeRepository.deleteAllInBatch(product.getAttributes());
        }
        List<ProductAttribute> attributes = new ArrayList<>();
        for (ProductAttributeDTO dto : attributeDTOs) {
            ProductAttribute attribute = ProductAttributeDTO.convertToEntity(dto, product);
            attributes.add(attribute);
        }
        productAttributeRepository.saveAll(attributes);
        product.setAttributes(attributes);
    }


    private void updateExistingProduct(Product existingProduct, ProductDTO productDTO) {
        existingProduct.setName(productDTO.getName());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setCategory(CategoryDTO.convertToEntity(productDTO.getCategory(), categoryRepository));
    }



    private void synchronizeAttributes(Product product, List<ProductAttributeDTO> newAttrs) {
        if (product.getAttributes() == null) {
            product.setAttributes(new ArrayList<>());
        }
        Map<String, ProductAttribute> currentAttrs = product.getAttributes().stream()
                .collect(Collectors.toMap(ProductAttribute::getName, Function.identity()));

        List<ProductAttribute> toRemove = product.getAttributes().stream()
                .filter(attr -> newAttrs.stream()
                        .noneMatch(newAttr -> newAttr.getName().equals(attr.getName())))
                .collect(Collectors.toList());

        productAttributeRepository.deleteAll(toRemove);

        for (ProductAttributeDTO attrDTO : newAttrs) {
            ProductAttribute attr = currentAttrs.get(attrDTO.getName());
            if (attr != null) {
                attr.updateValues(attrDTO);
                productAttributeRepository.save(attr);
            } else {
                ProductAttribute newAttr = new ProductAttribute();
                newAttr.setName(attrDTO.getName());
                newAttr.setValue(attrDTO.getValue());
                newAttr.setProduct(product);
                productAttributeRepository.save(newAttr);
            }
        }
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

