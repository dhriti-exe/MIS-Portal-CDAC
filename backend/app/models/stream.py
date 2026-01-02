from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base


class Stream(Base):
    """Stream master table"""
    __tablename__ = "m_stream"
    
    stream_id = Column(Integer, primary_key=True, index=True)
    stream_name = Column(String(100), nullable=False)
    qual_code = Column(Integer, nullable=True)
    
    applications = relationship("Application", back_populates="stream")

