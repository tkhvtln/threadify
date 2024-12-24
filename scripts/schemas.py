from pydantic import BaseModel, Field


class UserSchema(BaseModel):
    article: str = Field(max_length=1000)
