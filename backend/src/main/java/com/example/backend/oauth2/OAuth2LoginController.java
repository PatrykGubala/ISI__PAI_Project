package com.example.backend.oauth2;

import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class OAuth2LoginController {

    @GetMapping("/loginSuccess")
    public String getLoginInfo(@AuthenticationPrincipal OidcUser principal, RedirectAttributes redirectAttributes) {
        String name = principal.getAttribute("name");
        String email = principal.getAttribute("email");
        redirectAttributes.addFlashAttribute("email", email);
        return "redirect:/";
    }

    @GetMapping("/loginFailure")
    public String loginFailure() {
        return "redirect:/login?error";
    }
}
