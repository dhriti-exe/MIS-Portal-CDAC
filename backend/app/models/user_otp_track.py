from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.db.base import Base


class UserOTPTrack(Base):
    """User OTP tracking table"""
    __tablename__ = "user_otp_track"
    
    otp_id = Column(Integer, primary_key=True, index=True)
    otp_data = Column(String(255), nullable=False)
    email = Column(String(100), nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

