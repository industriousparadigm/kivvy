-- Initialize the database with required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create additional users if needed
-- Note: The main user is created by the POSTGRES_USER environment variable

-- Set timezone
SET timezone = 'Europe/Lisbon';

-- Create indexes that might be useful for performance
-- These will be applied after Prisma migrations are run