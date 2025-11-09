package uknowklp.secondbrain.global.websocket;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import uknowklp.secondbrain.global.exception.BaseException;
import uknowklp.secondbrain.global.response.BaseResponseStatus;
import uknowklp.secondbrain.global.security.jwt.JwtProvider;

@Slf4j
@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

	private final JwtProvider jwtProvider;

	// 메시지 전송 전 인터셉트
	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

		if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
			// CONNECT 시 JWT 검증
			String authHeader = accessor.getFirstNativeHeader("Authorization");

			if (authHeader == null || !authHeader.startsWith("Bearer ")) {
				log.warn("WebSocket 연결 실패: Authorization 헤더 없음");
				throw new BaseException(BaseResponseStatus.UNAUTHORIZED);
			}

			String token = authHeader.substring(7);

			// JWT 검증 및 인증 정보 추출
			Authentication authentication = jwtProvider.getAuthentication(token);
			accessor.setUser(authentication);

			log.info("WebSocket 연결 성공 - userId: {}", authentication.getName());
		}
		else if (accessor != null && StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
			// SUBSCRIBE 시 본인의 topic만 구독 가능하도록 검증
			String destination = accessor.getDestination();
			String userId = accessor.getUser().getName();

			// /topic/reminder/{userId} 형식 검증
			if (destination != null && destination.startsWith("/topic/reminder/")) {
				String topicUserId = destination.substring("/topic/reminder/".length());

				if (!userId.equals(topicUserId)) {
					log.warn("구독 권한 없음 - userId: {}, destination: {}", userId, destination);
					throw new BaseException(BaseResponseStatus.FORBIDDEN);
				}

				log.info("구독 성공 - userId: {}, destination: {}", userId, destination);
			}
		}

		return message;
	}
}
