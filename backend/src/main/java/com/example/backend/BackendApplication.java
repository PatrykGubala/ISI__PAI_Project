package com.example.backend;

import com.example.backend.auth.AuthResponse;
import com.example.backend.auth.AuthService;
import com.example.backend.auth.RegisterRequest;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static com.example.backend.model.Role.ADMIN;
import static com.example.backend.model.Role.USER;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(AuthService service, UserRepository userRepository, CategoryRepository categoryRepository, ProductRepository productRepository, OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
		return args -> {

			if (userRepository.findByUsername("user").isEmpty()) {
				var user = RegisterRequest.builder()
						.username("user")
						.firstname("User")
						.lastname("Userovic")
						.email("admin@mail.com")
						.password("password123")
						.phoneNumber("123456789")
						.role(USER)
						.build();
				AuthResponse userResponse = service.register(user, null);
				System.out.println("User added. User token: " + userResponse.getAccessToken());

			} else {
				System.out.println("User already exists.");
			}

			if (userRepository.findByUsername("admin").isEmpty()) {
				var admin = RegisterRequest.builder()
						.username("admin")
						.firstname("Admin")
						.lastname("Adminovic")
						.email("manager@mail.com")
						.password("pass")
						.phoneNumber("123456789")
						.role(ADMIN)
						.build();
				AuthResponse adminResponse = service.register(admin, null);
				System.out.println("Admin added"  + adminResponse.getAccessToken());
			} else {
				System.out.println("Admin user already exists.");
			}






		};
	}
}