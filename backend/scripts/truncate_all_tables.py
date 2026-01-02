
import sys
import os
import asyncio
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from app.db.session import engine
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

# List your table names here
TABLES = [
    't_applications',
    't_enrollment_news',
    't_gallery',
    't_news',
    't_train_calendar',
    'm_applicant',
    'm_caste',
    'm_center',
    'm_college',
    'm_district',
    'm_employee',
    'm_gallery_category',
    'm_news_category',
    'm_qualification',
    'm_role',
    'm_session',
    'm_state',
    'm_stream',
    'user_otp_track',
    'users'
]

async def truncate_tables():
    async with AsyncSession(engine) as session:
        for table in TABLES:
            await session.execute(text(f'TRUNCATE TABLE "{table}" RESTART IDENTITY CASCADE;'))
        await session.commit()

if __name__ == "__main__":
    asyncio.run(truncate_tables())
