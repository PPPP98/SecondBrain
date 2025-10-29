package uknowklp.secondbrain.global.security.jwt;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Collections;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import uknowklp.secondbrain.api.user.domain.User;
import uknowklp.secondbrain.api.user.service.UserService;
import uknowklp.secondbrain.global.security.jwt.dto.CustomUserDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtProvider {

	private final String secret;
	private final long accessExpireTime;
	private final long refreshExpireTime;
	private final UserService userService;
	private SecretKey secretKey;

	public JwtProvider(
		@Value("${jwt.secret}") String secret,
		@Value("${jwt.expire-time.access}") Duration accessExpireTime,
		@Value("${jwt.expire-time.refresh}") Duration refreshExpireTime,
		UserService userService
	) {
		this.secret = secret;
		this.accessExpireTime = accessExpireTime.toMillis();
		this.refreshExpireTime = refreshExpireTime.toMillis();
		this.userService = userService;
	}

	@PostConstruct
	private void init() {
		// Base64 디코딩하여 SecretKey 객체로
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		log.info("JWT SecretKey initialized successfully");
		log.info("JWT SecretKey length = {}", secretKey.getEncoded().length);
	}

	public String createToken(User user) {
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + accessExpireTime);

		return Jwts.builder()
			.subject(user.getEmail())
			.claim("userId", user.getId())
			.claim("role", "ROLE_USER")
			.issuedAt(now)
			.expiration(expiryDate)
			.signWith(secretKey)
			.compact();
	}

	// 토큰 유효성 검증
	public boolean validateToken(String token) {
		try {
			Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
			return true;
		} catch (Exception e) {
			log.warn("Invalid JWT token: {}", e.getMessage());
			return false;
		}
	}

	// 토큰에서 사용자 정보를 추출하는 메서드
	public Claims getClaims(String token) {
		return Jwts.parser()
			.verifyWith(secretKey)
			.build()
			.parseSignedClaims(token)
			.getPayload();
	}

	public Authentication getAuthentication(String token) {
		if (validateToken(token)) {
			Claims claims = getClaims(token);
			String email = claims.getSubject();
			String role = claims.get("role", String.class);
			Optional<User> userOpt = userService.findByEmail(email);

			if (userOpt.isPresent()) {

				User user = userOpt.get();
				UserDetails userDetails = new CustomUserDetails(user);
				Set<GrantedAuthority> authorities = Collections.singleton(new SimpleGrantedAuthority(role));
				UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, "",
					authorities);
				log.info("Authenticated user: {}", email);
				return auth;
			}
		}
		return null;
	}
}