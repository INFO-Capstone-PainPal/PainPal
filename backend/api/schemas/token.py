from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    """
    Schema for representing an authentication token.

    This schema is used to return an access token and its type to the client
    after a successful authentication.

    Attributes:
        access_token (str): The JWT (JSON Web Token) used for authenticated requests.
        token_type (str): The type of token (e.g., "bearer").
    """
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """
    Schema for representing data encoded in an authentication token.

    This schema is used to decode and validate the data stored in the JWT.

    Attributes:
        username (Optional[str]): The username of the authenticated user.
                                Defaults to None if not provided.
    """
    username: Optional[str] = None