"""
Applicant schemas
"""

from datetime import date
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class ApplicantCreate(BaseModel):
    """Schema for creating an applicant profile"""
    first_name: str = Field(..., max_length=30)
    middle_name: str = Field(..., max_length=30)
    last_name: str = Field(..., max_length=30)
    father_name: str = Field(..., max_length=50)
    gender: str = Field(..., pattern="^[MFO]$")  # M, F, or O
    dob: date
    caste_id: int
    address: str
    state_id: int
    district_id: int
    pin_code: int = Field(..., ge=100000, le=999999)
    college_id: int
    other_college: Optional[str] = Field(None, max_length=60)
    email_id: EmailStr
    mobile_no: str = Field(..., pattern="^[0-9]{10}$")
    profile_photo: Optional[str] = None


class ApplicantUpdate(BaseModel):
    """Schema for updating an applicant profile"""
    first_name: Optional[str] = Field(None, max_length=30)
    middle_name: Optional[str] = Field(None, max_length=30)
    last_name: Optional[str] = Field(None, max_length=30)
    father_name: Optional[str] = Field(None, max_length=50)
    gender: Optional[str] = Field(None, pattern="^[MFO]$")
    dob: Optional[date] = None
    caste_id: Optional[int] = None
    address: Optional[str] = None
    state_id: Optional[int] = None
    district_id: Optional[int] = None
    pin_code: Optional[int] = Field(None, ge=100000, le=999999)
    college_id: Optional[int] = None
    other_college: Optional[str] = Field(None, max_length=60)
    mobile_no: Optional[str] = Field(None, pattern="^[0-9]{10}$")
    profile_photo: Optional[str] = None


class ApplicantResponse(BaseModel):
    """Schema for applicant profile response"""
    applicant_id: int
    first_name: str
    middle_name: str
    last_name: str
    father_name: str
    gender: str
    dob: date
    caste_id: int
    address: str
    state_id: int
    district_id: int
    pin_code: int
    college_id: int
    other_college: Optional[str]
    email_id: str
    mobile_no: str
    profile_photo: Optional[str]
    active_status: str
    
    class Config:
        from_attributes = True

