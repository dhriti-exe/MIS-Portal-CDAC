from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class TrainingCalendar(Base):
    """Training calendar table"""
    __tablename__ = "t_train_calendar"
    
    event_id = Column(Integer, primary_key=True, index=True)
    event_title = Column(String(100), nullable=False)
    center_id = Column(Integer, ForeignKey("m_center.center_id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    updated_by = Column(Integer, ForeignKey("m_employee.employee_id"), nullable=True)
    updated_date = Column(DateTime, nullable=True)
    
    center = relationship("Center", back_populates="training_calendars")

