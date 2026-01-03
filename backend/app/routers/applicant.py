"""
Applicant router
"""

from datetime import datetime
from typing import List
from io import BytesIO
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.models.user import User
from app.models.applicant import Applicant
from app.models.application import Application
from app.models.news import News
from app.models.center import Center
from app.models.session import Session
from app.schemas.session import SessionResponse
from app.schemas.application import ApplicationCreate, ApplicationResponse as ApplicationResponseSchema
from app.models.role import RoleEnum
from app.schemas.applicant import ApplicantCreate, ApplicantUpdate, ApplicantResponse
from app.core.auth import get_current_user, require_role
from app.core.config import settings
from pydantic import BaseModel

# Function to configure Cloudinary dynamically
def configure_cloudinary():
    """Configure Cloudinary with settings from environment"""
    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET
        )
        return True
    return False

# Configure Cloudinary at module load
_cloudinary_configured = configure_cloudinary()

router = APIRouter()


@router.post("/profile", response_model=ApplicantResponse, status_code=status.HTTP_201_CREATED)
async def create_applicant_profile(
    applicant_data: ApplicantCreate,
    current_user: User = Depends(require_role(RoleEnum.APPLICANT)),
    db: AsyncSession = Depends(get_db)
):
    """Create applicant profile (onboarding)"""
    # Check if profile already exists
    if current_user.applicant_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Applicant profile already exists"
        )
    
    # Check if email already used by another applicant
    result = await db.execute(
        select(Applicant).where(Applicant.email_id == applicant_data.email_id)
    )
    existing_applicant = result.scalar_one_or_none()
    
    if existing_applicant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered to another applicant"
        )
    
    # Create applicant profile
    new_applicant = Applicant(
        **applicant_data.model_dump(),
        active_status="Y"
    )
    
    db.add(new_applicant)
    await db.commit()
    await db.refresh(new_applicant)
    
    # Link applicant to user
    current_user.applicant_id = new_applicant.applicant_id
    await db.commit()
    
    return new_applicant


@router.get("/profile", response_model=ApplicantResponse)
async def get_applicant_profile(
    current_user: User = Depends(require_role(RoleEnum.APPLICANT)),
    db: AsyncSession = Depends(get_db)
):
    """Get applicant profile"""
    if not current_user.applicant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant profile not found. Please complete onboarding."
        )
    
    result = await db.execute(
        select(Applicant).where(Applicant.applicant_id == current_user.applicant_id)
    )
    applicant = result.scalar_one_or_none()
    
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant profile not found"
        )
    
    return applicant


@router.put("/profile", response_model=ApplicantResponse)
async def update_applicant_profile(
    applicant_data: ApplicantUpdate,
    current_user: User = Depends(require_role(RoleEnum.APPLICANT)),
    db: AsyncSession = Depends(get_db)
):
    """Update applicant profile"""
    if not current_user.applicant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant profile not found. Please complete onboarding."
        )
    
    result = await db.execute(
        select(Applicant).where(Applicant.applicant_id == current_user.applicant_id)
    )
    applicant = result.scalar_one_or_none()
    
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant profile not found"
        )
    
    # Update fields
    update_data = applicant_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(applicant, field, value)
    
    await db.commit()
    await db.refresh(applicant)
    
    return applicant


# Response schemas for dashboard data
class ApplicationResponse(BaseModel):
    application_id: int
    session_name: str
    center_name: str
    application_status: str
    payment_status: str
    certificate_status: str
    updated_date: datetime
    reg_id: str | None
    
    class Config:
        from_attributes = True


class NewsResponse(BaseModel):
    news_id: int
    news_title: str
    news_desc: str
    category_name: str
    start_datetime: datetime
    end_datetime: datetime
    status: str
    
    class Config:
        from_attributes = True


