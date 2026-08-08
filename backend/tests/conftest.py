import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.models.base import Base
from app.core.deps import get_db

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/loc_test",
)

# setup_db() calls Base.metadata.drop_all() on teardown. Pointed at a development
# database, that silently deletes every table and all its data — the suite passes,
# and the damage only shows up the next time the app is started. This has happened.
#
# So the database name has to look like a test database. It is a name check rather
# than anything cleverer because the name is the only thing available before the
# first connection, and a wrong answer here is destructive.
_db_name = DATABASE_URL.rsplit("/", 1)[-1].split("?")[0]
if not (_db_name.endswith("_test") or _db_name.startswith("test_")):
    raise RuntimeError(
        f"Refusing to run tests against database {_db_name!r}.\n"
        "The suite drops every table on teardown, so it only runs against a database "
        "whose name ends in '_test' or starts with 'test_'.\n"
        "Create one and point DATABASE_URL at it:\n"
        "  createdb loc_test\n"
        "  DATABASE_URL=postgresql+psycopg2://loc:loc@localhost:5432/loc_test uv run pytest"
    )

engine = create_engine(DATABASE_URL)
TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    session = TestingSession()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
