package com.example.backend.util;


import com.example.backend.model.Role;
import com.example.backend.model.RoleName;
import com.example.backend.model.User;
import com.example.backend.service.RoleService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public DataLoader(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @Override
    public void run(String... args) throws Exception {
        Role adminRole = createRoleIfNotFound(RoleName.ROLE_ADMIN);
        Role userRole = createRoleIfNotFound(RoleName.ROLE_USER);

        loadUser("admin", "admin@example.com", "password123", "Admin", "Adminovic", "1234567890", adminRole);
        loadUser("user", "user@example.com", "password123", "User", "Userovic", "0987654321", userRole);
    }

    private Role createRoleIfNotFound(RoleName name) {
        Role role = roleService.findByName(name);
        if (role == null) {
            role = new Role();
            role.setName(name);
            roleService.save(role);
        }
        return role;
    }

    private void loadUser(String username, String email, String password, String firstName, String lastName, String phoneNumber, Role role) {
        Optional<User> user = userService.findByUsername(username);
        if (user.isEmpty()) {
            user = Optional.of(new User());
            user.get().setUsername(username);
            user.get().setEmail(email);
            user.get().setPassword(password);
            user.get().setFirstName(firstName);
            user.get().setLastName(lastName);
            user.get().setPhoneNumber(phoneNumber);
            Set<Role> roles = new HashSet<>();
            roles.add(role);
            user.get().setRoles(roles);
            userService.registerUser(user.orElse(null));

        }
    }
}
