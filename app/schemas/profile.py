from pydantic import BaseModel

class UserProfileUpdate(BaseModel):

    username:str

    email:str

    
    avatar:str | None = None



class UserProfileResponse(BaseModel):

    id:int

    username:str

    email:str

    avatar:str | None=None

    role:str


    class Config:
        from_attributes=True

class PasswordUpdate(BaseModel):
    old_password:str
    new_password:str