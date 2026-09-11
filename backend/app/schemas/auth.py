from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr
from app.schemas.user import UserResponse

class UserRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "Developer"
    team_id: Optional[UUID] = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

class RefreshTokenRequest(BaseModel):
    refresh_token: str
