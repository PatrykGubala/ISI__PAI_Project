package com.example.backend;

import com.example.backend.auth.AuthResponse;
import com.example.backend.auth.AuthService;
import com.example.backend.auth.RegisterRequest;
import com.example.backend.category.Category;
import com.example.backend.category.CategoryRepository;
import com.example.backend.order.OrderItemRepository;
import com.example.backend.order.OrderRepository;
import com.example.backend.product.Product;
import com.example.backend.product.ProductRepository;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.UUID;

import static com.example.backend.user.Role.ADMIN;
import static com.example.backend.user.Role.USER;

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
                userRepository.findByUsername("user").ifPresent(
						existingUser -> System.out.println("User already exists. "));
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
				System.out.println("Admin added. Admin token: "  + adminResponse.getAccessToken());
			} else {
                userRepository.findByUsername("admin").ifPresent(
						existingUser -> System.out.println("Admin already exists. "));
            }

			if (categoryRepository.findAll().isEmpty()) {
				Category electronics = new Category(UUID.randomUUID(), "Elektronika", "No rzeczy elektorniczne");
				Category furniture = new Category(UUID.randomUUID(), "Meble", "Meble i wgl");

				electronics = categoryRepository.save(electronics);
				furniture = categoryRepository.save(furniture);

				Product phone = new Product(UUID.randomUUID(), "Smartfon", "Nowy dobry tel", 1999.99, electronics, null);
				Product laptop = new Product(UUID.randomUUID(), "Laptop", "Gamingowy laptop", 5299.99, electronics, null);

				productRepository.save(phone);
				productRepository.save(laptop);

				Product chair = new Product(UUID.randomUUID(), "Krzesło gamingowe", "My name is PEWDIEPIE", 1999.99, furniture, null);
				Product desk = new Product(UUID.randomUUID(), "Krzesło biurowe", "krzsł", 2999.99, furniture, null);

				productRepository.save(chair);
				productRepository.save(desk);

				System.out.println("Categories and products added.");
			} else {
				System.out.println("Categories already exist.");
			}
		};
	}
}