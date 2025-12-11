package ku.cs.restaurant.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import ku.cs.restaurant.controller.GlobalExceptionHandler.*;
import ku.cs.restaurant.dto.GoogleAuthRequest;
import ku.cs.restaurant.dto.LoginRequest;
import ku.cs.restaurant.dto.SignupRequest;
import ku.cs.restaurant.dto.UserInfoResponse;
import ku.cs.restaurant.entity.User;
import ku.cs.restaurant.security.JwtUtil;
import ku.cs.restaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.Collections;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private UserService userService;
    private AuthenticationManager authenticationManager;
    private JwtUtil jwtUtils;

    @Value("${google.clientId}")
    private String googleClientId;

    @Autowired
    public AuthenticationController(UserService userService,
                                    AuthenticationManager authenticationManager, JwtUtil jwtUtils) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );
        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        // Generate JWT token
        String jwt = jwtUtils.generateToken(userDetails.getUsername());

        // Create HttpOnly cookie
        ResponseCookie cookie = ResponseCookie.from("token", jwt)
                .path("/")
                .maxAge(24 * 60 * 60) // 1 day
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Login successful");
    }

    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@Valid @RequestBody SignupRequest request) {
        if (userService.userExists(request.getUsername()))
            return new ResponseEntity<>("Error: Username is already taken!", HttpStatus.BAD_REQUEST);
        userService.createUser(request);
        return ResponseEntity.ok("User registered successfully!");
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        // Get user from database to fetch name and role
        User user = userService.findByUsername(username);

        // Extract role (remove ROLE_ prefix if present for cleaner frontend usage)
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("");

        UserInfoResponse response = new UserInfoResponse(username, user.getName(), role);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        // Extract token from cookie
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    // Invalidate token in the token store
                    jwtUtils.invalidateToken(token);

                    // Clear the cookie
                    ResponseCookie cookieToDelete = ResponseCookie.from("token", "")
                            .path("/")
                            .maxAge(0)
                            .httpOnly(true)
                            .secure(true)
                            .sameSite("Lax")
                            .build();
                    
                    response.addHeader(HttpHeaders.SET_COOKIE, cookieToDelete.toString());
                    break;
                }
            }
        }

        return ResponseEntity.ok("Logout successful");
    }

    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(
            @RequestBody GoogleAuthRequest request,
            HttpServletResponse response) {
        try {
            // Verify Google ID token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getCredential());
            if (idToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid Google ID token"));
            }

            // Extract user info from token
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            // Find or create user
            User user = userService.findOrCreateGoogleUser(email, name);

            // Generate JWT token
            String jwt = jwtUtils.generateToken(user.getUsername());

            // Set HttpOnly cookie
            ResponseCookie cookie = ResponseCookie.from("token", jwt)
                    .path("/")
                    .maxAge(24 * 60 * 60) // 1 day
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("Lax")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(Map.of(
                            "message", "Google login successful",
                            "username", user.getUsername(),
                            "name", user.getName()
                    ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Google authentication failed: " + e.getMessage()));
        }
    }

}
