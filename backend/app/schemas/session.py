"""
Session schemas
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class SessionCreate(BaseModel):
    """Schema for creating a session"""
    session_name: str = Field(..., max_length=20)
    session_desc: str
    start_date: datetime
    end_date: datetime
    active_status: str = Field(default="N", pattern="^[YN]$")


class SessionUpdate(BaseModel):
    """Schema for updating a session"""
    session_name: Optional[str] = Field(None, max_length=20)
    session_desc: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    active_status: Optional[str] = Field(None, pattern="^[YN]$")


class SessionResponse(BaseModel):
    """Schema for session response"""
    session_id: int
    session_name: str
    session_desc: str
    start_date: datetime
    end_date: datetime
    center_id: int
    active_status: str
    enroll_id: int | None = None
    
    class Config:
        from_attributes = True

