import json
from dataclasses import dataclass

from PIL import Image


@dataclass
class Pos3D:
   x: int
   y: int
   z: int

@dataclass
class Pos2D:
   x: int
   y: int
   
class Pos2DEncoder(json.JSONEncoder):
   def default(self, obj):
      if isinstance(obj, Pos2D):
         # Convert the Pos2D object to a dictionary
         return {"x": obj.x, "y": obj.y}
      return super().default(obj)

@dataclass
class Tileset:
   meta: dict[str, Pos2D]
   image: Image

   def save(self, out_path: str):
      self.image.save(f"{out_path}.png")

      with open(f"{out_path}.json", 'w') as f:
         json.dump(self.meta, f, cls=Pos2DEncoder, indent=4)


@dataclass
class TileMetaIn:
    name: str
    ignore: bool = False
    gen_rotated_variants: bool = False
    animated: bool = False
    color_replace: str | None = None
    gen_edge_variants: bool = False