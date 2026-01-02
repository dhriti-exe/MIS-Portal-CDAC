from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class College(Base):
    __tablename__ = "m_college"
    college_id = Column(Integer, primary_key=True, index=True)
    state_id = Column(Integer, ForeignKey("m_state.state_id"), nullable=False)
    college_name = Column(String(150), nullable=False)
    state = relationship("State", back_populates="colleges")
    applicants = relationship("Applicant", back_populates="college")

