package com.example.backend.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.example.backend.user.Permission.*;


@Getter
@RequiredArgsConstructor
public enum Role {
    ADMIN(
            Set.of(
                    ADMIN_READ,
                    ADMIN_UPDATE,
                    ADMIN_DELETE,
                    ADMIN_CREATE,
                    USER_READ,
                    USER_UPDATE,
                    USER_DELETE,
                    USER_CREATE,
                    ADD_CATEGORY,
                    UPDATE_CATEGORY,
                    DELETE_CATEGORY,
                    ADD_PRODUCT,
                    UPDATE_PRODUCT,
                    DELETE_PRODUCT
            )
    ),
    USER(
            Set.of(
                    USER_READ,
                    USER_UPDATE,
                    USER_DELETE,
                    USER_CREATE,
                    ADD_PRODUCT,
                    UPDATE_PRODUCT,
                    DELETE_PRODUCT
            )
    );

    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}