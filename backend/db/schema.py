from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class Deal(Base):
    __tablename__ = "deals"

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
    comparables = Column(Text)
    risk_indicators = Column(Text)

    memos = relationship("Memo", back_populates="deal")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    mandates = Column(Text)
    sectors = Column(Text)


class Memo(Base):
    __tablename__ = "memos"

    id = Column(Integer, primary_key=True)
    deal_id = Column(Integer, ForeignKey("deals.id"))
    content = Column(Text)

    deal = relationship("Deal", back_populates="memos")
