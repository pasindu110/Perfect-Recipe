package com.perfectrecipe.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String method = request.getMethod();
            String requestURI = request.getRequestURI();
            logger.info("Processing request: {} {}", method, requestURI);

            // Skip token validation for OPTIONS requests
            if (method.equals("OPTIONS")) {
                logger.info("Skipping token validation for OPTIONS request");
                filterChain.doFilter(request, response);
                return;
            }

            // Skip token validation for public endpoints
            if (requestURI.startsWith("/api/auth/") ||
                requestURI.startsWith("/api/about") ||
                (requestURI.startsWith("/api/blogs") && method.equals("GET")) ||
                (requestURI.startsWith("/api/recipes") && method.equals("GET")) ||
                requestURI.startsWith("/uploads/")) {
                logger.info("Skipping token validation for public endpoint");
                filterChain.doFilter(request, response);
                return;
            }

            // Get token from header
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("No valid Authorization header found");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\":\"No token provided\"}");
                return;
            }

            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtUtil.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("Authentication successful for user: {}", username);
                } else {
                    logger.warn("Invalid token for user: {}", username);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"error\":\"Invalid token\"}");
                    return;
                }
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            logger.error("Error processing request", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"Internal server error\"}");
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/") || 
               (path.startsWith("/api/blogs") && "GET".equalsIgnoreCase(request.getMethod())) ||
               (path.startsWith("/api/recipes") && "GET".equalsIgnoreCase(request.getMethod())) ||
               path.startsWith("/uploads/");
    }
}