package uknowklp.secondbrain.global.security.filter;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import uknowklp.secondbrain.global.security.jwt.JwtProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtProvider jwtProvider;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
		throws ServletException, IOException {

		String token = resolveToken(request);

		if (token != null) {
			Authentication authentication = jwtProvider.getAuthentication(token);
			if (authentication != null) {
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		}

		filterChain.doFilter(request, response);
	}

	private String resolveToken(HttpServletRequest request) {
		// 1. Authorization 헤더에서 토큰 추출 (우선순위 높음)
		String bearerToken = request.getHeader("Authorization");
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}

		// 2. 쿠키에서 토큰 추출 (HttpOnly 쿠키 지원)
		if (request.getCookies() != null) {
			for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
				if ("accessToken".equals(cookie.getName())) {
					return cookie.getValue();
				}
			}
		}

		return null;
	}
}
