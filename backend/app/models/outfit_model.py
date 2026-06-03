from dataclasses import dataclass
from typing import List

@dataclass
class Outfit:
    id: str
    user_id: str
    items: List[str]  # List of item IDs
    name: str
    occasion: str
