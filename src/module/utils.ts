import { TokenData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import Effect from './effects/effect';
import { canvas, game } from './settings';

/**
 * Flag Info
 */
export const MountUpFlags = {
  Mount: 'mount',
  Riders: 'riders',
  OrigSize: 'origsize',
  MountMove: 'mountMove',
  OrigElevation: 'origelevation',
};

/**
 * Socket Info
 */
export const socketAction = {
  Mount: 0,
  Dismount: 1,
  UpdateToken: 2,
};

/**
 * Rider horizontal placement
 */
export const riderX = {
  Left: 0,
  Center: 1,
  Right: 2,
};

/**
 * Rider vertical placement
 */
export const riderY = {
  Top: 0,
  Center: 1,
  Bottom: 2,
};

export const riderLock = {
  NoLock: 0,
  LockLocation: 1,
  LockBounds: 2,
  Dismount: 3,
};

/**
 * Returns the ID of the first GM logged in
 */
export function firstGM() {
  const users = <User[]>game.users?.contents;
  for (const user of users) {
    if (user.data['role'] >= 4 && user.active) {
      return user.data._id;
    }
  }
  return undefined;
}

/**
 * Returns the first token object from the canvas based on the ID value
 * @param {String} tokenId - The ID of the token to look for
 */
export function findTokenById(tokenId: string): Token {
  return <Token>canvas.tokens?.placeables.find((t) => t.id == tokenId);
}

/**
 * Returns the first token object from the canvas based on the name value (uses a lowercase search)
 * @param {String} tokenName - The name of the token to look for
 */
export function findTokenByName(tokenName: string): Token {
  return <Token>canvas.tokens?.placeables.find((t) => t.name.toLowerCase() == tokenName.toLowerCase());
}

/**
 * Get token center
 */
export const getTokenCenter = function (token: Token, grid: any = {}): { x: number; y: number } {
  /*
    let tokenCenter = {x: token.x , y: token.y };
    tokenCenter.x += -20 + ( token.w * 0.50 );
    tokenCenter.y += -20 + ( token.h * 0.50 );
    */
  // const shapes = getTokenShape(token);
  // if (shapes && shapes.length > 0) {
  //   const shape0 = shapes[0];
  //   return { x: shape0.x, y: shape0.y };
  // }

  // const tokenCenter = { x: token.x + token.w / 2, y: token.y + token.h / 2 };
  // return tokenCenter;

  const data: TokenData = token.data;
  //getCenter(type, data, grid = {}){
  let isGridSpace = false;
  if (token.document.documentName == TileDocument.documentName) {
    isGridSpace = false;
  } else if (token.document.documentName == DrawingDocument.documentName) {
    isGridSpace = false;
  } else {
    isGridSpace = true;
  }
  grid = mergeObject({ w: canvas.grid?.w, h: canvas.grid?.h }, grid);
  const [x, y] = [data.x, data.y];
  let center = { x: x, y: y };
  //Tokens, Tiles
  if ('width' in data && 'height' in data) {
    let [width, height] = [data.width, data.height];
    if (isGridSpace) {
      [width, height] = [width * grid.w, height * grid.h];
    }
    center = { x: x + Math.abs(width) / 2, y: y + Math.abs(height) / 2 };
  }
  //Walls
  if ('c' in data) {
    //@ts-ignore
    center = { x: (data.c[0] + data.c[2]) / 2, y: (data.c[1] + data.c[3]) / 2 };
  }
  return center;
};

/**
 * Get token shape center
 */
function getTokenShape(token): { x: number; y: number }[] {
  if (token.scene.data.gridType === CONST.GRID_TYPES.GRIDLESS) {
    return [{ x: 0, y: 0 }];
  } else if (token.scene.data.gridType === CONST.GRID_TYPES.SQUARE) {
    const topOffset = -Math.floor(token.data.height / 2);
    const leftOffset = -Math.floor(token.data.width / 2);
    const shape: any[] = [];
    for (let y = 0; y < token.data.height; y++) {
      for (let x = 0; x < token.data.width; x++) {
        shape.push({ x: x + leftOffset, y: y + topOffset });
      }
    }
    return shape;
  } else {
    // Hex grids
    //@ts-ignore
    if (game.modules.get('hex-size-support')?.active && CONFIG.hexSizeSupport.getAltSnappingFlag(token)) {
      const borderSize = token.data.flags['hex-size-support'].borderSize;
      let shape = [{ x: 0, y: 0 }];
      if (borderSize >= 2)
        shape = shape.concat([
          { x: 0, y: -1 },
          { x: -1, y: -1 },
        ]);
      if (borderSize >= 3)
        shape = shape.concat([
          { x: 0, y: 1 },
          { x: -1, y: 1 },
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ]);
      if (borderSize >= 4)
        shape = shape.concat([
          { x: -2, y: -1 },
          { x: 1, y: -1 },
          { x: -1, y: -2 },
          { x: 0, y: -2 },
          { x: 1, y: -2 },
        ]);
      //@ts-ignore
      if (Boolean(CONFIG.hexSizeSupport.getAltOrientationFlag(token)) !== canvas.grid?.grid?.options.columns)
        shape.forEach((space) => (space.y *= -1));
      if (canvas.grid?.grid?.options.columns)
        shape = shape.map((space) => {
          return { x: space.y, y: space.x };
        });
      return shape;
    } else {
      return [{ x: 0, y: 0 }];
    }
  }
}

export function getTokenSize(token: Token) {
  let w, h;
  //@ts-ignore
  const hexSizeSupportBorderSize = token.data.flags['hex-size-support']?.borderSize;
  if (hexSizeSupportBorderSize > 0) {
    w = h = hexSizeSupportBorderSize;
  } else {
    w = token.data.width;
    h = token.data.height;
  }
  return { w, h };
}

export class ActiveTokenMountUpData {
  toMountOnMount: Map<string, Effect>;
  toMountOnDismount: Map<string, Effect>;
  toRiderOnMount: Map<string, Effect>;
  toRiderOnDismount: Map<string, Effect>;
  flyingMount: Map<string, Effect>;
}
