//@ts-ignore
// import { tokenAttacher } from '../../token-attacher/scripts/token-attacher.js';

import { warn } from '../foundryvtt-mountup';
import { getGame } from './settings';
import { findTokenById, Flags } from './utils';

export const mountUp = async function (riderToken, mountToken) {
  const targets = [mountToken]; // Array.from(getGame().user.targets);
  if (targets.length > 0) {
    if (targets.length > 1) {
      return ui.notifications?.error("Can't mount more then one token!");
    }

    const mount = targets[0];
    const newCoords = {
      x: riderToken.x,
      y: riderToken.y,
    };
    if (mount.x + mount.w - riderToken.w < riderToken.x) {
      newCoords.x = mount.x + mount.w - riderToken.w;
    } else if (mount.x > riderToken.x) {
      newCoords.x = mount.x;
    }
    if (mount.y + mount.h - riderToken.h < riderToken.y) {
      newCoords.y = mount.y + mount.h - riderToken.h;
    } else if (mount.y > riderToken.y) {
      newCoords.y = mount.y;
    }
    await riderToken.update({
      x: newCoords.x,
      y: newCoords.y,
    });
    // ui.chat.processMessage(`I mount this ${targets[0].name}`);
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
  //ui.chat.processMessage(`Everyone and everything get off!`);
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

export const dismountDropTarget = async function (mountToken, target) {
  const targets = [target]; // Array.from(getGame().user.targets);
  if (targets.length > 0) {
    if (targets.length > 1) {
      return ui.notifications?.error("Can't follow more then one token!");
    }
    //await tokenAttacher.detachElementsFromToken(targets, token, true);
    await window['tokenAttacher'].detachElementsFromToken(targets, mountToken, true);
    //dismountDropAll(token);
    for (let i = 0; i < targets.length; i++) {
      const targ = targets[i];
      //ui.chat.processMessage(`Get off ${targ.name}!`);
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

export const detachAllFromToken = async function (mountToken) {
  // tokenAttacher.detachAllElementsFromToken(mountToken, true);
  await window['tokenAttacher'].detachAllElementsFromToken(mountToken, true);
  //ui.chat.processMessage(`Everyone and everything get off!`);
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
