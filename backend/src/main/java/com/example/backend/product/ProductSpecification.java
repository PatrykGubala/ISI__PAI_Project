package com.example.backend.product;

import com.example.backend.category.Category;
import com.example.backend.search.SearchCriteria;
import com.example.backend.user.User;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.Set;
import java.util.UUID;

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
                        Predicate valuePredicate;
                        if (criteria.getValue() instanceof String) {
                            valuePredicate = builder.equal(attributeJoin.get("stringValue"), criteria.getValue());
                        } else if (criteria.getValue() instanceof Double) {
                            valuePredicate = builder.equal(attributeJoin.get("doubleValue"), criteria.getValue());
                        } else {
                            throw new IllegalArgumentException("Unsupported value type: " + criteria.getValue().getClass());
                        }
                        yield builder.and(namePredicate, valuePredicate);
                    }else if (keys.length == 2 && "user".equals(keys[0]) && "userId".equals(keys[1])) {
                        Join<Product, User> userJoin = root.join("user");
                        yield builder.equal(userJoin.get("userId"), criteria.getValue());
                    }
                }
                yield builder.equal(root.get(criteria.getKey()), criteria.getValue());
            }
            case IN -> {
                if (criteria.getKey().contains(".")) {
                    String[] keys = criteria.getKey().split("\\.");
                    if (keys.length == 2 && "category".equals(keys[0]) && "id".equals(keys[1])) {
                        Join<Product, Category> categoryJoin = root.join("category");
                        CriteriaBuilder.In<UUID> inClause = builder.in(categoryJoin.get("id"));
                        ((Set<UUID>) criteria.getValue()).forEach(inClause::value);
                        yield builder.and(inClause);
                    }
                    else{
                        throw new IllegalArgumentException("Unsupported key structure for IN operation: " + criteria.getKey());
                    }
                } else {
                    CriteriaBuilder.In<Object> inClause = builder.in(root.get(criteria.getKey()));
                    ((Set<?>) criteria.getValue()).forEach(inClause::value);
                    yield builder.and(inClause);
                }
            }
            case NEGATION -> builder.notEqual(root.get(criteria.getKey()), criteria.getValue());
            case GREATER_THAN -> builder.greaterThan(root.get(criteria.getKey()), criteria.getValue().toString());
            case LESS_THAN -> builder.lessThan(root.get(criteria.getKey()), criteria.getValue().toString());
            case LIKE -> builder.like(root.get(criteria.getKey()), "%" + criteria.getValue() + "%");
        };
    }
}
