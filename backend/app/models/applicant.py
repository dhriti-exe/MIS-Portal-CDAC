from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Applicant(Base):
    __tablename__ = "m_applicant"
    applicant_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(30), nullable=False)
    middle_name = Column(String(30), nullable=False)
    last_name = Column(String(30), nullable=False)
    father_name = Column(String(50), nullable=False)
    gender = Column(String(1), nullable=False)
    dob = Column(Date, nullable=False)
    caste_id = Column(Integer, ForeignKey("m_caste.caste_id"), nullable=False)
    address = Column(Text, nullable=False)
    state_id = Column(Integer, ForeignKey("m_state.state_id"), nullable=False)
    district_id = Column(Integer, ForeignKey("m_district.district_id"), nullable=False)
    pin_code = Column(Integer, nullable=False)
    college_id = Column(Integer, ForeignKey("m_college.college_id"), nullable=False)
    other_college = Column(String(60), nullable=True)
    email_id = Column(String(100), nullable=False, unique=True, index=True)
    mobile_no = Column(String(10), nullable=False)
    profile_photo = Column(String(100), nullable=True)
    updated_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    password_legacy = Column("pass", String(255), nullable=True)
    active_status = Column(String(1), nullable=False, default="N")
    caste = relationship("Caste", back_populates="applicants")
    state = relationship("State", back_populates="applicants")
    district = relationship("District", back_populates="applicants")
    college = relationship("College", back_populates="applicants")
    applications = relationship("Application", back_populates="applicant")

