//@ts-ignore
// import { tokenAttacher } from '../../token-attacher/scripts/token-attacher.js';

import { warn } from '../foundryvtt-mountup';
import { getCanvas, getGame } from './settings';
import { findTokenById, Flags } from './utils';

export const mountUp = async function (riderToken: Token, mountToken: Token) {
  const targets = [mountToken]; // Array.from(getGame().user.targets);
  if (targets.length > 0) {
    if (targets.length > 1) {
      return ui.notifications?.error("Can't mount more then one token!");
    }

    const mount = targets[0];
    const newMountCoords = {
      x: mount.document.data.x ? mount.document.data.x : mount.x,
      y: mount.document.data.y ? mount.document.data.y : mount.y,
      w: mount.document.data.width ? mount.document.data.width : mount.w,
      h: mount.document.data.height ? mount.document.data.height : mount.h,
    };
    const newRiderCoords = {
      x: riderToken.document.data.x ? riderToken.document.data.x : riderToken.x,
      y: riderToken.document.data.y ? riderToken.document.data.y : riderToken.y,
      w: riderToken.document.data.width ? riderToken.document.data.width : riderToken.w,
      h: riderToken.document.data.height ? riderToken.document.data.height : riderToken.h,
    };

    if (newMountCoords.x + newMountCoords.w - newRiderCoords.w < newRiderCoords.x) {
      newRiderCoords.x = newMountCoords.x + newMountCoords.w - newRiderCoords.w;
    } else if (newMountCoords.x > newRiderCoords.x) {
      newRiderCoords.x = newMountCoords.x;
    }
    if (newMountCoords.y + newMountCoords.h - newRiderCoords.h < newRiderCoords.y) {
      newRiderCoords.y = newMountCoords.y + newMountCoords.h - newRiderCoords.h;
    } else if (newMountCoords.y > newRiderCoords.y) {
      newRiderCoords.y = newMountCoords.y;
    }

    await riderToken.document.update({
      x: newRiderCoords.x,
      y: newRiderCoords.y,
    });

    await riderToken.update(
      {
        x: newRiderCoords.x,
        y: newRiderCoords.y,
      },
      undefined,
    );

    //@ts-ignore
    ui.chat.processMessage(`I mount this ${targets[0].name}`);
    const userGMToWhisper = <User>getGame().users?.find((u) => u.isGM && u.active);
    const chatData = {
      type: 4,
      user: <User>getGame().user,
      speaker: { alias: 'Mount Up' },
      content: `I mount this ${targets[0].name}`,
      whisper: [userGMToWhisper.id, getGame().user],
    };
    //@ts-ignore
    ChatMessage.create({}, chatData);

    await window['tokenAttacher'].attachElementToToken(riderToken, targets[0], true);
    await window['tokenAttacher'].setElementsLockStatus(riderToken, false, true);
  }
};

export const dismountDropAll = async function (mountToken: Token) {
  // tokenAttacher.detachAllElementsFromToken(mountToken, true);
  await window['tokenAttacher'].detachAllElementsFromToken(mountToken, true);
  //@ts-ignore
  ui.chat.processMessage(`Everyone and everything get off!`);
  const userGMToWhisper = <User>getGame().users?.find((u) => u.isGM && u.active);
  const chatData = {
    type: 4,
    user: <User>getGame().user,
    speaker: { alias: 'Mount Up' },
    content: `Everyone and everything get off!`,
    whisper: [userGMToWhisper.id, getGame().user],
  };
  //@ts-ignore
  ChatMessage.create({}, chatData);
};

