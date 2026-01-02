"""
Pydantic schemas for request/response validation
"""

from app.schemas.auth import Token, TokenData, UserCreate, UserLogin, UserResponse
from app.schemas.applicant import ApplicantCreate, ApplicantUpdate, ApplicantResponse
from app.schemas.master_data import StateResponse, DistrictResponse, CollegeResponse, CasteResponse

__all__ = [
    "Token",
    "TokenData",
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "ApplicantCreate",
    "ApplicantUpdate",
    "ApplicantResponse",
    "StateResponse",
    "DistrictResponse",
    "CollegeResponse",
    "CasteResponse",
]

