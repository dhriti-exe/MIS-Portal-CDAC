import enum


class RoleEnum(str, enum.Enum):
    """User roles in the system"""
    APPLICANT = "applicant"
    CENTRE = "centre"
    ADMIN = "admin"

