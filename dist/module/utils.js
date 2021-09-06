import { getCanvas, getGame } from './settings.js';
/**
 * Flag Info
 */
export const Flags = {
    Mount: 'mount',
    Riders: 'riders',
    OrigSize: 'origsize',
    MountMove: 'mountMove',
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
    const users = getGame().users?.contents;
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
export function findTokenById(tokenId) {
    return getCanvas().tokens?.placeables.find((t) => t.id == tokenId);
}
/**
 * Returns the first token object from the canvas based on the name value (uses a lowercase search)
 * @param {String} tokenName - The name of the token to look for
 */
export function findTokenByName(tokenName) {
    return getCanvas().tokens?.placeables.find((t) => t.name.toLowerCase() == tokenName.toLowerCase());
}
export function getTokenShape(token) {
    if (token.scene.data.gridType === CONST.GRID_TYPES.GRIDLESS) {
        return { x: 0, y: 0 };
    }
    else if (token.scene.data.gridType === CONST.GRID_TYPES.SQUARE) {
        const topOffset = -Math.floor(token.data.height / 2);
        const leftOffset = -Math.floor(token.data.width / 2);
        const shape = [];
        for (let y = 0; y < token.data.height; y++) {
            for (let x = 0; x < token.data.width; x++) {
                //@ts-ignore
                shape.push({ x: x + leftOffset, y: y + topOffset });
            }
        }
        return shape[0];
    }
    else {
        // Hex grids
        //@ts-ignore
        if (getGame().modules.get('hex-size-support')?.active && CONFIG.hexSizeSupport.getAltSnappingFlag(token)) {
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
            if (Boolean(CONFIG.hexSizeSupport.getAltOrientationFlag(token)) !== getCanvas().grid?.grid?.options.columns)
                shape.forEach((space) => (space.y *= -1));
            if (getCanvas().grid?.grid?.options.columns)
                shape = shape.map((space) => {
                    return { x: space.y, y: space.x };
                });
            return shape[0];
        }
        else {
            return { x: 0, y: 0 };
        }
    }
}
export function getTokenSize(token) {
    let w, h;
    //@ts-ignore
    const hexSizeSupportBorderSize = token.data.flags['hex-size-support']?.borderSize;
    if (hexSizeSupportBorderSize > 0) {
        w = h = hexSizeSupportBorderSize;
    }
    else {
        w = token.data.width;
        h = token.data.height;
    }
    return { w, h };
}
