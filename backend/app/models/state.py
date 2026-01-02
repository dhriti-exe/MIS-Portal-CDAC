from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base


class State(Base):
    """State master table"""
    __tablename__ = "m_state"
    
    state_id = Column(Integer, primary_key=True, index=True)
    state_name = Column(String(30), nullable=False)
    state_code = Column(String(4), nullable=False)
    updated_by = Column(Integer, nullable=True)
    updated_date = Column(DateTime, nullable=True)
    
    districts = relationship("District", back_populates="state", cascade="all, delete-orphan")
    colleges = relationship("College", back_populates="state", cascade="all, delete-orphan")
    centers = relationship("Center", back_populates="state", cascade="all, delete-orphan")
    applicants = relationship("Applicant", back_populates="state")
    employees = relationship("Employee", back_populates="state")

