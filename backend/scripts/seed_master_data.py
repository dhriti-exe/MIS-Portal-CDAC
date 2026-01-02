
import sys
import os
import asyncio
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.db.base import Base
from app.models.state import State
from app.models.district import District
from app.models.college import College
from app.models.caste import Caste
from app.core.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def seed_data():
    async with AsyncSessionLocal() as session:
        states_data = [
            {"state_name": "Maharashtra", "state_code": "MH"},
            {"state_name": "Karnataka", "state_code": "KA"},
            {"state_name": "Tamil Nadu", "state_code": "TN"},
            {"state_name": "Delhi", "state_code": "DL"},
            {"state_name": "Gujarat", "state_code": "GJ"},
        ]
        states = {}
        for state_data in states_data:
            state = State(**state_data)
            session.add(state)
            await session.flush()
            states[state_data["state_name"]] = state
        if "Maharashtra" in states:
            districts_data = [
                {"district_name": "Mumbai", "district_code": "MUM", "state_id": states["Maharashtra"].state_id},
                {"district_name": "Pune", "district_code": "PUN", "state_id": states["Maharashtra"].state_id},
                {"district_name": "Nagpur", "district_code": "NAG", "state_id": states["Maharashtra"].state_id},
            ]
            for dist_data in districts_data:
                district = District(**dist_data)
                session.add(district)
        if "Maharashtra" in states:
            colleges_data = [
                {"college_name": "Mumbai University", "state_id": states["Maharashtra"].state_id},
                {"college_name": "Pune University", "state_id": states["Maharashtra"].state_id},
                {"college_name": "Other College", "state_id": states["Maharashtra"].state_id},
            ]
            for college_data in colleges_data:
                college = College(**college_data)
                session.add(college)
        castes_data = [
            {"caste_name": "General"},
            {"caste_name": "OBC"},
            {"caste_name": "SC"},
            {"caste_name": "ST"},
            {"caste_name": "Other"},
        ]
        for caste_data in castes_data:
            caste = Caste(**caste_data)
            session.add(caste)
        await session.commit()
        print("Master data seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())

