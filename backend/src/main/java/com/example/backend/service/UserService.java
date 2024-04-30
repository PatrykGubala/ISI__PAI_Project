package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.model.UserDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User registerUser(User user);
    User loginUser(String username, String password);
    User updateUser(User user);
    void deleteUser(Long id);
    User getUserById(Long id);
    Optional<User> findByUsername(String username);
    List<User> getAllUsers();
    List<UserDTO> getAllUserDTOs();

}