from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base


class Center(Base):
    """Center master table"""
    __tablename__ = "m_center"
    
    center_id = Column(Integer, primary_key=True, index=True)
    state_id = Column(Integer, ForeignKey("m_state.state_id"), nullable=False)
    district_id = Column(Integer, ForeignKey("m_district.district_id"), nullable=False)
    center_name = Column(String(100), nullable=False)
    center_code = Column(String(10), nullable=True)
    center_address = Column(Text, nullable=True)
    center_phone = Column(String(15), nullable=True, unique=True)
    center_mail_id = Column(String(50), nullable=True)
    center_pay_link = Column(String(255), nullable=True)
    center_venue = Column(String(100), nullable=True)
    updated_by = Column(Integer, nullable=True)  # Foreign key to m_employee.employee_id (circular dependency handled separately)
    updated_date = Column(DateTime, nullable=True)
    
    state = relationship("State", back_populates="centers")
    district = relationship("District", back_populates="centers")
    sessions = relationship("Session", back_populates="center")
    enrollments = relationship("EnrollmentNews", back_populates="center")
    employees = relationship("Employee", back_populates="center")
    applications = relationship("Application", back_populates="center")
    training_calendars = relationship("TrainingCalendar", back_populates="center")

