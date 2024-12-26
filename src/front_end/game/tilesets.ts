import { Pos2D, Pos3D } from '../miscellaneous/types'
import { RenderTile, TileSet } from '../renderer/types'
import { WorldTile } from '../world/main'
import { TileType } from '../world/types'

interface TileTypeData {
  GetRenderTiles: ({
    worldPosition,
    time
  }: {
    worldPosition: Pos3D
    time: DOMHighResTimeStamp
  }) => RenderTile[]
}

const CreateTileTypeData = ({
  tileIndexesList,
  tileset,
  tileSelector
}: {
  tileIndexesList: Pos2D[][]
  tileset: TileSet
  tileSelector: (worldPosition: Pos3D, time: DOMHighResTimeStamp) => number
}): TileTypeData => {
  const GetRenderTiles = ({
    worldPosition,
    time
  }: {
    worldPosition: Pos3D
    time: DOMHighResTimeStamp
  }): RenderTile[] => {
    return tileIndexesList.map((tileIndexes: Pos2D[], index: number) => {
      const i = tileSelector(worldPosition, time)

      return {
        worldPosition: {
          x: worldPosition.x,
          y: worldPosition.y,
          z: worldPosition.z + index
        },
        tileIndex: tileIndexes[i],
        tileset
      }
    })
  }

  return {
    GetRenderTiles
  }
}

const CreateBasicTileTypeData = ({
  tileIndex,
  tileset = TileSet.tiles
}: {
  tileIndex: Pos2D
  tileset?: TileSet
}) => {
  return CreateTileTypeData({
    tileIndexesList: [[tileIndex]],
    tileset,
    tileSelector: () => 0
  })
}

const CreateRandomisedTileTypeData = ({
  tileIndexes,
  tileset = TileSet.tiles
}: {
  tileIndexes: Pos2D[]
  tileset?: TileSet
}) => {
  return CreateTileTypeData({
    tileIndexesList: [tileIndexes],
    tileset,
    tileSelector: (worldPosition: Pos3D, time: DOMHighResTimeStamp) => {
      const z = SurfaceNoise({ x: worldPosition.x, y: worldPosition.y })
      return Math.floor(z * tileIndexes.length)
    }
  })
}

// TODO Move this somewhere else
const CreateRandomNoise2D = (): ((p: Pos2D) => number) => {
  const values: number[] = []
  const n = 13
  for (let y = -n; y < n; y++) {
    for (let x = -n; x < n; x++) {
      values.push(Math.random())
    }
  }

  return (p: Pos2D): number => {
    return values[p.x + n + (p.y + n) * (2 * n)]
  }
}

const SurfaceNoise = CreateRandomNoise2D()

const tileMap: Map<TileType, TileTypeData> = new Map([
  [
    TileType.dirt,
    CreateRandomisedTileTypeData({
      tileIndexes: [
        { x: 5, y: 2 },
        { x: 6, y: 2 }
      ],
      tileset: TileSet.tiles
    })
  ],
  [TileType.grass, CreateBasicTileTypeData({ tileIndex: { x: 1, y: 0 } })],
  [TileType.stone, CreateBasicTileTypeData({ tileIndex: { x: 2, y: 0 } })],
  [TileType.sand, CreateBasicTileTypeData({ tileIndex: { x: 3, y: 0 } })],
  [
    TileType.water,
    CreateTileTypeData({
      tileIndexesList: [
        [
          { x: 5, y: 6 },
          { x: 6, y: 6 },
          { x: 7, y: 6 }
        ]
      ],
      tileset: TileSet.tiles,
      tileSelector: (worldPosition: Pos3D, time: DOMHighResTimeStamp) => {
        const z = SurfaceNoise({ x: worldPosition.x, y: worldPosition.y })
        const period = 20000
        const wrappedTime = (time + z * period) % period
        const i = Math.floor(wrappedTime / (period / 3))
        return i
      }
    })
  ],
  [
    TileType.plant,
    CreateRandomisedTileTypeData({
      tileIndexes: [
        { x: 4, y: 3 },
        { x: 5, y: 3 },
        { x: 6, y: 3 },
        { x: 4, y: 4 },
        { x: 5, y: 4 },
        { x: 6, y: 4 }
      ],
      tileset: TileSet.tiles
    })
  ],
  [TileType.cactus, CreateBasicTileTypeData({ tileIndex: { x: 8, y: 1 } })],
  [TileType.log, CreateBasicTileTypeData({ tileIndex: { x: 8, y: 3 } })],
  [TileType.canopy, CreateBasicTileTypeData({ tileIndex: { x: 7, y: 3 } })],
  [
    TileType.dryGrass,
    CreateRandomisedTileTypeData({
      tileIndexes: [
        { x: 3, y: 2 },
        { x: 4, y: 2 }
      ],
      tileset: TileSet.tiles
    })
  ],
  [
    TileType.smallStones,
    CreateBasicTileTypeData({ tileIndex: { x: 8, y: 0 } })
  ],
  [
    TileType.largeStones,
    CreateBasicTileTypeData({ tileIndex: { x: 9, y: 0 } })
  ],
  [TileType.lava, CreateBasicTileTypeData({ tileIndex: { x: 2, y: 3 } })],
  [
    TileType.blueOrchid,
    CreateTileTypeData({
      tileIndexesList: [
        [
          { x: 10, y: 6 },
          { x: 9, y: 6 }
        ]
      ],
      tileset: TileSet.tiles,
      tileSelector: (worldPosition: Pos3D, time: DOMHighResTimeStamp) => {
        // const perlin = NOISE_MANAGER.GetNoise('plants')
        const z = SurfaceNoise({ x: worldPosition.x, y: worldPosition.y })
        const period = 19000
        const offset = z * period
        const [start, end] = [offset, offset + 1000]
        const wrappedTime = time % period
        // console.log({ start, end, worldPosition, time, z })
        if (start < wrappedTime && wrappedTime < end) {
          return 1
        } else {
          return 0
        }
      }
    })
  ],
  [TileType.rose, CreateBasicTileTypeData({ tileIndex: { x: 8, y: 6 } })],
  [
    TileType.palmTree,
    CreateTileTypeData({
      tileIndexesList: [[{ x: 10, y: 4 }], [{ x: 10, y: 3 }]],
      tileset: TileSet.tiles,
      tileSelector: (worldPosition: Pos3D, time: DOMHighResTimeStamp) => 0
    })
  ]
])

const MapGet = <K, V>(map: Map<K, V>, key: K): V => {
  const value: V | undefined = map.get(key)
  if (value === undefined) {
    throw Error(`Key ${key} not found in map ${map}`)
  }
  return value
}

export const GenerateRenderTiles = ({
  worldTiles,
  time
}: {
  worldTiles: WorldTile[]
  time: DOMHighResTimeStamp
}): RenderTile[] => {
  const rTiles: RenderTile[] = [] // render tiles

  for (const wTile of worldTiles) {
    const tileTypeData: TileTypeData | undefined = tileMap.get(wTile.tileType)
    if (tileTypeData === undefined) {
      throw Error(`Tiletype ${wTile.tileType} not in tilemap`)
    }
    const rts: RenderTile[] = tileTypeData.GetRenderTiles({
      worldPosition: wTile.p,
      time
    })

    rTiles.push(...rts)
  }

  return rTiles
}
