package com.example.backend.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Permission {

    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),
    USER_READ("user:read"),
    USER_UPDATE("user:update"),
    USER_CREATE("user:create"),
    USER_DELETE("user:delete"),

    ADD_CATEGORY("admin:add_category"),
    UPDATE_CATEGORY("admin:update_category"),
    DELETE_CATEGORY("admin:delete_category"),
    ADD_PRODUCT("user:add_product"),
    UPDATE_PRODUCT("user:update_product"),
    DELETE_PRODUCT("user:delete_product");

    private final String permission;
}
