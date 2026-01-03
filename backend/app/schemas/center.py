"""
Center schemas
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class CenterCreate(BaseModel):
    """Schema for creating a center profile"""
    center_name: str = Field(..., max_length=100)
    state_id: int
    district_id: int
    center_code: Optional[str] = Field(None, max_length=10)
    center_address: Optional[str] = None
    center_phone: str = Field(..., pattern="^[0-9]{10}$")
    center_mail_id: Optional[EmailStr] = None
    center_pay_link: str = Field(..., max_length=255)
    center_venue: Optional[str] = Field(None, max_length=100)


class CenterUpdate(BaseModel):
    """Schema for updating a center profile"""
    center_name: Optional[str] = Field(None, max_length=100)
    state_id: Optional[int] = None
    district_id: Optional[int] = None
    center_code: Optional[str] = Field(None, max_length=10)
    center_address: Optional[str] = None
    center_phone: Optional[str] = Field(None, pattern="^[0-9]{10}$")
    center_mail_id: Optional[EmailStr] = None
    center_pay_link: Optional[str] = Field(None, max_length=255)
    center_venue: Optional[str] = Field(None, max_length=100)


class CenterResponse(BaseModel):
    """Schema for center profile response"""
    center_id: int
    center_name: str
    state_id: int
    district_id: int
    center_code: Optional[str]
    center_address: Optional[str]
    center_phone: Optional[str]
    center_mail_id: Optional[str]
    center_pay_link: Optional[str]
    center_venue: Optional[str]
    
    class Config:
        from_attributes = True

