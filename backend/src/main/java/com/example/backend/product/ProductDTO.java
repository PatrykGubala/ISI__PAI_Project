package com.example.backend.product;

import com.example.backend.category.CategoryDTO;
import com.example.backend.category.CategoryRepository;
import com.example.backend.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private UUID id;
    private String name;
    private String description;
    private double price;
    private UserDTO user;
    private CategoryDTO category;
    private List<ProductImageDTO> images = new ArrayList<>();
    private List<ProductAttributeDTO> productAttributes = new ArrayList<>();

    public static ProductDTO convertToProductDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(product.getId());
        productDTO.setName(product.getName());
        productDTO.setDescription(product.getDescription());
        productDTO.setPrice(product.getPrice());
        productDTO.setCategory(CategoryDTO.convertToDTO(product.getCategory()));
        productDTO.setUser(UserDTO.convertToDTO(product.getUser()));

        List<ProductImageDTO> productImageDTOs = product.getImages().stream()
                .map(image -> new ProductImageDTO(image.getId(), image.getImageUrl()))
                .toList();
        productDTO.setImages(productImageDTOs);

        List<ProductAttributeDTO> productAttributeDTOs = product.getAttributes().stream()
                .map(ProductAttributeDTO::convertToDTO)
                .toList();
        productDTO.setProductAttributes(productAttributeDTOs);

        return productDTO;
    }

    public static Product convertToEntity(ProductDTO productDTO, CategoryRepository categoryRepository) {
        Product product = new Product();
        product.setId(productDTO.getId());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setCategory(CategoryDTO.convertToEntity(productDTO.getCategory(), categoryRepository));
        product.setUser(UserDTO.convertToEntity(productDTO.getUser()));

        if (productDTO.getImages() != null) {
            List<ProductImage> productImages = productDTO.getImages().stream()
                    .map(imageDTO -> new ProductImage(imageDTO.getId(), imageDTO.getImageUrl(), product))
                    .collect(Collectors.toList());
            product.setImages(productImages);
        }

        if (productDTO.getProductAttributes() != null) {
            List<ProductAttribute> productAttributes = productDTO.getProductAttributes().stream()
                    .map(attributeDTO -> ProductAttributeDTO.convertToEntity(attributeDTO, product))
                    .collect(Collectors.toList());
            product.setAttributes(productAttributes);
        }

        return product;
    }

}
