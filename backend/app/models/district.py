from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base

class District(Base):
    __tablename__ = "m_district"
    district_id = Column(Integer, primary_key=True, index=True)
    district_name = Column(String(30), nullable=False)
    district_code = Column(String(10), nullable=False)
    state_id = Column(Integer, ForeignKey("m_state.state_id", ondelete="RESTRICT", onupdate="RESTRICT"), nullable=False)
    updated_by = Column(Integer, nullable=True)
    updated_date = Column(DateTime, nullable=True)
    state = relationship("State", back_populates="districts")
    centers = relationship("Center", back_populates="district")
    applicants = relationship("Applicant", back_populates="district")
    employees = relationship("Employee", back_populates="district")
    __table_args__ = (
        UniqueConstraint("state_id", "district_id", name="m_district_state_id_district_id_uniq"),
    )

