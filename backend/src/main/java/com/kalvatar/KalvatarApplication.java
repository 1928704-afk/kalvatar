package com.kalvatar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@EnableJpaAuditing
@SpringBootApplication
public class KalvatarApplication {

    public static void main(String[] args) {
        SpringApplication.run(KalvatarApplication.class, args);
    }
}
