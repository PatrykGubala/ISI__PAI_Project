package com.example.backend.auth;

import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AuthControllerTest {
    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testRegisterEndpoint() {
        RegisterRequest request = new RegisterRequest();
        AuthResponse expectedResponse = new AuthResponse("accessToken", "refreshToken");
        when(authService.register(any(RegisterRequest.class), any(HttpServletResponse.class))).thenReturn(expectedResponse);

        ResponseEntity<AuthResponse> response = authController.register(request, new MockHttpServletResponse());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
    }

    @Test
    void testLoginEndpoint() {
        AuthRequest request = new AuthRequest();
        AuthResponse expectedResponse = new AuthResponse("accessToken", "refreshToken");
        when(authService.authenticate(any(AuthRequest.class), any(HttpServletResponse.class))).thenReturn(expectedResponse);

        ResponseEntity<AuthResponse> response = authController.authenticate(request, new MockHttpServletResponse());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
    }
}
