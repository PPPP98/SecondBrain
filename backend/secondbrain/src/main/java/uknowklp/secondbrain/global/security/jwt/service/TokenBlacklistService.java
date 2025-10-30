package uknowklp.secondbrain.global.security.jwt.service;

import java.time.Duration;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Token Blacklist 관리 서비스
 * Redis를 사용하여 무효화된 토큰을 관리합니다.
 * - Logout 시 access token blacklist 추가
 * - Token rotation 시 이전 refresh token blacklist 추가
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

	private final RedisTemplate<String, Object> redisTemplate;

	// Redis key pattern: blacklist:access:{tokenId} 또는 blacklist:refresh:{tokenId}
	private static final String BLACKLIST_PREFIX = "blacklist:";

	/**
	 * Token을 blacklist에 추가
	 *
	 * @param tokenId    Token의 고유 ID
	 * @param tokenType  Token 타입 ("ACCESS" 또는 "REFRESH")
	 * @param ttlSeconds 만료 시간 (초 단위) - 토큰의 남은 수명
	 */
	public void addToBlacklist(String tokenId, String tokenType, long ttlSeconds) {
		String key = BLACKLIST_PREFIX + tokenType.toLowerCase() + ":" + tokenId;
		redisTemplate.opsForValue().set(key, "revoked", Duration.ofSeconds(ttlSeconds));
		log.info("Token added to blacklist. Type: {}, TokenId: {}, TTL: {}s", tokenType, tokenId, ttlSeconds);
	}

	/**
	 * Token이 blacklist에 있는지 확인
	 *
	 * @param tokenId   Token의 고유 ID
	 * @param tokenType Token 타입 ("ACCESS" 또는 "REFRESH")
	 * @return Blacklist 존재 여부
	 */
	public boolean isBlacklisted(String tokenId, String tokenType) {
		String key = BLACKLIST_PREFIX + tokenType.toLowerCase() + ":" + tokenId;
		Boolean exists = redisTemplate.hasKey(key);
		boolean isBlacklisted = Boolean.TRUE.equals(exists);

		if (isBlacklisted) {
			log.warn("Blacklisted token detected. Type: {}, TokenId: {}", tokenType, tokenId);
		}

		return isBlacklisted;
	}

	/**
	 * Token을 blacklist에서 제거 (일반적으로 자동 만료되므로 거의 사용되지 않음)
	 *
	 * @param tokenId   Token의 고유 ID
	 * @param tokenType Token 타입 ("ACCESS" 또는 "REFRESH")
	 */
	public void removeFromBlacklist(String tokenId, String tokenType) {
		String key = BLACKLIST_PREFIX + tokenType.toLowerCase() + ":" + tokenId;
		Boolean deleted = redisTemplate.delete(key);
		log.debug("Token removed from blacklist. Type: {}, TokenId: {}, Deleted: {}", tokenType, tokenId, deleted);
	}
}
