package com.example.backend.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserService {
    User registerUser(User user);
    User loginUser(String username, String password);
    User updateUser(User user);
    void deleteUser(UUID id);
    User getUserById(UUID id);
    Optional<User> findByUsername(String username);
    List<User> getAllUsers();
    List<UserDTO> getAllUserDTOs();

}