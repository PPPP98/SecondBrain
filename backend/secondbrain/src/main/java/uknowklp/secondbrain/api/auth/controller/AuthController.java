package uknowklp.secondbrain.api.auth.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import uknowklp.secondbrain.api.user.domain.User;
import uknowklp.secondbrain.api.user.service.UserService;
import uknowklp.secondbrain.global.exception.BaseException;
import uknowklp.secondbrain.global.response.BaseResponse;
import uknowklp.secondbrain.global.response.BaseResponseStatus;
import uknowklp.secondbrain.global.security.jwt.JwtProvider;
import uknowklp.secondbrain.global.security.jwt.dto.CustomUserDetails;
import uknowklp.secondbrain.global.security.jwt.dto.TokenResponse;
import uknowklp.secondbrain.global.security.jwt.service.RefreshTokenService;

/**
 * 인증 관련 REST API 컨트롤러 (단순화된 버전)
 * - Token refresh (access token 갱신)
 * - Logout (token 무효화)
 *
 * Authorization Code 패턴 제거 - OAuth2 로그인 후 직접 JWT 발급
 * Token Rotation 제거 - 단순 갱신 방식 사용
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final JwtProvider jwtProvider;
	private final RefreshTokenService refreshTokenService;
	private final UserService userService;

	@Value("${security.jwt.cookie.secure}")
	private boolean cookieSecure;

	/**
	 * Refresh Token으로 새로운 Access Token 발급 (단순화)
	 * - Token Rotation 제거
	 * - Blacklist 체크 제거
	 * - 단순히 새로운 Access Token만 발급
	 *
	 * @param refreshToken Refresh token (쿠키에서 자동 추출)
	 * @return 새로운 access token
	 */
	@PostMapping("/refresh")
	public ResponseEntity<BaseResponse<TokenResponse>> refresh(
		@CookieValue(name = "refreshToken", required = false) String refreshToken) {

		// 1. Refresh token 존재 여부 확인
		if (refreshToken == null || refreshToken.isEmpty()) {
			log.warn("Refresh token not found in cookie");
			throw new BaseException(BaseResponseStatus.REFRESH_TOKEN_NOT_FOUND);
		}

		// 2. Refresh token JWT 검증
		if (!jwtProvider.validateToken(refreshToken)) {
			log.warn("Invalid refresh token");
			throw new BaseException(BaseResponseStatus.INVALID_REFRESH_TOKEN);
		}

		// 3. Claims에서 사용자 정보 추출
		Claims claims = jwtProvider.getClaims(refreshToken);
		Long userId = claims.get("userId", Long.class);
		String tokenType = claims.get("tokenType", String.class);
		String tokenId = claims.get("tokenId", String.class);

		// 4. Token 타입 확인
		if (!"REFRESH".equals(tokenType)) {
			log.warn("Invalid token type: {}", tokenType);
			throw new BaseException(BaseResponseStatus.INVALID_REFRESH_TOKEN);
		}

		// 5. Redis에서 Refresh Token 검증 (단순 존재 여부만 확인)
		if (!refreshTokenService.validateRefreshToken(String.valueOf(userId), tokenId)) {
			log.warn("Refresh token not found in Redis. UserId: {}", userId);
			throw new BaseException(BaseResponseStatus.REFRESH_TOKEN_NOT_FOUND);
		}

		// 6. 사용자 조회
		User user = userService.findById(userId)
			.orElseThrow(() -> {
				log.error("User not found. UserId: {}", userId);
				return new BaseException(BaseResponseStatus.USER_NOT_FOUND);
			});

		// 7. 새 Access Token 발급 (Refresh Token은 그대로 유지)
		String newAccessToken = jwtProvider.createAccessToken(user);

		log.info("Access token refreshed successfully. UserId: {}, Email: {}", userId, user.getEmail());

		// 8. 응답
		TokenResponse tokenResponse = TokenResponse.of(newAccessToken, jwtProvider.getAccessExpireTime());
		return ResponseEntity.ok(new BaseResponse<>(tokenResponse));
	}

	/**
	 * 로그아웃 처리 (단순화)
	 * - Refresh token을 Redis에서 삭제
	 * - Refresh token 쿠키 삭제
	 * - Access token은 만료까지 유효 (1시간)
	 *
	 * @param userDetails  인증된 사용자 정보
	 * @param refreshToken Refresh token (쿠키에서 자동 추출)
	 * @param response     HTTP 응답 (쿠키 삭제용)
	 * @return 성공 응답
	 */
	@PostMapping("/logout")
	public ResponseEntity<BaseResponse<Void>> logout(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@CookieValue(name = "refreshToken", required = false) String refreshToken,
		HttpServletResponse response) {

		Long userId = userDetails.getUser().getId();

		// 1. Refresh token이 존재하면 Redis에서 삭제
		if (refreshToken != null) {
			try {
				if (jwtProvider.validateToken(refreshToken)) {
					String tokenId = jwtProvider.getTokenId(refreshToken);
					refreshTokenService.revokeRefreshToken(String.valueOf(userId), tokenId);
					log.debug("Refresh token revoked from Redis. UserId: {}", userId);
				}
			} catch (Exception e) {
				// 이미 만료되거나 잘못된 토큰인 경우 무시
				log.debug("Failed to revoke refresh token, may be already expired. UserId: {}", userId);
			}
		}

		// 2. Refresh token 쿠키 삭제
		Cookie refreshCookie = new Cookie("refreshToken", null);
		refreshCookie.setHttpOnly(true);
		refreshCookie.setSecure(cookieSecure);
		refreshCookie.setPath("/");
		refreshCookie.setMaxAge(0);  // 즉시 삭제
		refreshCookie.setAttribute("SameSite", "Lax");
		response.addCookie(refreshCookie);

		log.info("User logged out successfully. UserId: {}, Email: {}", userId, userDetails.getUsername());

		return ResponseEntity.ok(new BaseResponse<>(BaseResponseStatus.SUCCESS));
	}
}