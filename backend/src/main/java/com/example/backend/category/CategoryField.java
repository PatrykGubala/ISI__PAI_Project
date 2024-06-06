package com.example.backend.category;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class CategoryField {
    private String name;

    @Enumerated(EnumType.STRING)
    private FieldType fieldType;

    private boolean filterable;

    private String defaultEnumValuesJson;

    private String filterEnumValuesJson;

    private Integer defaultRangeMin;
    private Integer defaultRangeMax;

    private Integer filterRangeMin;
    private Integer filterRangeMax;

    public CategoryField(String name, FieldType fieldType, boolean filterable, List<String> defaultEnumValues, List<String> filterEnumValues) {
        this.name = name;
        this.fieldType = fieldType;
        this.filterable = filterable;
        this.defaultEnumValuesJson = defaultEnumValues != null ? String.join(",", defaultEnumValues) : null;
        this.filterEnumValuesJson = filterEnumValues != null ? String.join(",", filterEnumValues) : null;
    }

    public CategoryField(String name, FieldType fieldType, boolean filterable, Integer defaultRangeMin, Integer defaultRangeMax, Integer filterRangeMin, Integer filterRangeMax) {
        this.name = name;
        this.fieldType = fieldType;
        this.filterable = filterable;
        this.defaultRangeMin = defaultRangeMin;
        this.defaultRangeMax = defaultRangeMax;
        this.filterRangeMin = filterRangeMin;
        this.filterRangeMax = filterRangeMax;
    }
    public Class<?> getValueType() {
        return switch (fieldType) {
            case ENUM -> String.class;
            case RANGE -> Double.class;
        };
    }
}
