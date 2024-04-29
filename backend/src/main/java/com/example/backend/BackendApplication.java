package com.example.backend;

import com.example.backend.auth.AuthService;
import com.example.backend.auth.RegisterRequest;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import static com.example.backend.model.Role.ADMIN;
import static com.example.backend.model.Role.USER;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(AuthService service, UserRepository userRepository) {
		return args -> {
			if (userRepository.findByUsername("user").isEmpty()) {
				var admin = RegisterRequest.builder()
						.username("user")
						.firstname("User")
						.lastname("Userovic")
						.email("admin@mail.com")
						.password("password123")
						.phoneNumber("123456789")
						.role(USER)
						.build();
				System.out.println("Admin token: " + service.register(admin).getAccessToken());
			} else {
				System.out.println("Admin user already exists.");
			}

			if (userRepository.findByUsername("admin").isEmpty()) {
				var manager = RegisterRequest.builder()
						.username("admin")
						.firstname("Admin")
						.lastname("Adminovic")
						.email("manager@mail.com")
						.password("pass")
						.phoneNumber("123456789")
						.role(ADMIN)
						.build();
				System.out.println("Manager token: " + service.register(manager).getAccessToken());
			} else {
				System.out.println("Manager user already exists.");
			}
		};
	}
}