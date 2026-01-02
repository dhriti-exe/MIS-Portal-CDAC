from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base


class Qualification(Base):
    """Qualification master table"""
    __tablename__ = "m_qualification"
    
    qualification_id = Column(Integer, primary_key=True, index=True)
    qualification_name = Column(String(50), nullable=False)
    qual_code = Column(Integer, nullable=True)
    
    applications = relationship("Application", back_populates="qualification")

