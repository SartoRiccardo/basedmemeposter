from config import USER, PSWD
from apis.instagram import Poster

p = Poster(USER, PSWD)
p.post("path/to/image", "caption")
