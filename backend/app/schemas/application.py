"""
Application schemas
"""

from typing import Optional
from pydantic import BaseModel, Field


class ApplicationCreate(BaseModel):
    """Schema for creating an application"""
    session_id: int
    enroll_id: int
    qualification_id: int
    stream_id: int
    marks: str = Field(..., max_length=5)
    dob_image: Optional[str] = None
    marksheet_image: Optional[str] = None
    role_id: int = Field(default=4)


class ApplicationResponse(BaseModel):
    """Schema for application response"""
    application_id: int
    session_name: str
    center_name: str
    application_status: str
    payment_status: str
    certificate_status: str
    updated_date: str
    reg_id: Optional[str] = None
    
    class Config:
        from_attributes = True

