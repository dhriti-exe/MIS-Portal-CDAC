from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class Caste(Base):
    __tablename__ = "m_caste"
    caste_id = Column(Integer, primary_key=True, index=True)
    caste_name = Column(String(20), nullable=False)
    applicants = relationship("Applicant", back_populates="caste")

