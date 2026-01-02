from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class EnrollmentNews(Base):
    """Enrollment news/notices table"""
    __tablename__ = "t_enrollment_news"
    
    enroll_id = Column(Integer, primary_key=True, index=True)
    enroll_title = Column(String(100), nullable=False)
    enroll_desc = Column(Text, nullable=False)
    enroll_start_date = Column(DateTime, nullable=False)
    enroll_end_date = Column(DateTime, nullable=False)
    center_id = Column(Integer, ForeignKey("m_center.center_id"), nullable=False)
    session_id = Column(Integer, ForeignKey("m_session.session_id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("m_employee.employee_id"), nullable=False)
    updated_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    active_status = Column(String(1), nullable=False, default="Y")  # Y/N
    
    # Relationships
    center = relationship("Center", back_populates="enrollments")
    session = relationship("Session", back_populates="enrollments")
    applications = relationship("Application", back_populates="enrollment")

