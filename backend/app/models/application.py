from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Application(Base):
    """Application transaction table"""
    __tablename__ = "t_applications"
    
    application_id = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(Integer, ForeignKey("m_applicant.applicant_id"), nullable=False)
    enroll_id = Column(Integer, ForeignKey("t_enrollment_news.enroll_id"), nullable=False)
    session_id = Column(Integer, ForeignKey("m_session.session_id"), nullable=False)
    center_id = Column(Integer, ForeignKey("m_center.center_id"), nullable=False)
    sequence = Column(Integer, nullable=True)
    reg_id = Column(String(20), nullable=True)
    applicant_email_id = Column(String(100), nullable=False)
    qualification_id = Column(Integer, ForeignKey("m_qualification.qualification_id"), nullable=False)
    stream_id = Column(Integer, ForeignKey("m_stream.stream_id"), nullable=False)
    marks = Column(String(5), nullable=False)
    dob_image = Column(String(50), nullable=True)
    marksheet_image = Column(String(50), nullable=True)
    role_id = Column(Integer, ForeignKey("m_role.role_id"), nullable=False, default=4)
    enrollment_status = Column(String(1), nullable=False, default="N")  # Y/N
    payment_status = Column(String(1), nullable=False, default="N")  # Y/N
    cert_status = Column(String(1), nullable=False, default="N")  # Y/N
    updated_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    sel_by = Column(Integer, ForeignKey("m_employee.employee_id"), nullable=True)
    sel_date = Column(DateTime, nullable=True)
    transac_det = Column(String(20), nullable=True)
    transac_det_time = Column(DateTime, nullable=True)
    
    # Relationships
    applicant = relationship("Applicant", back_populates="applications")
    enrollment = relationship("EnrollmentNews", back_populates="applications")
    session = relationship("Session", back_populates="applications")
    center = relationship("Center", back_populates="applications")
    qualification = relationship("Qualification", back_populates="applications")
    stream = relationship("Stream", back_populates="applications")
    role_ref = relationship("Role", back_populates="applications", foreign_keys=[role_id])

