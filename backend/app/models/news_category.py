from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base


class NewsCategory(Base):
    """News category master table"""
    __tablename__ = "m_news_category"
    
    news_cat_id = Column(Integer, primary_key=True, index=True)
    news_cat_name = Column(String(50), nullable=False)
    updated_by = Column(Integer, nullable=True)
    updated_time = Column(DateTime, nullable=True)
    
    news_items = relationship("News", back_populates="category")

