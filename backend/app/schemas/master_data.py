"""
Master data schemas
"""

from pydantic import BaseModel


class StateResponse(BaseModel):
    """Schema for state response"""
    state_id: int
    state_name: str
    state_code: str
    
    class Config:
        from_attributes = True


class DistrictResponse(BaseModel):
    """Schema for district response"""
    district_id: int
    district_name: str
    district_code: str
    state_id: int
    
    class Config:
        from_attributes = True


class CollegeResponse(BaseModel):
    """Schema for college response"""
    college_id: int
    college_name: str
    state_id: int
    
    class Config:
        from_attributes = True


class CasteResponse(BaseModel):
    """Schema for caste response"""
    caste_id: int
    caste_name: str
    
    class Config:
        from_attributes = True


class QualificationResponse(BaseModel):
    """Schema for qualification response"""
    qualification_id: int
    qualification_name: str
    qual_code: int | None
    
    class Config:
        from_attributes = True


class StreamResponse(BaseModel):
    """Schema for stream response"""
    stream_id: int
    stream_name: str
    qual_code: int | None
    
    class Config:
        from_attributes = True
