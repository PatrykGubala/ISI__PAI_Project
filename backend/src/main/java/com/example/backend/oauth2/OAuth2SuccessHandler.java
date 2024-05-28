package com.example.backend.oauth2;

import com.example.backend.jwt.JwtService;
import com.example.backend.auth.AuthResponse;
import com.example.backend.user.Role;
import com.example.backend.user.User;
import com.example.backend.user.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String email = null;
        String name = null;

        if (authentication.getPrincipal() instanceof OidcUser) {
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            email = oidcUser.getAttribute("email");
            name = oidcUser.getAttribute("name");
        } else if (authentication.getPrincipal() instanceof DefaultOAuth2User) {
            DefaultOAuth2User oauth2User = (DefaultOAuth2User) authentication.getPrincipal();
            email = oauth2User.getAttribute("email");
            name = oauth2User.getAttribute("name");
        }

        if (email != null && name != null) {
            String[] nameParts = name.split(" ");
            String firstName = nameParts.length > 0 ? nameParts[0] : "";
            String lastName = nameParts.length > 1 ? nameParts[1] : "";

            String username = email.substring(0, email.indexOf('@'));

            Optional<User> optionalUser = userService.findByEmail(email);
            User user;
            if (optionalUser.isEmpty()) {
                user = User.builder()
                        .email(email)
                        .username(username)
                        .firstName(firstName)
                        .lastName(lastName)
                        .password("*")
                        .profileNecessaryFieldsComplete(false)
                        .role(Role.USER)
                        .build();
                userService.saveUser(user);
            } else {
                user = optionalUser.get();
            }

            String jwtToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            String redirectUrl = "http://localhost:5173?access_token=" + jwtToken + "&refresh_token=" + refreshToken;
            response.sendRedirect(redirectUrl);
        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Email or name not found");
        }
    }
}
