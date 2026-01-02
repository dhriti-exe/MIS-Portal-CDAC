"""
Authentication schemas
"""

from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.role import RoleEnum


class UserCreate(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str
    role: RoleEnum


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for decoded token data"""
    sub: Optional[int] = None
    role: Optional[RoleEnum] = None


class UserResponse(BaseModel):
    """Schema for user information response"""
    id: int
    email: str
    role: RoleEnum
    is_active: bool
    applicant_id: Optional[int] = None
    center_id: Optional[int] = None
    employee_id: Optional[int] = None
    
    class Config:
        from_attributes = True

