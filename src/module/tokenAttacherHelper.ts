import CONSTANTS from './constants';
import { getElevationToken, manageAEOnDismountUp, manageAEOnMountUp } from './lib/lib';
import { MountManager } from './mountManager';
import { canvas, game } from './settings';
import { SettingsForm } from './settings-form';
import { MountUpFlags } from './utils';

export const mountUp = async function (riderToken: Token, mountToken: Token) {
  if (!riderToken || !mountToken) {
    return;
  }
  const targets = [mountToken]; // Array.from(game.user.targets);
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

    // shrink the rider if needed
    const grid = <number>canvas.scene?.data.grid;
    let newWidthRider = riderToken.w;
    let newHeightRider = riderToken.h;
    let newWidthRiderSize = riderToken.document.data.width;
    let newHeightRiderSize = riderToken.document.data.height;
    if (riderToken.w >= mountToken.w || riderToken.h >= mountToken.h) {
      newWidthRider = mountToken.w / grid / 2;
      newHeightRider = mountToken.h / grid / 2;
      newWidthRiderSize = mountToken.document.data.width / 2;
      newHeightRiderSize = mountToken.document.data.height / 2;
    }

    await riderToken.document.update({
      x: newRiderCoords.x,
      y: newRiderCoords.y,
      width: newWidthRiderSize,
      height: newHeightRiderSize,
    });

    // riderToken.zIndex = mountToken.zIndex + 10;

    // const loc: { x; y } = {
    //   x: newRiderCoords.x,
    //   y: newRiderCoords.y,
    // }

    // riderToken.document.data.x = newRiderCoords.x;
    // riderToken.document.data.y = newRiderCoords.y;
    // riderToken.document.data.height = newHeightRiderSize;
    // riderToken.document.data.width = newWidthRiderSize;

    const loc: { x; y } = MountManager.getRiderInitialLocation(riderToken, mountToken);
    if (game.settings.get(CONSTANTS.MODULE_NAME, 'enableAutoUpdateElevation')) {
      const mountElevation = getElevationToken(mountToken) || 0;
      const backupRiderElevation = getElevationToken(riderToken) || 0;
      await riderToken.document.setFlag(CONSTANTS.MODULE_NAME, MountUpFlags.OrigElevation, backupRiderElevation);
      await riderToken.document.update({
        x: loc.x,
        y: loc.y,
        elevation: mountElevation,
      });
    } else {
      await riderToken.document.update({
        x: loc.x,
        y: loc.y,
      });
    }

    let message = <string>game.settings.get(CONSTANTS.MODULE_NAME, 'mount-message')
      ? <string>game.settings.get(CONSTANTS.MODULE_NAME, 'mount-message')
      : `I mount this ${targets[0].name}`;
    message = message.replace('{rider}', riderToken.name);
    message = message.replace('{mount}', targets[0].name);

    const icon = `<span class="fa-stack">
        <i class="fas ${SettingsForm.getIconClass()} fa-stack-1x"></i>
      </span>&nbsp;`;
    message = icon + message;

    //@ts-ignore
    //ui.chat.processMessage(message);
    const userGMToWhisper = <User>game.users?.find((u) => u.isGM && u.active);
    const chatData = {
      type: 4,
      user: <User>game.user,
      speaker: { alias: 'Mount Up' },
      content: message,
      whisper: [userGMToWhisper.id, game.user],
    };
    //@ts-ignore
    ChatMessage.create(chatData);

    await window['tokenAttacher'].attachElementToToken(riderToken, targets[0], true);
    const isLocked = false;
    await window['tokenAttacher'].setElementsLockStatus(riderToken, isLocked, true);
    const canMoveConstrained = <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'enableCanMoveConstrained') || true;
    await window['tokenAttacher'].setElementsMoveConstrainedStatus(riderToken, canMoveConstrained, true);

    // Manage active effect
    if (game.settings.get(CONSTANTS.MODULE_NAME, 'enableActiveEffect')) {
      await manageAEOnMountUp(riderToken, mountToken);
    }
  }
};

export const dismountDropAll = async function (mountToken: Token) {
  if (!mountToken) {
    return;
  }

  await window['tokenAttacher'].detachAllElementsFromToken(mountToken, true);

  let message = `Everyone and everything get off from {mount}!`;
  // message = message.replace('{rider}',riderToken.name);
  message = message.replace('{mount}', mountToken.name);

  //@ts-ignore
  //ui.chat.processMessage(message);
  const userGMToWhisper = <User>game.users?.find((u) => u.isGM && u.active);
  const chatData = {
    type: 4,
    user: <User>game.user,
    speaker: { alias: 'Mount Up' },
    content: message,
    whisper: [userGMToWhisper.id, game.user],
  };
  //@ts-ignore
  ChatMessage.create(chatData);

  const riderTokens: string[] = <string[]>mountToken.document.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.Riders);
  for (const riderTokenS of riderTokens) {
    const riderToken = <Token>canvas.tokens?.placeables.find((rt) => {
      return rt.id === riderTokenS;
    });
    if (game.settings.get(CONSTANTS.MODULE_NAME, 'enableAutoUpdateElevation')) {
      const backupRiderElevation = <number>(
        riderToken.document.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.OrigElevation)
      );
      if (backupRiderElevation) {
        await riderToken.document.update({
          elevation: backupRiderElevation,
        });
        await riderToken.document.unsetFlag(CONSTANTS.MODULE_NAME, MountUpFlags.OrigElevation);
      }
    }
    // Manage active effect
    if (game.settings.get(CONSTANTS.MODULE_NAME, 'enableActiveEffect')) {
      await manageAEOnDismountUp(riderToken, mountToken);
    }
  }
};

