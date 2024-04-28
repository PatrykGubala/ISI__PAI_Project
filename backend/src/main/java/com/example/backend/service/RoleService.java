package com.example.backend.service;

import com.example.backend.model.Role;
import com.example.backend.model.RoleName;

public interface RoleService {
    Role findByName(RoleName name);
    Role save(Role role);
}