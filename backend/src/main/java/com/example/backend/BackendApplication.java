package com.example.backend;

import com.example.backend.auth.AuthResponse;
import com.example.backend.auth.AuthService;
import com.example.backend.auth.RegisterRequest;
import com.example.backend.category.Category;
import com.example.backend.category.CategoryField;
import com.example.backend.category.CategoryRepository;
import com.example.backend.category.FieldType;
import com.example.backend.order.OrderItemRepository;
import com.example.backend.order.OrderRepository;
import com.example.backend.product.Product;
import com.example.backend.product.ProductAttribute;
import com.example.backend.product.ProductRepository;
import com.example.backend.user.UserRepository;
import com.example.backend.user.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;
import java.util.UUID;

import static com.example.backend.user.Role.ADMIN;
import static com.example.backend.user.Role.USER;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(
			AuthService authService,
			UserRepository userRepository,
			CategoryRepository categoryRepository,
			ProductRepository productRepository,
			OrderRepository orderRepository,
			OrderItemRepository orderItemRepository) {

		return args -> {

			if (userRepository.findByUsername("user").isEmpty()) {
				var user = RegisterRequest.builder()
						.username("user")
						.firstname("User")
						.lastname("Userovic")
						.email("user@mail.com")
						.password("password123")
						.phoneNumber("123456789")
						.profileNecessaryFieldsComplete(true)
						.role(USER)
						.build();
				AuthResponse userResponse = authService.register(user, null);
				System.out.println("User added. User token: " + userResponse.getAccessToken());
			} else {
				userRepository.findByUsername("user").ifPresent(
						existingUser -> System.out.println("User already exists."));
			}

			if (userRepository.findByUsername("admin").isEmpty()) {
				var admin = RegisterRequest.builder()
						.username("admin")
						.firstname("Admin")
						.lastname("Adminovic")
						.email("admin@mail.com")
						.password("pass")
						.phoneNumber("123456789")
						.profileNecessaryFieldsComplete(true)
						.role(ADMIN)
						.build();
				AuthResponse adminResponse = authService.register(admin, null);
				System.out.println("Admin added. Admin token: " + adminResponse.getAccessToken());
			} else {
				userRepository.findByUsername("admin").ifPresent(
						existingUser -> System.out.println("Admin already exists."));
			}

			if (categoryRepository.findAll().isEmpty()) {
				Category motorization = new Category();
				motorization.setCategoryId(UUID.randomUUID());
				motorization.setName("Motorization");
				motorization.setDescription("All motor vehicles");
				motorization.setFields(List.of(
						new CategoryField("Mileage", FieldType.RANGE, true, 0, 200000, 0, 200000),
						new CategoryField("Condition", FieldType.ENUM, true, List.of("NEW", "USED"), List.of("NEW", "USED"))
				));

				motorization = categoryRepository.save(motorization);

				Category cars = new Category();
				cars.setCategoryId(UUID.randomUUID());
				cars.setName("Cars");
				cars.setDescription("Four-wheeled vehicles");
				cars.setParentCategory(motorization);
				cars.setFields(List.of(
						new CategoryField("Brand", FieldType.ENUM, true, List.of("Toyota", "Honda"), List.of("Toyota", "Honda")),
						new CategoryField("Mileage", FieldType.RANGE, true, 0, 200000, 0, 200000),
						new CategoryField("Condition", FieldType.ENUM, true, List.of("NEW", "USED"), List.of("NEW", "USED"))
				));

				Category motorcycles = new Category();
				motorcycles.setCategoryId(UUID.randomUUID());
				motorcycles.setName("Motorcycles");
				motorcycles.setDescription("Two-wheeled vehicles");
				motorcycles.setParentCategory(motorization);
				motorcycles.setFields(List.of(
						new CategoryField("Brand", FieldType.ENUM, true, List.of("Yamaha", "Kawasaki"), List.of("Yamaha", "Kawasaki")),
						new CategoryField("Mileage", FieldType.RANGE, true, 0, 200000, 0, 200000),
						new CategoryField("Condition", FieldType.ENUM, true, List.of("NEW", "USED"), List.of("NEW", "USED"))
				));

				cars = categoryRepository.save(cars);
				motorcycles = categoryRepository.save(motorcycles);

				motorization.setSubcategories(List.of(cars, motorcycles));
				categoryRepository.save(motorization);
				System.out.println("Motorization category with Cars and Motorcycles subcategories added.");

				User user = userRepository.findByUsername("user").orElseThrow(() -> new RuntimeException("User not found"));

				List<Product> products = createProducts(user, cars, motorcycles);

				productRepository.saveAll(products);
				System.out.println("Products added to Cars and Motorcycles categories.");
			} else {
				System.out.println("Categories already exist.");
			}
		};
	}


	private List<Product> createProducts(User user, Category cars, Category motorcycles) {
		Product toyotaCorolla = new Product(UUID.randomUUID(), "Toyota Corolla", "A reliable car", 15000.00, cars, null, user, null);
		Product hondaCivic = new Product(UUID.randomUUID(), "Honda Civic", "A sporty car", 18000.00, cars, null, user, null);
		Product kawasakiNinja400 = new Product(UUID.randomUUID(), "Kawasaki Ninja 400", "A powerful motorcycle", 7000.00, motorcycles, null, user, null);

		setProductAttributes(toyotaCorolla, List.of(
				new ProductAttribute("Brand", "Toyota", toyotaCorolla),
				new ProductAttribute("Model", "Corolla", toyotaCorolla),
				new ProductAttribute("Year", "2015", toyotaCorolla),
				new ProductAttribute("Mileage", "50000", toyotaCorolla),
				new ProductAttribute("Condition", "Used", toyotaCorolla)
		));
		setProductAttributes(hondaCivic, List.of(
				new ProductAttribute("Brand", "Honda", hondaCivic),
				new ProductAttribute("Model", "Civic", hondaCivic),
				new ProductAttribute("Year", "2018", hondaCivic),
				new ProductAttribute("Mileage", "30000", hondaCivic),
				new ProductAttribute("Condition", "Used", hondaCivic)
		));

		setProductAttributes(kawasakiNinja400, List.of(
				new ProductAttribute("Brand", "Kawasaki", kawasakiNinja400),
				new ProductAttribute("Model", "Ninja 400", kawasakiNinja400),
				new ProductAttribute("Year", "2020", kawasakiNinja400),
				new ProductAttribute("Mileage", "5000", kawasakiNinja400),
				new ProductAttribute("Condition", "Used", kawasakiNinja400)
		));

		return List.of(toyotaCorolla, hondaCivic, kawasakiNinja400);
	}

	private void setProductAttributes(Product product, List<ProductAttribute> attributes) {
		product.setAttributes(attributes);
		attributes.forEach(attr -> attr.setProduct(product));
	}
}
