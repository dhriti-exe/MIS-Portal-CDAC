from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, Text, BigInteger, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Employee(Base):
    """Employee master table"""
    __tablename__ = "m_employee"
    
    employee_id = Column(Integer, primary_key=True, index=True)
    emp_first_name = Column(String(30), nullable=False)
    emp_middle_name = Column(String(30), nullable=True)
    emp_last_name = Column(String(30), nullable=False)
    emp_jod = Column(Date, nullable=False)  # Joining date
    emp_dob = Column(Date, nullable=True)
    emp_gender = Column(String(1), nullable=False)  # M/F/O
    emp_email_id = Column(String(100), nullable=False, unique=True, index=True)
    emp_contact_no = Column(BigInteger, nullable=False)
    emp_breif_profile = Column(Text, nullable=True)
    emp_designation = Column(String(50), nullable=False)
    emp_address = Column(Text, nullable=False)
    emp_photo = Column(String(70), nullable=True)
    center_id = Column(Integer, ForeignKey("m_center.center_id"), nullable=False)
    district_id = Column(Integer, ForeignKey("m_district.district_id"), nullable=False)
    state_id = Column(Integer, ForeignKey("m_state.state_id"), nullable=False)
    emp_pass = Column(String(255), nullable=False)  # Legacy password (deprecated, use User table)
    emp_last_login = Column(DateTime, nullable=True)
    emp_role_id = Column(Integer, ForeignKey("m_role.role_id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("m_employee.employee_id"), nullable=True)
    updated_date = Column(DateTime, nullable=True)
    
    center = relationship("Center", back_populates="employees")
    district = relationship("District", back_populates="employees")
    state = relationship("State", back_populates="employees")
    role = relationship("Role", back_populates="employees")

