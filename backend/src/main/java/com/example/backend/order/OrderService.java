package com.example.backend.order;

import com.example.backend.product.Product;
import com.example.backend.product.ProductRepository;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Order createOrder(OrderRequest orderRequest) {
        User user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Product product = productRepository.findById(orderRequest.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Order order = new Order();
        order.setOrderDate(new Date());
        order.setUser(user);
        order.setProduct(product);
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setDeliveryAddress(orderRequest.getDeliveryAddress());
        order.setPrice(orderRequest.getPrice());
        order.setStatus(orderRequest.getStatus());

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(UUID id, Order.Status status) {
        Optional<Order> orderOptional = orderRepository.findById(id);
            Order order = orderOptional.get();
            order.setStatus(status);
            return orderRepository.save(order);

    }
}
