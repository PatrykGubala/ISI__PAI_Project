package com.example.backend.user;

import com.example.backend.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.UUID;

@RestController
@RequestMapping("/user")
public class UserFileUploadController {
    private final StorageService storageService;
    private final UserService userService;

    @Autowired
    public UserFileUploadController(StorageService storageService, UserService userService) {
        this.storageService = storageService;
        this.userService = userService;
    }

    @PostMapping("/upload/{userId}")
    public ResponseEntity<?> handleFileUpload(@PathVariable UUID userId,
                                              @RequestParam("file") MultipartFile file,
                                              RedirectAttributes redirectAttributes) {
        String filename = storageService.store(file);
        String url = MvcUriComponentsBuilder.fromMethodName(UserFileUploadController.class,
                "serveFile", filename).build().toUri().toString();

        User user = userService.getUserById(userId);
        if (user != null) {
            user.setImageUrl(url);
            userService.updateUser(user);
            redirectAttributes.addFlashAttribute("message",
                    "You successfully uploaded " + file.getOriginalFilename() + "!");
            return ResponseEntity.ok("File uploaded successfully and URL saved to user profile.");
        } else {
                return ResponseEntity.notFound().build();
        }
    }

}

