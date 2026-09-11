from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

    APP_NAME: str = "POC Intelligence Platform"
    APP_ENV: str = "development"
    DEBUG: bool = True

    # Database & Redis
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgrespassword@localhost:5432/poc_platform"
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security & JWT
    JWT_SECRET_KEY: str = "change_this_in_production_super_secret_key_12345"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # AI Configuration
    LLM_PROVIDER: str = "google"
    GOOGLE_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    EMBEDDING_PROVIDER: str = "google"
    VECTOR_DB_PROVIDER: str = "pgvector"

    # LangChain / Observability
    LANGCHAIN_TRACING_V2: bool = False
    LANGCHAIN_API_KEY: str = ""
    LANGCHAIN_PROJECT: str = "poc-intelligence-platform"

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    # Limits & Chunks
    MAX_UPLOAD_SIZE_MB: int = 25
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 150
    RETRIEVAL_TOP_K: int = 5

settings = Settings()
