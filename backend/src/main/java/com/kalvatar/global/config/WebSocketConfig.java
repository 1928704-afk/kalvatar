package com.kalvatar.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // ws-connect 엔드포인트 등록 (CORS 전체 허용)
        registry.addEndpoint("/ws-connect")
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 클라이언트 구독 프리픽스 (/sub)
        registry.enableSimpleBroker("/sub", "/queue");
        // 클라이언트 발신 프리픽스 (/pub)
        registry.setApplicationDestinationPrefixes("/pub");
        // 특정 사용자 타겟팅 프리픽스 (/user)
        registry.setUserDestinationPrefix("/user");
    }
}
