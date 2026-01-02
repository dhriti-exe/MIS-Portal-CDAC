"""
Training & Enrollment Management System - FastAPI Application
Main entry point for the backend API
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, applicant, master_data

app = FastAPI(
    title="Training & Enrollment Management System",
    description="MIS Portal API for Training & Enrollment Management",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(applicant.router, prefix="/applicant", tags=["Applicant"])
app.include_router(master_data.router, prefix="/master", tags=["Master Data"])


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Training & Enrollment Management System API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

