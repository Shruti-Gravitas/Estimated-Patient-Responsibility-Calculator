from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import Base, engine
from app.models.patient import Patient
from app.routes.patient import router as patient_router
from app.models.user import User
from app.routes.auth import router as auth_router


app = FastAPI(title="EPR Calculator API")


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
Base.metadata.create_all(bind=engine)


# Patient routes
app.include_router(patient_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "EPR Calculator API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
