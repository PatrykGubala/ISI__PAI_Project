package com.example.backend.service;

import com.example.backend.model.Role;
import com.example.backend.model.RoleName;
import com.example.backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Role findByName(RoleName name) {
        Optional<Role> role = roleRepository.findByName(name);
        return role.orElse(null);
    }

    @Override
    public Role save(Role role) {
        return roleRepository.save(role);
    }
}
