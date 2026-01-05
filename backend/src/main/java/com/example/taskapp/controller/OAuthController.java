// package com.example.taskapp.controller;

// import com.example.taskapp.service.calendar.GoogleOAuthService;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// @RequestMapping("/oauth")
// public class OAuthController {

// private final GoogleOAuthService googleOAuthService;

// public OAuthController(GoogleOAuthService googleOAuthService) {
// this.googleOAuthService = googleOAuthService;
// }

// @GetMapping("/authorize")
// public ResponseEntity<String> authorize() throws Exception {
// googleOAuthService.authorize();
// return ResponseEntity.ok("authorized");
// }
// }
