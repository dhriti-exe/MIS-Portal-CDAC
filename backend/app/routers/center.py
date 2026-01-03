"""
Center router
"""

from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from app.db.session import get_db
from app.models.user import User
from app.models.center import Center
from app.models.session import Session
from app.models.application import Application
from app.models.news import News
from app.models.news_category import NewsCategory
from app.models.role import RoleEnum
from app.schemas.center import CenterCreate, CenterUpdate, CenterResponse
from app.schemas.session import SessionCreate, SessionUpdate, SessionResponse
from app.core.auth import require_role

router = APIRouter()


@router.post("/profile", response_model=CenterResponse, status_code=status.HTTP_201_CREATED)
async def create_center_profile(
    center_data: CenterCreate,
    current_user: User = Depends(require_role(RoleEnum.CENTRE)),
    db: AsyncSession = Depends(get_db)
):
    """Create center profile (onboarding)"""
    # Check if profile already exists
    if current_user.center_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Center profile already exists"
        )
    
    # Check if phone already used by another center
    if center_data.center_phone:
        result = await db.execute(
            select(Center).where(Center.center_phone == center_data.center_phone)
        )
        existing_center = result.scalar_one_or_none()
        
        if existing_center:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered to another center"
            )
    
    # Check if email already used by another center
    if center_data.center_mail_id:
        result = await db.execute(
            select(Center).where(Center.center_mail_id == center_data.center_mail_id)
        )
        existing_center = result.scalar_one_or_none()
        
        if existing_center:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered to another center"
            )
    
    # Create center profile
    new_center = Center(
        **center_data.model_dump()
    )
    
    db.add(new_center)
    await db.commit()
    await db.refresh(new_center)
    
    # Link center to user
    current_user.center_id = new_center.center_id
    await db.commit()
    
    return new_center


@router.get("/profile", response_model=CenterResponse)
async def get_center_profile(
    current_user: User = Depends(require_role(RoleEnum.CENTRE)),
    db: AsyncSession = Depends(get_db)
):
    """Get center profile"""
    if not current_user.center_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Center profile not found. Please complete onboarding."
        )
    
    result = await db.execute(
        select(Center).where(Center.center_id == current_user.center_id)
    )
    center = result.scalar_one_or_none()
    
    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Center profile not found"
        )
    
    return center


@router.put("/profile", response_model=CenterResponse)
async def update_center_profile(
    center_data: CenterUpdate,
    current_user: User = Depends(require_role(RoleEnum.CENTRE)),
    db: AsyncSession = Depends(get_db)
):
    """Update center profile"""
    if not current_user.center_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Center profile not found. Please complete onboarding."
        )
    
    result = await db.execute(
        select(Center).where(Center.center_id == current_user.center_id)
    )
    center = result.scalar_one_or_none()
    
    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Center profile not found"
        )
    
    # Check for phone uniqueness if updating phone
    if center_data.center_phone and center_data.center_phone != center.center_phone:
        result = await db.execute(
            select(Center).where(
                Center.center_phone == center_data.center_phone,
                Center.center_id != center.center_id
            )
        )
        existing_center = result.scalar_one_or_none()
        if existing_center:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered to another center"
            )
    
    # Check for email uniqueness if updating email
    if center_data.center_mail_id and center_data.center_mail_id != center.center_mail_id:
        result = await db.execute(
            select(Center).where(
                Center.center_mail_id == center_data.center_mail_id,
                Center.center_id != center.center_id
            )
        )
        existing_center = result.scalar_one_or_none()
        if existing_center:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered to another center"
            )
    
    # Update fields
    update_data = center_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(center, field, value)
    
    await db.commit()
    await db.refresh(center)
    
    return center


# Dashboard response schemas
class SessionResponse(BaseModel):
    session_id: int
    session_name: str
    session_desc: str
    start_date: datetime
    end_date: datetime
    active_status: str
    
    class Config:
        from_attributes = True


class ApplicationResponse(BaseModel):
    application_id: int
    applicant_name: str
    applicant_email: str
    session_name: str
    application_status: str
    payment_status: str
    certificate_status: str
    reg_id: str | None
    updated_date: datetime
    
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


@router.get("/sessions", response_model=List[SessionResponse])
async def get_center_sessions(
    current_user: User = Depends(require_role(RoleEnum.CENTRE)),
    db: AsyncSession = Depends(get_db)
):
    """Get all sessions for the center"""
    if not current_user.center_id:
        return []
    
    result = await db.execute(
        select(Session)
        .where(Session.center_id == current_user.center_id)
        .order_by(Session.start_date.desc())
    )
    sessions = result.scalars().all()
    
    return [
        SessionResponse(
            session_id=s.session_id,
            session_name=s.session_name,
            session_desc=s.session_desc,
            start_date=s.start_date,
            end_date=s.end_date,
            center_id=s.center_id,
            active_status=s.active_status
        )
        for s in sessions
    ]


