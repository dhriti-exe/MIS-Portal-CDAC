from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base


class Role(Base):
    """Role master table"""
    __tablename__ = "m_role"
    
    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(20), nullable=False)
    
    employees = relationship("Employee", back_populates="role")
    applications = relationship("Application", back_populates="role_ref", foreign_keys="Application.role_id")