export const dismountDropTarget = async function (mountToken: Token, target: Token) {
  const targets = [target]; // Array.from(getGame().user.targets);
  if (targets.length > 0) {
    if (targets.length > 1) {
      return ui.notifications?.error("Can't follow more then one token!");
    }
    //await tokenAttacher.detachElementsFromToken(targets, token, true);
    await window['tokenAttacher'].detachElementsFromToken(targets, mountToken, true);
    //dismountDropAll(token);
    for (let i = 0; i < targets.length; i++) {
      const targ: Token = targets[i];
      //@ts-ignore
      ui.chat.processMessage(`Get off ${targ.name}!`);
      const userGMToWhisper = <User>getGame().users?.find((u) => u.isGM && u.active);
      const chatData = {
        type: 4,
        user: getGame().user,
        speaker: { alias: 'Mount Up' },
        content: `Get off ${targ.name}!`,
        whisper: [userGMToWhisper.id, getGame().user],
      };
      //@ts-ignore
      ChatMessage.create({}, chatData);
    }
  }
};

export const detachAllFromToken = async function (mountToken: Token) {
  // tokenAttacher.detachAllElementsFromToken(mountToken, true);
  await window['tokenAttacher'].detachAllElementsFromToken(mountToken, true);
  //@ts-ignore
  ui.chat.processMessage(`Everyone and everything get off!`);
  const userGMToWhisper = <User>getGame().users?.find((u) => u.isGM && u.active);
  const chatData = {
    type: 4,
    user: getGame().user,
    speaker: { alias: 'Mount Up' },
    content: `Everyone and everything get off!`,
    whisper: [userGMToWhisper.id, getGame().user],
  };
  //@ts-ignore
  ChatMessage.create({}, chatData);
};

export const moveToken = async function (riderToken: Token, mountToken: Token) {
  const riderTokens = [riderToken];
  moveTokens(riderTokens, mountToken);
};

export const moveTokens = async function (riderTokens: Token[], mountToken: Token) {
  // if (getGame().user?.isGM && <number>getCanvas().tokens?.controlled.length > 0) {
  if (getGame().user?.isGM && riderTokens.length > 0) {
    const pos = { x: mountToken.data.x, y: mountToken.data.y }; //riderToken.document.data.getLocalPosition(getCanvas().app?.stage);
    const mid = {
      x: riderTokens[0].data.x, //<number>getCanvas().tokens?.controlled[0].data.x,
      y: riderTokens[0].data.y, //<number>getCanvas().tokens?.controlled[0].data.y
    };
    // for (let i = 1; i < <number>getCanvas().tokens?.controlled.length; i++) {
    for (let i = 1; i < <number>riderTokens.length; i++) {
      mid.x += riderTokens[i].data.x; // <number>getCanvas().tokens?.controlled[i].data.x;
      mid.y += riderTokens[i].data.y; // <number>getCanvas().tokens?.controlled[i].data.y;
    }
    mid.x = mid.x / riderTokens.length; // (mid.x / <number>getCanvas().tokens?.controlled.length);
    mid.y = mid.y / riderTokens.length; // (mid.y / <number>getCanvas().tokens?.controlled.length);

    // const tokens = <string[]>getCanvas().tokens?.controlled.map(t => { return t.id; });
    const tokens = <string[]>riderTokens.map((t) => {
      return t.id;
    });
    const updates: any[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const t = <Token>getCanvas().tokens?.get(tokens[i]);
      const offsetx = mid.x - t.data.x;
      const offsety = mid.y - t.data.y;
      const gridPt = <PointArray>getCanvas().grid?.grid?.getGridPositionFromPixels(pos.x - offsetx, pos.y - offsety);
      const px = <PointArray>getCanvas().grid?.grid?.getPixelsFromGridPosition(gridPt[0], gridPt[1]);

      //t.update({ x: px[0], y: px[1] }, { animate: false });
      updates.push({ _id: t.id, x: px[0], y: px[1] });
    }
    if (updates.length) {
      //@ts-ignore
      getCanvas().scene?.updateEmbeddedEntity('Token', updates, { animate: false });
      //getCanvas().scene?.updateEmbeddedDocuments('TokenDocument', updates, { animate: false })
    }
  }
};
