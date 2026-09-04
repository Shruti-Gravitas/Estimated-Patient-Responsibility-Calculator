from app.database.connection import SessionLocal
from app.models.user import User
from app.core.security import hash_password


ADMIN_EMAIL = "admin@eprcare.com"
ADMIN_PASSWORD = "Admin@12345"


db = SessionLocal()

try:
    existing_admin = (
        db.query(User)
        .filter(User.email == ADMIN_EMAIL)
        .first()
    )

    if existing_admin:
        print("Admin user already exists.")
    else:
        admin_user = User(
            email=ADMIN_EMAIL,
            password_hash=hash_password(ADMIN_PASSWORD),
            role="admin",
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print("Admin user created successfully!")
        print(f"Email: {admin_user.email}")
        print(f"Role: {admin_user.role}")

finally:
    db.close()