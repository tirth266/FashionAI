from dataclasses import dataclass

@dataclass
class Item:
    id: str
    name: str
    category: str
    color: str
    image_url: str