export const dismountDropTarget = async function (mountToken: Token, riderToken: Token) {
  if (!mountToken || !riderToken) {
    return;
  }
  const targets = [riderToken]; // Array.from(game.user.targets);
  if (targets.length > 0) {
    if (targets.length > 1) {
      return ui.notifications?.error("Can't follow more then one token!");
    }

    await window['tokenAttacher'].detachElementsFromToken(targets, mountToken, true);
    //dismountDropAll(token);
    for (let i = 0; i < targets.length; i++) {
      const targ: Token = targets[i];

      let message = <string>game.settings.get(CONSTANTS.MODULE_NAME, 'dismount-message')
        ? <string>game.settings.get(CONSTANTS.MODULE_NAME, 'dismount-message')
        : `Get off ${targ.name}!`;
      message = message.replace('{rider}', targ.name);
      message = message.replace('{mount}', mountToken.name);

      const icon = `<span class="fa-stack" >
          <i class="fas ${SettingsForm.getIconClass()} fa-stack-1x"></i>
          <i class="fas fa-slash fa-stack-1x" style="color: tomato"></i>
        </span>&nbsp;`;
      message = icon + message;

      //@ts-ignore
      //ui.chat.processMessage(message);
      const userGMToWhisper = <User>game.users?.find((u) => u.isGM && u.active);
      const chatData = {
        type: 4,
        user: game.user,
        speaker: { alias: 'Mount Up' },
        content: message,
        whisper: [userGMToWhisper.id, game.user],
      };
      //@ts-ignore
      ChatMessage.create(chatData);
    }
    if (game.settings.get(CONSTANTS.MODULE_NAME, 'enableAutoUpdateElevation')) {
      const backupRiderElevation = <number>(
        riderToken.document.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.OrigElevation)
      );
      if (backupRiderElevation) {
        await riderToken.document.update({
          elevation: backupRiderElevation,
        });
        await riderToken.document.unsetFlag(CONSTANTS.MODULE_NAME, MountUpFlags.OrigElevation);
      }
    }
    // Manage active effect
    if (game.settings.get(CONSTANTS.MODULE_NAME, 'enableActiveEffect')) {
      await manageAEOnDismountUp(riderToken, mountToken);
    }
  }
};

export const detachAllFromToken = async function (mountToken: Token) {
  if (!mountToken) {
    return;
  }

  await window['tokenAttacher'].detachAllElementsFromToken(mountToken, true);

  // let message = `Everyone and everything get off from {mount}!`;
  // message = message.replace('{rider}',riderToken.name);
  // message = message.replace('{mount}', mountToken.name);
  // const userGMToWhisper = <User>game.users?.find((u) => u.isGM && u.active);
  // const chatData = {
  //   type: 4,
  //   user: game.user,
  //   speaker: { alias: 'Mount Up' },
  //   content: message,
  //   whisper: [userGMToWhisper.id, game.user],
  // };
  // ChatMessage.create(chatData);
};

export const moveToken = async function (riderToken: Token, mountToken: Token) {
  if (!riderToken || !mountToken) {
    return;
  }
  const riderTokens = [riderToken];
  moveTokens(riderTokens, mountToken);
};

export const moveTokens = async function (riderTokens: Token[], mountToken: Token) {
  if (!riderTokens || !mountToken) {
    return;
  }
  // if (game.user?.isGM && <number>canvas.tokens?.controlled.length > 0) {
  if (game.user?.isGM && riderTokens.length > 0) {
    const pos = { x: mountToken.data.x, y: mountToken.data.y }; //riderToken.document.data.getLocalPosition(canvas.app?.stage);
    const mid = {
      x: riderTokens[0].data.x, //<number>canvas.tokens?.controlled[0].data.x,
      y: riderTokens[0].data.y, //<number>canvas.tokens?.controlled[0].data.y
    };
    // for (let i = 1; i < <number>canvas.tokens?.controlled.length; i++) {
    for (let i = 1; i < <number>riderTokens.length; i++) {
      mid.x += riderTokens[i].data.x; // <number>canvas.tokens?.controlled[i].data.x;
      mid.y += riderTokens[i].data.y; // <number>canvas.tokens?.controlled[i].data.y;
    }
    mid.x = mid.x / riderTokens.length; // (mid.x / <number>canvas.tokens?.controlled.length);
    mid.y = mid.y / riderTokens.length; // (mid.y / <number>canvas.tokens?.controlled.length);

    // const tokens = <string[]>canvas.tokens?.controlled.map(t => { return t.id; });
    const tokens = <string[]>riderTokens.map((t) => {
      return t.id;
    });
    const updates: any[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const t = <Token>canvas.tokens?.get(tokens[i]);
      const offsetx = mid.x - t.data.x;
      const offsety = mid.y - t.data.y;
      const gridPt = <PointArray>canvas.grid?.grid?.getGridPositionFromPixels(pos.x - offsetx, pos.y - offsety);
      const px = <PointArray>canvas.grid?.grid?.getPixelsFromGridPosition(gridPt[0], gridPt[1]);

      //t.update({ x: px[0], y: px[1] }, { animate: false });
      updates.push({ _id: t.id, x: px[0], y: px[1] });
    }
    if (updates.length) {
      //@ts-ignore
      canvas.scene?.updateEmbeddedDocuments('TokenDocument', updates, { animate: false });
    }
  }
};
