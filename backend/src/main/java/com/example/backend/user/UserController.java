package com.example.backend.user;

import com.example.backend.category.CategoryDTO;
import com.example.backend.category.CategoryField;
import com.example.backend.category.CategoryRepository;
import com.example.backend.order.Order;
import com.example.backend.order.OrderRequest;
import com.example.backend.order.OrderService;
import com.example.backend.product.*;
import com.example.backend.category.CategoryService;
import com.example.backend.message.Message;
import com.example.backend.message.MessageService;
import com.example.backend.search.SearchCriteria;
import com.example.backend.search.SearchOperation;
import com.example.backend.storage.StorageController;
import com.example.backend.storage.StorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.util.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final ProductService productService;
    private final CategoryService categoryService;
    private final CategoryRepository categoryRepository;
    private final StorageService storageService;
    private final MessageService messageService;
    private final OrderService orderService;
    private final ProductRepository productRepository;



    @Autowired
    public UserController(UserService userService,ProductRepository productRepository, ProductService productService, CategoryService categoryService, StorageService storageService, MessageService messageService, CategoryRepository categoryRepository, OrderService orderService) {
        this.userService = userService;
        this.productService = productService;
        this.categoryService = categoryService;
        this.storageService = storageService;
        this.messageService = messageService;
        this.categoryRepository = categoryRepository;
        this.orderService = orderService;
        this.productRepository = productRepository;



    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile(@AuthenticationPrincipal User user) {
        UserDTO userDTO = UserDTO.convertToDTO(user);
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") UUID id, @RequestBody User user) {
        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhoneNumber(user.getPhoneNumber());
        User updatedUser = userService.saveUser(existingUser);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") UUID id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("hasAuthority('user:add_product')")
    @PostMapping("/addProduct")
    public ResponseEntity<?> addProduct(@RequestBody ProductDTO productDTO, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CategoryDTO categoryDTO = categoryService.getCategoryById(productDTO.getCategoryId());
        if (categoryDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
        }

        productDTO.setCategory(categoryDTO);
        productDTO.setUser(UserDTO.convertToDTO(user));
        try {
            ProductDTO savedProduct = productService.saveProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save product: " + e.getMessage());
        }
    }
    @PreAuthorize("hasAuthority('user:add_product')")
    @PostMapping("/addProductWithImage")
    @Transactional
    public ResponseEntity<?> addProductWithImages(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("categoryId") UUID categoryId,
            @RequestPart("images") MultipartFile[] images,
            @RequestParam("productAttributes") String productAttributesJson,
            @AuthenticationPrincipal User user) {

        System.out.println("addProductWithImages - Start");

        if (user == null) {
            System.out.println("addProductWithImages - User is not authenticated");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            System.out.println("addProductWithImages - Fetching category");
            CategoryDTO categoryDTO = categoryService.getCategoryById(categoryId);
            if (categoryDTO == null) {
                System.out.println("addProductWithImages - Category not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
            }

            System.out.println("addProductWithImages - Creating productDTO");
            ProductDTO productDTO = new ProductDTO();
            productDTO.setName(name);
            productDTO.setDescription(description);
            productDTO.setPrice(price);
            productDTO.setCategory(categoryDTO);
            productDTO.setUser(UserDTO.convertToDTO(user));

            List<ProductImageDTO> productImageDTOs = new ArrayList<>();

            System.out.println("addProductWithImages - Processing images");
            for (MultipartFile file : images) {
                try {
                    String filename = storageService.store(file);
                    String url = MvcUriComponentsBuilder.fromMethodName(StorageController.class, "serveFile", filename)
                            .build().toUri().toString();
                    ProductImageDTO productImageDTO = new ProductImageDTO();
                    productImageDTO.setImageUrl(url);
                    productImageDTOs.add(productImageDTO);
                    System.out.println("addProductWithImages - Stored image: " + url);
                } catch (Exception e) {
                    System.out.println("addProductWithImages - Failed to store image: " + e.getMessage());
                    return new ResponseEntity<>("Failed to store image", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }

            productDTO.setImages(productImageDTOs);

            System.out.println("addProductWithImages - Processing product attributes");
            ObjectMapper objectMapper = new ObjectMapper();
            List<ProductAttributeDTO> productAttributes = Arrays.asList(objectMapper.readValue(productAttributesJson, ProductAttributeDTO[].class));
            productDTO.setProductAttributes(productAttributes);

            System.out.println("addProductWithImages - Saving product");
            ProductDTO savedProduct = productService.saveProduct(productDTO);
            System.out.println("addProductWithImages - Product saved successfully: " + savedProduct.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("addProductWithImages - Error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @PostMapping("/addMessage")
    public ResponseEntity<Message> addMessage(@RequestBody Message message) {
        Message savedMessage = messageService.saveMessage(message);
        return ResponseEntity.status(201).body(savedMessage);
    }
    @PreAuthorize("hasAuthority('user:update_product')")
    @PutMapping("/products/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable UUID productId, @RequestBody ProductDTO productDTO, @RequestParam("images") MultipartFile[] images, @AuthenticationPrincipal User user) {
        ProductDTO existingProduct = productService.getProductById(productId);
        if (existingProduct == null) {
            return ResponseEntity.notFound().build();
        }
        if (!existingProduct.getUser().getUserId().equals(user.getUserId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        productDTO.setId(productId);
        productDTO.setUser(UserDTO.convertToDTO(user));

        List<ProductImageDTO> productImageDTOs = new ArrayList<>();
        for (MultipartFile file : images) {
            String filename = storageService.store(file);
            String url = MvcUriComponentsBuilder.fromMethodName(StorageController.class, "serveFile", filename).build().toUri().toString();
            productImageDTOs.add(new ProductImageDTO(null, url));
        }
        productDTO.setImages(productImageDTOs);

        ProductDTO updatedProduct = productService.updateProduct(productDTO);
        return ResponseEntity.ok(updatedProduct);
    }
    @PreAuthorize("hasAuthority('user:delete_product')")
    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") UUID id, @AuthenticationPrincipal User user) {
        ProductDTO productDTO = productService.getProductById(id);
        if (productDTO == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!productDTO.getUser().getUserId().equals(user.getUserId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    @GetMapping("/products")
    public ResponseEntity<Page<ProductDTO>> getUserProducts(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "category", required = false) UUID categoryId,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam MultiValueMap<String, String> attributes) {

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDTO userDTO = UserDTO.convertToDTO(user);
        Pageable pageable = PageRequest.of(page, size);
        Specification<Product> spec = Specification.where(null);


        spec = spec.and(new ProductSpecification(new SearchCriteria("user.userId", userDTO.getUserId(), SearchOperation.EQUALITY)));

        if (name != null && !name.isEmpty()) {
            spec = spec.and(new ProductSpecification(new SearchCriteria("name", name, SearchOperation.LIKE)));
        }
        if (categoryId != null) {
            Set<UUID> allRelevantCategoryIds = categoryService.findAllCategoryIdsIncludingSubcategories(categoryId);
            spec = spec.and(new ProductSpecification(new SearchCriteria("category.id", allRelevantCategoryIds, SearchOperation.IN)));
        }
        if (minPrice != null) {
            spec = spec.and(new ProductSpecification(new SearchCriteria("price", minPrice, SearchOperation.GREATER_THAN)));
        }
        if (maxPrice != null) {
            spec = spec.and(new ProductSpecification(new SearchCriteria("price", maxPrice, SearchOperation.LESS_THAN)));
        }

        if (categoryId != null) {
            CategoryDTO category = categoryService.getCategoryById(categoryId);
            for (String key : attributes.keySet()) {
                if (!"page".equals(key) && !"size".equals(key) && !"name".equals(key) && !"category".equals(key) && !"minPrice".equals(key) && !"maxPrice".equals(key)) {
                    String value = attributes.getFirst(key);
                    CategoryField field = category.getFields().stream()
                            .filter(f -> f.getName().equals(key))
                            .findFirst()
                            .orElseThrow(() -> new IllegalArgumentException("Field not found"));

                    Object attributeValue = switch (field.getFieldType()) {
                        case ENUM -> value;
                        case RANGE -> Double.valueOf(value);
                    };
                    spec = spec.and(new ProductSpecification(new SearchCriteria("attributes." + key, attributeValue, SearchOperation.EQUALITY)));
                }
            }
        }

        Page<ProductDTO> products = productService.findProducts(spec, pageable);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping("/order")
    public ResponseEntity<Order> createOrder(
            @RequestBody OrderRequest orderRequest,
            @AuthenticationPrincipal User user) {
        if (user == null || !user.getUserId().equals(orderRequest.getUserId())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Order createdOrder = orderService.createOrder(orderRequest);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

}
