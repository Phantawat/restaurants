package ku.cs.restaurant.security;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;


@Component
public class JwtUtil {


    @Value("${jwt.secret}")
    private String jwtSecret;


    @Value("${jwt.expiration}")
    private int jwtExpirationMs;


    private SecretKey key;

    // Token storage for logout functionality (for production, use Redis)
    private final Set<String> validTokens = ConcurrentHashMap.newKeySet();


    // Initializes the key after the class is instantiated and
    // the jwtSecret is injected, preventing the repeated creation
    // of the key and enhancing performance
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
    // Generate JWT token and store it in validTokens set
    public String generateToken(String username) {
        String token = Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key, Jwts.SIG.HS256)
                .compact();

        // Add token to valid tokens set
        validTokens.add(token);
        return token;
    }
    // Get username from JWT token
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key).build()
                .parseSignedClaims(token)
                .getPayload().getSubject();
    }
    // Validate JWT token
    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key).build()
                    .parseSignedClaims(token);
            // Check if token is in valid tokens set (not invalidated by logout)
            return validTokens.contains(token);
        } catch (SecurityException e) {
            System.out.println("Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }

    // Invalidate token (for logout)
    public void invalidateToken(String token) {
        validTokens.remove(token);
    }

    // Check if token is valid (in the set)
    public boolean isTokenValid(String token) {
        return validTokens.contains(token);
    }
}
