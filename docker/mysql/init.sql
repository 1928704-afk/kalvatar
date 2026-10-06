-- Kalvatar Database Initialization Script (MySQL 8.0)
CREATE DATABASE IF NOT EXISTS kalvatar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kalvatar_db;

-- 1. users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NULL,
    oauth_provider VARCHAR(20) NOT NULL,
    oauth_id VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_oauth (oauth_provider, oauth_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. user_profiles
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    nickname VARCHAR(50) NOT NULL,
    status_message VARCHAR(100) NULL,
    default_visibility VARCHAR(20) NOT NULL DEFAULT 'APPROXIMATE',
    battery_save_mode BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. user_characters
CREATE TABLE IF NOT EXISTS user_characters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    base_avatar_id VARCHAR(30) NOT NULL DEFAULT 'AVATAR_DEFAULT',
    style_config JSON NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_characters_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. safe_zones
CREATE TABLE IF NOT EXISTS safe_zones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    radius_meter INT NOT NULL DEFAULT 300,
    masking_activity VARCHAR(30) NOT NULL DEFAULT 'REST',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_safezones_user (user_id),
    CONSTRAINT fk_safe_zones_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. friendships
CREATE TABLE IF NOT EXISTS friendships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    requester_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    visibility_override VARCHAR(20) NOT NULL DEFAULT 'DEFAULT',
    established_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_requester_receiver (requester_id, receiver_id),
    INDEX idx_receiver_status (receiver_id, status),
    CONSTRAINT fk_friendships_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_friendships_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. schedules
CREATE TABLE IF NOT EXISTS schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(30) NOT NULL,
    raw_input_text TEXT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location_name VARCHAR(100) NULL,
    destination_lat DECIMAL(10, 8) NULL,
    destination_lng DECIMAL(11, 8) NULL,
    repeat_pattern VARCHAR(50) NOT NULL DEFAULT 'NONE',
    visibility VARCHAR(20) NOT NULL DEFAULT 'ALL_FRIENDS',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_schedules_user_time (user_id, start_time),
    CONSTRAINT fk_schedules_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. routine_tasks
CREATE TABLE IF NOT EXISTS routine_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    schedule_id BIGINT NOT NULL,
    task_type VARCHAR(30) NOT NULL,
    instruction VARCHAR(255) NOT NULL,
    scheduled_at DATETIME NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    external_app_action VARCHAR(30) NOT NULL DEFAULT 'NONE',
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_scheduled_completed (scheduled_at, is_completed),
    CONSTRAINT fk_routine_tasks_schedule FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. activity_sessions
CREATE TABLE IF NOT EXISTS activity_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    schedule_id BIGINT NULL,
    activity_type VARCHAR(30) NOT NULL,
    motion_mode VARCHAR(20) NOT NULL DEFAULT 'STATIONARY',
    started_at DATETIME NOT NULL,
    ended_at DATETIME NULL,
    status VARCHAR(20) NOT NULL,
    last_lat DECIMAL(10, 8) NULL,
    last_lng DECIMAL(11, 8) NULL,
    location_name VARCHAR(100) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_user_time (user_id, started_at),
    CONSTRAINT fk_activity_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_activity_sessions_schedule FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. activity_reactions
CREATE TABLE IF NOT EXISTS activity_reactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    activity_session_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    reaction_type VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reaction_receiver (receiver_id),
    CONSTRAINT fk_reactions_session FOREIGN KEY (activity_session_id) REFERENCES activity_sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_reactions_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reactions_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. device_tokens
CREATE TABLE IF NOT EXISTS device_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL,
    os_type VARCHAR(20) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_device (user_id, token),
    CONSTRAINT fk_device_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 샘플 시드 데이터 (테스트용)
-- ==========================================

-- 사용자 4명 등록
INSERT IGNORE INTO users (id, email, oauth_provider, oauth_id, status) VALUES
(1, 'minsu@kalvatar.com', 'KAKAO', 'kakao_1001', 'ACTIVE'),
(2, 'jihyun@kalvatar.com', 'APPLE', 'apple_1002', 'ACTIVE'),
(3, 'junho@kalvatar.com', 'GOOGLE', 'google_1003', 'ACTIVE'),
(4, 'sujin@kalvatar.com', 'KAKAO', 'kakao_1004', 'ACTIVE');

-- 프로필 등록
INSERT IGNORE INTO user_profiles (id, user_id, nickname, status_message, default_visibility, battery_save_mode) VALUES
(1, 1, '민수', '오늘도 힘차게 달립니다!', 'PRECISE', false),
(2, 2, '지현', '따뜻한 라떼 한 잔 ☕', 'APPROXIMATE', false),
(3, 3, '준호', '업무 집중 시간입니다 💻', 'PRECISE', false),
(4, 4, '수진', '기술 스터디 열공 중 📚', 'ACTIVITY_ONLY', true);

-- 안심존 (민수의 집)
INSERT IGNORE INTO safe_zones (id, user_id, name, latitude, longitude, radius_meter, masking_activity, is_active) VALUES
(1, 1, '우리 집', 37.51234560, 127.04567890, 300, 'REST', true);

-- 친구 관계 형성 (민수와 지현, 준호, 수진)
INSERT IGNORE INTO friendships (id, requester_id, receiver_id, status, visibility_override, established_at) VALUES
(1, 1, 2, 'ACCEPTED', 'DEFAULT', NOW()),
(2, 1, 3, 'ACCEPTED', 'DEFAULT', NOW()),
(3, 1, 4, 'ACCEPTED', 'DEFAULT', NOW());

-- 민수의 오늘 저녁 헬스 일정 및 루틴
INSERT IGNORE INTO schedules (id, user_id, title, category, raw_input_text, start_time, end_time, location_name, destination_lat, destination_lng, repeat_pattern) VALUES
(1, 1, '역삼 피트니스 웨이트 운동', 'WORKOUT', '월수금 저녁 7시 역삼 피트니스 1시간 운동', '2026-10-06 19:00:00', '2026-10-06 20:00:00', '역삼 피트니스', 37.50281900, 127.03651100, 'MON_WED_FRI');

INSERT IGNORE INTO routine_tasks (id, schedule_id, task_type, instruction, scheduled_at, sort_order, external_app_action, is_completed) VALUES
(1, 1, 'PREPARE', '🎒 운동복 및 프로틴 챙기기 알림', '2026-10-06 18:20:00', 1, 'NONE', true),
(2, 1, 'DEPART', '🚶 헬스장으로 출발 알림 (도보 18분)', '2026-10-06 18:40:00', 2, 'MAPS', false),
(3, 1, 'FOCUS_TIMER', '⏱️ 60분 운동 세트 타이머 시작', '2026-10-06 19:00:00', 3, 'IN_APP_TIMER', false),
(4, 1, 'CHECKIN', '✅ 운동 완료 기록 및 휴식 상태 전환', '2026-10-06 20:00:00', 4, 'NONE', false);
