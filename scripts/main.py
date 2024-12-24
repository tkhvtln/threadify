from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
import schemas
import models
import db


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


@app.post("/database", tags=["Database"], summary="Create database")
async def create_database():
    try:
        async with db.engine.begin() as conn:
            await conn.run_sync(models.Base.metadata.drop_all)
            await conn.run_sync(models.Base.metadata.create_all)
        {"database": "database created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"database creation failed: {str(e)}")


@app.post("/article", tags=["Article"], summary="Add article")
async def add_article(user: schemas.UserSchema, session: db.depence):
    try:
        new_article = models.UserModel(article=user.article)
        session.add(new_article)
        await session.commit()
        return {"id": new_article.id, "article": new_article.article}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"failed to add article: {str(e)}")


@app.get("/article", tags=["Article"], summary="Get article")
async def get_article(session: db.depence):
    try:
        query = select(models.UserModel).order_by(models.UserModel.id.desc())
        result = await session.execute(query)
        articles = result.scalars().all()
        return {"articles": articles}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"failed to fetch articles: {str(e)}")


@app.delete("/article/{article_id}", tags=["Article"], summary="Delete article")
async def delete_article(article_id: int, session: db.depence):
    try:
        article = await session.get(models.UserModel, article_id)
        if article is None:
            raise HTTPException(status_code=404, detail="article not found")      
        await session.delete(article)
        await session.commit()
        return {"articles": "article deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"failed to delete article: {str(e)}")
