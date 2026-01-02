from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Session(Base):
    """Session master table"""
    __tablename__ = "m_session"
    
    session_id = Column(Integer, primary_key=True, index=True)
    session_name = Column(String(20), nullable=False)
    session_desc = Column(Text, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    center_id = Column(Integer, ForeignKey("m_center.center_id"), nullable=False)
    active_status = Column(String(1), nullable=False, default="N")  # Y/N
    updated_by = Column(Integer, ForeignKey("m_employee.employee_id"), nullable=True)
    updated_date = Column(DateTime, nullable=True)
    
    center = relationship("Center", back_populates="sessions")
    enrollments = relationship("EnrollmentNews", back_populates="session")
    applications = relationship("Application", back_populates="session")

