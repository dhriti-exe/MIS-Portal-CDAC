from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base


class GalleryCategory(Base):
    """Gallery category master table"""
    __tablename__ = "m_gallery_category"
    
    gal_cat_id = Column(Integer, primary_key=True, index=True)
    gal_cat_name = Column(String(20), nullable=False)
    updated_by = Column(Integer, nullable=True)
    updated_date = Column(DateTime, nullable=True)
    
    galleries = relationship("Gallery", back_populates="category")

