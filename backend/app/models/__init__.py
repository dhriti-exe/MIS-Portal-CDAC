"""
SQLAlchemy models for the Training & Enrollment Management System
"""

from app.models.user import User
from app.models.role import RoleEnum
from app.models.applicant import Applicant
from app.models.state import State
from app.models.district import District
from app.models.college import College
from app.models.caste import Caste
from app.models.center import Center
from app.models.employee import Employee
from app.models.session import Session
from app.models.qualification import Qualification
from app.models.stream import Stream
from app.models.enrollment_news import EnrollmentNews
from app.models.application import Application
from app.models.gallery_category import GalleryCategory
from app.models.gallery import Gallery
from app.models.news_category import NewsCategory
from app.models.news import News
from app.models.training_calendar import TrainingCalendar
from app.models.user_otp_track import UserOTPTrack
from app.models.role_master import Role

__all__ = [
    "User",
    "RoleEnum",
    "Role",
    "Applicant",
    "State",
    "District",
    "College",
    "Caste",
    "Center",
    "Employee",
    "Session",
    "Qualification",
    "Stream",
    "EnrollmentNews",
    "Application",
    "GalleryCategory",
    "Gallery",
    "NewsCategory",
    "News",
    "TrainingCalendar",
    "UserOTPTrack",
]

