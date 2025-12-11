package ku.cs.restaurant.security;

import ku.cs.restaurant.security.JwtCookieAuthFilter;
import ku.cs.restaurant.security.UnauthorizedEntryPointJwt;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

/**
 * Security configuration for JWT Authentication & Role-based Authorization.
 */
@Configuration
public class SecurityConfig {

    private final JwtCookieAuthFilter jwtCookieAuthFilter;
    private final UnauthorizedEntryPointJwt unauthorizedHandler;

    public SecurityConfig(JwtCookieAuthFilter jwtCookieAuthFilter, UnauthorizedEntryPointJwt unauthorizedHandler) {
        this.jwtCookieAuthFilter = jwtCookieAuthFilter;
        this.unauthorizedHandler = unauthorizedHandler;
    }

    /**
     * Main Security Filter Chain configuration
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Enable CORS with our configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Disable CSRF for stateless JWT
                .csrf(csrf -> csrf.disable())

                // Handle unauthorized requests
                .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))

                // Use stateless session (no HttpSession)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Define endpoint access rules
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/auth/login", "/api/auth/signup", "/api/auth/google", "/h2-console/**").permitAll()

                        // Restaurant access rules
                        .requestMatchers(HttpMethod.GET, "/api/restaurants/**")
                        .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/restaurants")
                        .hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/restaurants")
                        .hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/restaurants")
                        .hasAuthority("ROLE_ADMIN")

                        // Admin-specific endpoints
                        .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")

                        // Any other request must be authenticated
                        .anyRequest().authenticated()
                );

        // Allow H2 console (disable frame options)
        http.headers(headers -> headers.frameOptions().disable());

        // Register JWT Cookie filter before UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtCookieAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS configuration to allow credentials from frontend
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("https://localhost:3001"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Set-Cookie"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Password encoder using Argon2 (strong and secure)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    }

    /**
     * Expose AuthenticationManager as a bean for use in controllers
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * Allow H2 console to be accessed without security
     */
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers("/h2-console/**");
    }
}
