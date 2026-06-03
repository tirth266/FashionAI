from dataclasses import dataclass
from typing import List

@dataclass
class Preference:
    user_id: str
    favorite_colors: List[str]
    preferred_styles: List[str]
    size: str
