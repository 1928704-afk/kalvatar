# Build stage (Apple Silicon ARM64 & AMD64 멀티 아키텍처 공식 지원)
FROM gradle:8.7-jdk17 AS builder
WORKDIR /app

# Gradle 빌드에 필요한 소스 코드 복사
COPY settings.gradle build.gradle ./
COPY src ./src

# Spring Boot 실행 jar 빌드 (테스트 제외하여 빠른 빌드)
RUN gradle bootJar --no-daemon -x test

# Runtime stage (경량 JRE 이미지)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
