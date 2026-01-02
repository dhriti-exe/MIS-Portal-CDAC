"""
Authentication dependencies and utilities
"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.user import User
from app.models.role import RoleEnum
from app.core.security import decode_token
from sqlalchemy import select

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get the current authenticated user from JWT token"""
    import logging
    logger = logging.getLogger("auth")
    
    token = credentials.credentials
    logger.debug(f"Attempting to decode token (length: {len(token) if token else 0})")
    
    payload = decode_token(token)
    
    if payload is None:
        from jose import jwt, JWTError
        from app.core.config import settings
        try:
            unverified = jwt.decode(token, settings.SECRET_KEY, options={"verify_signature": False})
            logger.error(f"Token format is valid but signature verification failed. Token payload: {unverified}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials: Token signature verification failed. This may indicate a SECRET_KEY mismatch.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except JWTError as jwt_err:
            logger.error(f"JWT decode error: {str(jwt_err)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid authentication credentials: Token could not be decoded - {str(jwt_err)}",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception as e:
            logger.error(f"Token is malformed or invalid: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid authentication credentials: Token could not be decoded - {str(e)}",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: Expected access token, got type '{payload.get('type')}'",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id_str = payload.get("sub")
    if user_id_str is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload: missing subject",
        )
    try:
        user_id: int = int(user_id_str)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload: subject must be a valid user ID",
        )
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    
    return user


def require_role(role: RoleEnum):
    """Dependency factory to require a specific role"""
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role != role.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {role.value}",
            )
        return current_user
    return role_checker

