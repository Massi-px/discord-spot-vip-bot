CREATE SCHEMA IF NOT EXISTS "spot_bot_vip";

SET search_path = "spot_bot_vip";

CREATE TABLE  roles (
     id BIGSERIAL PRIMARY KEY,
     name VARCHAR(255) UNIQUE NOT NULL,
     owner_id VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  role_invitations (
      id BIGSERIAL PRIMARY KEY,
      role_id BIGINT REFERENCES roles(id),
      owner_id VARCHAR(255) NOT NULL,
      member_id VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);