@router.get("/applications", response_model=List[ApplicationResponse])
async def get_my_applications(
    current_user: User = Depends(require_role(RoleEnum.APPLICANT)),
    db: AsyncSession = Depends(get_db)
):
    """Get all applications for the current applicant"""
    if not current_user.applicant_id:
        return []
    
    result = await db.execute(
        select(Application)
        .options(
            selectinload(Application.center),
            selectinload(Application.session)
        )
        .where(Application.applicant_id == current_user.applicant_id)
        .order_by(Application.updated_date.desc())
    )
    applications = result.scalars().all()
    
    # Transform to response format
    response = []
    for app in applications:
        # Map status codes to readable strings
        app_status_map = {"Y": "Selected", "N": "Submitted", "R": "Rejected", "P": "Pending"}
        payment_status_map = {"Y": "Paid", "N": "Unpaid", "P": "Pending"}
        cert_status_map = {"Y": "Issued", "N": "Not Issued", "P": "Pending"}
        
        response.append(ApplicationResponse(
            application_id=app.application_id,
            center_name=app.center.center_name if app.center else "N/A",
            session_name=app.session.session_name if app.session else "N/A",
            application_status=app_status_map.get(app.enrollment_status, "Pending"),
            payment_status=payment_status_map.get(app.payment_status, "Pending"),
            certificate_status=cert_status_map.get(app.cert_status, "Not Issued"),
            updated_date=app.updated_date,
            reg_id=app.reg_id
        ))
    
    return response


@router.get("/news", response_model=List[NewsResponse])
async def get_news(
    current_user: User = Depends(require_role(RoleEnum.APPLICANT)),
    db: AsyncSession = Depends(get_db)
):
    """Get latest news items"""
    # Get active news within validity period
    now = datetime.utcnow()
    result = await db.execute(
        select(News)
        .options(selectinload(News.category))
        .where(
            and_(
                News.status == "Y",
                News.start_datetime <= now,
                News.end_datetime >= now
            )
        )
        .order_by(News.updated_date.desc())
        .limit(10)
    )
    news_items = result.scalars().all()
    
    response = []
    for news in news_items:
        response.append(NewsResponse(
            news_id=news.news_id,
            news_title=news.news_title,
            news_desc=news.news_desc,
            category_name=news.category.news_cat_name if news.category else "General",
            start_datetime=news.start_datetime,
            end_datetime=news.end_datetime,
            status=news.status
        ))
    
    return response


@router.get("/sessions", response_model=List[SessionResponse])
async def get_available_sessions(
    current_user: User = Depends(require_role(RoleEnum.APPLICANT)),
    db: AsyncSession = Depends(get_db)
):
    """Get all sessions available for applicants (both active and inactive)"""
    # Get all sessions - applicants should see all sessions created by centers
    result = await db.execute(
        select(Session)
        .options(selectinload(Session.center))
        .order_by(Session.start_date.desc())
    )
    sessions = result.scalars().all()
    
    # For each session, find the first active enrollment/news (if any) and include its enroll_id
    session_enroll_map = {}
    from app.models.enrollment_news import EnrollmentNews
    for s in sessions:
        enroll_result = await db.execute(
            select(EnrollmentNews).where(EnrollmentNews.session_id == s.session_id, EnrollmentNews.active_status == 'Y').order_by(EnrollmentNews.enroll_start_date.asc())
        )
        enrollment = enroll_result.scalars().first()
        session_enroll_map[s.session_id] = enrollment.enroll_id if enrollment else None

    return [
        SessionResponse(
            session_id=s.session_id,
            session_name=s.session_name,
            session_desc=s.session_desc,
            start_date=s.start_date,
            end_date=s.end_date,
            center_id=s.center_id,
            active_status=s.active_status,
            enroll_id=session_enroll_map.get(s.session_id)
        )
        for s in sessions
    ]


