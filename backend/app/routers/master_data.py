

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.db.session import get_db
from app.models.state import State
from app.models.district import District
from app.models.college import College
from app.models.caste import Caste
from app.schemas.master_data import (
    StateResponse,
    DistrictResponse,
    CollegeResponse,
    CasteResponse,
)

router = APIRouter()


@router.get("/states", response_model=List[StateResponse])
async def get_states(db: AsyncSession = Depends(get_db)):
    
    result = await db.execute(select(State).order_by(State.state_name))
    states = result.scalars().all()
    return states


@router.get("/districts", response_model=List[DistrictResponse])
async def get_districts(
    state_id: int = Query(..., description="State ID"),
    db: AsyncSession = Depends(get_db)
):
    
    result = await db.execute(
        select(District)
        .where(District.state_id == state_id)
        .order_by(District.district_name)
    )
    districts = result.scalars().all()
    return districts


@router.get("/colleges", response_model=List[CollegeResponse])
async def get_colleges(
    state_id: int = Query(..., description="State ID"),
    db: AsyncSession = Depends(get_db)
):
    
    result = await db.execute(
        select(College)
        .where(College.state_id == state_id)
        .order_by(College.college_name)
    )
    colleges = result.scalars().all()
    return colleges


@router.get("/castes", response_model=List[CasteResponse])
async def get_castes(db: AsyncSession = Depends(get_db)):
    """Get all castes"""
    result = await db.execute(select(Caste).order_by(Caste.caste_name))
    castes = result.scalars().all()
    return castes

