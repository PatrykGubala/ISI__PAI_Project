package com.example.backend.auth;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.example.backend.jwt.JwtService;
import com.example.backend.token.TokenRepository;
import com.example.backend.user.Role;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.util.Optional;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testRegisterUser() {
        RegisterRequest request = new RegisterRequest("user1", "First", "Last", "user@example.com", "password123", "1234567890", Role.USER, true);
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(jwtService.generateToken(any(User.class))).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(any(User.class))).thenReturn("refreshToken");

        AuthResponse response = authService.register(request, new MockHttpServletResponse());

        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        verify(userRepository, times(1)).save(any(User.class));
        verify(jwtService, times(1)).generateToken(any(User.class));
        verify(jwtService, times(1)).generateRefreshToken(any(User.class));
    }

    @Test
    void testAuthenticateSuccess() {
        AuthRequest request = new AuthRequest("user1", "password123");
        User user = new User();
        user.setPassword("encodedPassword");
        when(userRepository.findByUsername("user1")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken(any(User.class))).thenReturn("newAccessToken");
        when(jwtService.generateRefreshToken(any(User.class))).thenReturn("newRefreshToken");

        AuthResponse response = authService.authenticate(request, new MockHttpServletResponse());

        assertEquals("newAccessToken", response.getAccessToken());
        assertEquals("newRefreshToken", response.getRefreshToken());
    }

    @Test
    void testAuthenticateFailure() {
        AuthRequest request = new AuthRequest("user1", "wrongpassword");
        User user = new User();
        user.setPassword("encodedPassword");
        when(userRepository.findByUsername("user1")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> {
            authService.authenticate(request, new MockHttpServletResponse());
        });
    }

    @Test
    void testRefreshTokenValid() throws IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer validRefreshToken");
        when(jwtService.extractUsername("validRefreshToken")).thenReturn("user1");
        User user = new User();
        when(userRepository.findByUsername("user1")).thenReturn(Optional.of(user));
        when(jwtService.isTokenValid("validRefreshToken", user)).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("newAccessToken");

        MockHttpServletResponse response = new MockHttpServletResponse();
        authService.refreshToken(request, response);

        assertEquals(HttpServletResponse.SC_OK, response.getStatus());
    }

    @Test
    void testRefreshTokenInvalid() throws IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer invalidToken");

        MockHttpServletResponse response = new MockHttpServletResponse();
        authService.refreshToken(request, response);

        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
    }
}