@router.post("/applications", response_model=ApplicationResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_application(
    application_data: ApplicationCreate,
    current_user: User = Depends(require_role(RoleEnum.APPLICANT)),
    db: AsyncSession = Depends(get_db)
):
    """Create a new application for a session"""
    if not current_user.applicant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant profile not found. Please complete onboarding."
        )
    
    # Get applicant profile
    result = await db.execute(
        select(Applicant).where(Applicant.applicant_id == current_user.applicant_id)
    )
    applicant = result.scalar_one_or_none()
    
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant profile not found"
        )
    
    # Get session and verify it exists
    session_result = await db.execute(
        select(Session).where(Session.session_id == application_data.session_id)
    )
    session = session_result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Check if applicant already applied to this session
    existing_app = await db.execute(
        select(Application).where(
            and_(
                Application.applicant_id == current_user.applicant_id,
                Application.session_id == application_data.session_id
            )
        )
    )
    if existing_app.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this session"
        )
    
    # Create application
    new_application = Application(
        applicant_id=current_user.applicant_id,
        enroll_id=application_data.enroll_id,
        session_id=application_data.session_id,
        center_id=session.center_id,
        applicant_email_id=applicant.email_id,
        qualification_id=application_data.qualification_id,
        stream_id=application_data.stream_id,
        marks=application_data.marks,
        dob_image=application_data.dob_image,
        marksheet_image=application_data.marksheet_image,
        role_id=application_data.role_id,
        enrollment_status="N",  # Submitted
        payment_status="N",
        cert_status="N"
    )
    
    db.add(new_application)
    await db.commit()
    await db.refresh(new_application)
    
    # Get session and center for response
    session_result = await db.execute(
        select(Session)
        .options(selectinload(Session.center))
        .where(Session.session_id == application_data.session_id)
    )
    session = session_result.scalar_one_or_none()
    
    app_status_map = {"Y": "Selected", "N": "Submitted", "R": "Rejected", "P": "Pending"}
    payment_status_map = {"Y": "Paid", "N": "Unpaid", "P": "Pending"}
    cert_status_map = {"Y": "Issued", "N": "Not Issued", "P": "Pending"}
    
    return ApplicationResponseSchema(
        application_id=new_application.application_id,
        session_name=session.session_name if session else "N/A",
        center_name=session.center.center_name if session and session.center else "N/A",
        application_status=app_status_map.get(new_application.enrollment_status, "Pending"),
        payment_status=payment_status_map.get(new_application.payment_status, "Pending"),
        certificate_status=cert_status_map.get(new_application.cert_status, "Not Issued"),
        updated_date=new_application.updated_date.isoformat(),
        reg_id=new_application.reg_id
    )


@router.patch("/profile/photo", response_model=ApplicantResponse)
async def update_profile_photo(
    profile_photo: UploadFile = File(...),
    current_user: User = Depends(require_role(RoleEnum.APPLICANT)),
    db: AsyncSession = Depends(get_db)
):
    """Update applicant profile photo only - uploads to Cloudinary"""
    if not current_user.applicant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant profile not found. Please complete onboarding."
        )
    
    result = await db.execute(
        select(Applicant).where(Applicant.applicant_id == current_user.applicant_id)
    )
    applicant = result.scalar_one_or_none()
    
    if not applicant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Applicant profile not found"
        )
    
    # Validate file type
    if not profile_photo.content_type or not profile_photo.content_type.startswith('image/'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Validate file size (5MB max)
    contents = await profile_photo.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE / (1024 * 1024)}MB"
        )
    
    # Check if Cloudinary is configured
    cloud_name = settings.CLOUDINARY_CLOUD_NAME
    api_key = settings.CLOUDINARY_API_KEY
    api_secret = settings.CLOUDINARY_API_SECRET
    
    if not (cloud_name and api_key and api_secret):
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Cloudinary not configured. Cloud name: '{cloud_name}', API key: '{api_key[:5] if api_key else 'None'}...', API secret: {'***' if api_secret else 'None'}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Image upload service is not configured. Please restart the backend server after adding Cloudinary credentials to .env file."
        )
    
    # Configure Cloudinary before upload (ensure fresh config)
    try:
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret
        )
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to configure Cloudinary: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to configure Cloudinary: {str(e)}"
        )
    
    try:
        file_obj = BytesIO(contents)
        file_obj.name = profile_photo.filename or f"profile_{applicant.applicant_id}.jpg"
        upload_result = cloudinary.uploader.upload(
            file_obj,
            folder="applicant_profiles",
            public_id=f"applicant_{applicant.applicant_id}",
            overwrite=True,
            resource_type="image",
            transformation=[
                {"width": 400, "height": 400, "crop": "fill", "gravity": "face"},
                {"quality": "auto"},
            ]
        )
        cloudinary_url = upload_result.get("secure_url")
        if not cloudinary_url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get image URL from Cloudinary"
            )
        if applicant.profile_photo and "cloudinary.com" in applicant.profile_photo:
            try:
                old_public_id = f"applicant_profiles/applicant_{applicant.applicant_id}"
                cloudinary.uploader.destroy(old_public_id)
            except Exception:
                pass
        applicant.profile_photo = cloudinary_url
        await db.commit()
        await db.refresh(applicant)
        return applicant
    except cloudinary.exceptions.Error as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Cloudinary upload error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cloudinary upload failed: {str(e)}. Please check Cloudinary configuration."
        )
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Profile photo upload error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload profile photo: {str(e)}"
        )

