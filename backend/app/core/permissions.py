from enum import Enum
from typing import List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

class Role(str, Enum):
    SUPER_ADMIN = "Super Admin"
    ORG_ADMIN = "Organization Admin"
    PROJECT_MANAGER = "Project Manager"
    RESEARCHER = "Researcher"
    DEVELOPER = "Developer"
    REVIEWER = "Reviewer"
    VIEWER = "Viewer"

async def get_current_user_token(token: str = Depends(oauth2_scheme)) -> dict:
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload

class RoleChecker:
    def __init__(self, allowed_roles: List[Role]):
        self.allowed_roles = allowed_roles

    def __call__(self, token_data: dict = Depends(get_current_user_token)) -> bool:
        user_role = token_data.get("role")
        if user_role not in [role.value for role in self.allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action."
            )
        return True
