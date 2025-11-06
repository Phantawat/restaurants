package ku.cs.restaurant.listener;

import ku.cs.restaurant.entity.User;
import ku.cs.restaurant.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class AuthenticationEventListener {
    Logger logger = LoggerFactory.getLogger(AuthenticationEventListener.class);
    private final UserService userService;

    @Autowired
    public AuthenticationEventListener(UserService userService) {
        this.userService = userService;
    }

    @EventListener
    public void onSuccess(AuthenticationSuccessEvent event) {
        User user = (User) event.getAuthentication().getPrincipal();
        logger.info("{} successfully logged in at {}", user.getUsername(), Instant.now());
    }

    @EventListener
    public void onFailure(AuthenticationFailureBadCredentialsEvent event) {
        String username = (String) event.getAuthentication().getPrincipal();
        if (userService.userExists(username))
            logger.warn("Failed login attempt [incorrect PASSWORD]");
        else
            logger.warn("Failed login attempt [incorrect USERNAME]");
    }
}

