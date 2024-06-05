package com.example.backend.product;

import com.example.backend.category.Category;
import com.example.backend.subcategory.Subcategory;
import com.example.backend.quality.Quality;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private UUID id;
    private String name;
    private String description;
    private double price;
    private Category category;
    private Subcategory subcategory;
    private Quality quality;
    private List<ProductImageDTO> images;

}


