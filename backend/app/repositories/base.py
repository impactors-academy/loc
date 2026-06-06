from typing import Generic, Type, TypeVar

from sqlalchemy.orm import Session

from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]) -> None:
        self.model = model

    def get(self, db: Session, id: str) -> ModelType | None:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_by_slug(self, db: Session, slug: str) -> ModelType | None:
        return db.query(self.model).filter(self.model.slug == slug).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 20) -> list[ModelType]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, obj: ModelType) -> ModelType:
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    def delete(self, db: Session, id: str) -> None:
        obj = self.get(db, id)
        if obj:
            db.delete(obj)
            db.commit()
