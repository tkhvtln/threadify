from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from fastapi import Depends
from typing import Annotated


DATABASE_URL = 'sqlite+aiosqlite:///users.db'


async def get_session():
    async with session() as s:
        yield s


engine = create_async_engine(DATABASE_URL)
session = async_sessionmaker(engine, expire_on_commit=False)
db_session = Annotated[AsyncSession, Depends(get_session)]
