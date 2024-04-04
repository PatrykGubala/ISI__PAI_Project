package com.example.backend.service;

import com.example.backend.model.User;

import java.util.List;

public interface UserService {
    User registerUser(User user);
    User loginUser(String username, String password);
    User updateUser(User user);
    void deleteUser(Long id);
    User getUserById(Long id);
    List<User> getAllUsers();
}