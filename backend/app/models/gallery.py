from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Gallery(Base):
    """Gallery table"""
    __tablename__ = "t_gallery"
    
    gallery_id = Column(Integer, primary_key=True, index=True)
    gal_cat_id = Column(Integer, ForeignKey("m_gallery_category.gal_cat_id"), nullable=False)
    gal_caption = Column(Text, nullable=False)
    gal_desc = Column(Text, nullable=False)
    hyperlink = Column(String(10), nullable=True)
    gal_img = Column(String(100), nullable=True)
    gal_status = Column(String(1), nullable=False, default="N")  # Y/N
    updated_by = Column(Integer, ForeignKey("m_employee.employee_id"), nullable=True)
    updated_date = Column(DateTime, nullable=True)
    
    category = relationship("GalleryCategory", back_populates="galleries")

