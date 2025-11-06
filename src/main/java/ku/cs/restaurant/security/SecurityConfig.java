package ku.cs.restaurant.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;


@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (not needed for stateless JWT)
                .csrf(csrf -> csrf.disable())

                // Set session management to stateless
                .sessionManagement(sessionMnt ->                   sessionMnt.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Set permissions on endpoints
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                // Our public endpoints
                                .requestMatchers("/api/auth/**", "/h2-console/**").permitAll()

                                // Role-based endpoints
                                .requestMatchers(HttpMethod.GET, "/api/restaurants/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/restaurants").hasAnyAuthority("ROLE_ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/api/restaurants").hasAnyAuthority("ROLE_ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/restaurants").hasAnyAuthority("ROLE_ADMIN")
                                .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")

                                // All other endpoints require authentication
                                .anyRequest().authenticated()
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // You can customize parameters for memory, iterations, parallelism
        // based on your security requirements and system resources.
        // Recommended values are at least 19 MiB memory, 2 iterations,
        // and 1 parallelism.
        return Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
        // Or specify custom parameters:
        // return new Argon2PasswordEncoder(16, 32, 1, 19 * 1024, 2);
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers("/h2-console/**");
    }
}
