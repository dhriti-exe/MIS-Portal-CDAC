from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class News(Base):
    """News table"""
    __tablename__ = "t_news"
    
    news_id = Column(Integer, primary_key=True, index=True)
    news_cat_id = Column(Integer, ForeignKey("m_news_category.news_cat_id"), nullable=False)
    news_title = Column(String(100), nullable=False)
    news_desc = Column(Text, nullable=False)
    status = Column(String(1), nullable=False, default="N")  # Y/N
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)
    updated_by = Column(Integer, ForeignKey("m_employee.employee_id"), nullable=True)
    updated_date = Column(DateTime, nullable=True)
    
    category = relationship("NewsCategory", back_populates="news_items")