@router.post("/sessions", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_data: SessionCreate,
    current_user: User = Depends(require_role(RoleEnum.CENTRE)),
    db: AsyncSession = Depends(get_db)
):
    """Create a new session for the center"""
    if not current_user.center_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Center profile not found. Please complete onboarding."
        )
    
    # Validate dates
    if session_data.end_date <= session_data.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )
    
    # Create session
    new_session = Session(
        session_name=session_data.session_name,
        session_desc=session_data.session_desc,
        start_date=session_data.start_date,
        end_date=session_data.end_date,
        center_id=current_user.center_id,
        active_status=session_data.active_status
    )
    
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    
    return SessionResponse(
        session_id=new_session.session_id,
        session_name=new_session.session_name,
        session_desc=new_session.session_desc,
        start_date=new_session.start_date,
        end_date=new_session.end_date,
        center_id=new_session.center_id,
        active_status=new_session.active_status
    )


@router.put("/sessions/{session_id}", response_model=SessionResponse)
async def update_session(
    session_id: int,
    session_data: SessionUpdate,
    current_user: User = Depends(require_role(RoleEnum.CENTRE)),
    db: AsyncSession = Depends(get_db)
):
    """Update a session"""
    if not current_user.center_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Center profile not found. Please complete onboarding."
        )
    
    # Get session and verify ownership
    result = await db.execute(
        select(Session).where(
            Session.session_id == session_id,
            Session.center_id == current_user.center_id
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Validate dates if both are being updated
    update_data = session_data.model_dump(exclude_unset=True)
    start_date = update_data.get('start_date', session.start_date)
    end_date = update_data.get('end_date', session.end_date)
    
    if end_date <= start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )
    
    # Update fields
    for field, value in update_data.items():
        setattr(session, field, value)
    
    session.updated_date = datetime.utcnow()
    
    await db.commit()
    await db.refresh(session)
    
    return SessionResponse(
        session_id=session.session_id,
        session_name=session.session_name,
        session_desc=session.session_desc,
        start_date=session.start_date,
        end_date=session.end_date,
        center_id=session.center_id,
        active_status=session.active_status
    )


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: int,
    current_user: User = Depends(require_role(RoleEnum.CENTRE)),
    db: AsyncSession = Depends(get_db)
):
    """Delete a session"""
    if not current_user.center_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Center profile not found. Please complete onboarding."
        )
    
    # Get session and verify ownership
    result = await db.execute(
        select(Session).where(
            Session.session_id == session_id,
            Session.center_id == current_user.center_id
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    from sqlalchemy import delete
    await db.execute(delete(Session).where(Session.session_id == session_id))
    await db.commit()
    
    return None


@router.get("/applications", response_model=List[ApplicationResponse])
async def get_center_applications(
    current_user: User = Depends(require_role(RoleEnum.CENTRE)),
    db: AsyncSession = Depends(get_db)
):
    """Get all applications for the center"""
    if not current_user.center_id:
        return []
    
    result = await db.execute(
        select(Application)
        .options(
            selectinload(Application.applicant),
            selectinload(Application.session)
        )
        .where(Application.center_id == current_user.center_id)
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
        
        # Get applicant name
        applicant_name = "N/A"
        if app.applicant:
            applicant_name = f"{app.applicant.first_name} {app.applicant.middle_name or ''} {app.applicant.last_name}".strip()
        
        response.append(ApplicationResponse(
            application_id=app.application_id,
            applicant_name=applicant_name,
            applicant_email=app.applicant_email_id,
            session_name=app.session.session_name if app.session else "N/A",
            application_status=app_status_map.get(app.enrollment_status, "Pending"),
            payment_status=payment_status_map.get(app.payment_status, "Pending"),
            certificate_status=cert_status_map.get(app.cert_status, "Not Issued"),
            reg_id=app.reg_id,
            updated_date=app.updated_date
        ))
    
    return response


@router.get("/news", response_model=List[NewsResponse])
async def get_center_news(
    current_user: User = Depends(require_role(RoleEnum.CENTRE)),
    db: AsyncSession = Depends(get_db)
):
    """Get all news items (global news for now)"""
    result = await db.execute(
        select(News)
        .options(selectinload(News.category))
        .where(
            and_(
                News.status == "Y",
                News.end_datetime >= datetime.utcnow()
            )
        )
        .order_by(News.start_datetime.desc())
    )
    news_items = result.scalars().all()
    
    return [
        NewsResponse(
            news_id=n.news_id,
            news_title=n.news_title,
            news_desc=n.news_desc,
            category_name=n.category.news_cat_name if n.category else "General",
            start_datetime=n.start_datetime,
            end_datetime=n.end_datetime,
            status=n.status
        )
        for n in news_items
    ]

