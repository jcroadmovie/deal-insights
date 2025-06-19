from sqlalchemy import Column, Integer, String, Float, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Deal(Base):
    __tablename__ = 'deals'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    sector = Column(String)
    revenue = Column(Float)
    ebitda = Column(Float)
    margin = Column(Float)
    capital_sought = Column(String)
    objective = Column(String)
    summary = Column(Text)
    highlights = Column(Text)
    ai_insights = Column(Text)
