package com.example.backend.product;

import com.example.backend.category.Category;
import com.example.backend.search.SearchCriteria;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification implements Specification<Product> {

    private final SearchCriteria criteria;

    public ProductSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate(Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        return switch (criteria.getOperation()) {
            case EQUALITY -> {
                if (criteria.getKey().contains(".")) {
                    String[] keys = criteria.getKey().split("\\.");
                    if (keys.length == 2 && "category".equals(keys[0]) && "id".equals(keys[1])) {
                        Join<Product, Category> categoryJoin = root.join("category");
                        yield builder.equal(categoryJoin.get("id"), criteria.getValue());
                    } else if (keys.length == 2 && "attributes".equals(keys[0])) {
                        Join<Product, ProductAttribute> attributeJoin = root.join("attributes");
                        Predicate namePredicate = builder.equal(attributeJoin.get("name"), keys[1]);
                        Predicate valuePredicate = builder.equal(attributeJoin.get("value"), criteria.getValue().toString());
                        yield builder.and(namePredicate, valuePredicate);
                    }
                }
                yield builder.equal(root.get(criteria.getKey()), criteria.getValue());
            }
            case NEGATION -> builder.notEqual(root.get(criteria.getKey()), criteria.getValue());
            case GREATER_THAN -> builder.greaterThan(root.get(criteria.getKey()), criteria.getValue().toString());
            case LESS_THAN -> builder.lessThan(root.get(criteria.getKey()), criteria.getValue().toString());
            case LIKE -> builder.like(root.get(criteria.getKey()), "%" + criteria.getValue() + "%");
        };
    }
}
