from sqlalchemy import Column, Integer, String, Text
from database import Base


class HCP(Base):
    __tablename__ = "hcps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    specialty = Column(String)
    hospital = Column(String)
    location = Column(String)
    notes = Column(Text)