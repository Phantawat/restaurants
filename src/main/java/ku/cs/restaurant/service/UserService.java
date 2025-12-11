package ku.cs.restaurant.service;


import ku.cs.restaurant.dto.SignupRequest;
import ku.cs.restaurant.entity.User;
import ku.cs.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.Instant;


@Service
public class UserService {
    private UserRepository userRepository;
    private PasswordEncoder encoder;


    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder encoder) {


        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }


    public void createUser(SignupRequest request) {
        User dao = new User();
        dao.setUsername(request.getUsername());
        dao.setPassword(encoder.encode(request.getPassword()));
        dao.setName(request.getName());
        dao.setRole("ROLE_USER");
        dao.setCreatedAt(Instant.now());


        userRepository.save(dao);
    }

    public User findOrCreateGoogleUser(String email, String name) {
        User user = userRepository.findByUsername(email);

        if (user == null) {
            // Create new user for first-time Google login
            User newUser = new User();
            newUser.setUsername(email);
            newUser.setName(name);
            newUser.setPassword(encoder.encode("NO_PASSWORD")); // Required by Spring Security
            newUser.setRole("ROLE_USER");
            newUser.setCreatedAt(Instant.now());
            user = userRepository.save(newUser);
        }

        return user;
    }
}
