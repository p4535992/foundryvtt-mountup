import { MOUNT_UP_MODULE_NAME } from './settings';
import { MountHud } from './mountHud';
import { MountManager } from './mountManager';
import { TokenData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import { warn } from '../foundryvtt-mountup';
import { game } from './settings';

let mountManager:MountManager;
let mountHud:MountHud;

export const readyHooks = async () => {
  // Settings.registerSettings();

  window[MOUNT_UP_MODULE_NAME] = {
    mount: mountManager.mountMacro,
    dismount: mountManager.dismountMacro,
    dropRider: mountManager.dropRiderMacro,
  };

  // FOR RETROCOMPATIBILITY

  window['MountUp'] = {
    mount: mountManager.mountMacro,
    dismount: mountManager.dismountMacro,
    dropRider: mountManager.dropRiderMacro,
  };
};

export const initHooks = () => {
  warn('Init Hooks processing');

  mountManager = new MountManager();
  mountHud = new MountHud(mountManager);

  // setup all the hooks
  Hooks.on('renderTokenHUD', (app, html, data) => {
    mountHud.renderMountHud(app, html, data);
  });

  Hooks.on('preUpdateToken', async (scene: Scene, token: Token, updateData: TokenData) => {
    if (updateData.x || updateData.y || updateData.rotation) {
      //await findTokenById(token._id).document.setFlag(FlagScope, Flags.MountMove, true);

      // NO NEED ANYMORE TOKEN ATTACHER DO THE WORK
      // await MountManager.doTokenUpdate(token._id, updateData);

      await mountManager.doTokenUpdateOnlyCheckBoundHandler(token.document.id, updateData);
      if (mountManager.isaRider(token.document.id)) {
        await mountManager.doPostTokenUpdate(<string>token.document.id, updateData);
      }
    }
  });

  // REMOVED ?????

  Hooks.on('canvasReady', async () => {
    mountManager.popAllRiders();
  });

  Hooks.on('updateToken', async (scene: Scene, token: Token, updateData: TokenData) => {
    if (updateData.x || updateData.y || updateData.rotation) {
      if (mountManager.isaMount(<string>updateData._id)) {
        mountManager.popRider(<string>updateData._id);
      }
      if (mountManager.isaRider(updateData._id)) {
        await mountManager.doPostTokenUpdate(<string>updateData._id, updateData);
      }
    }
  });

  Hooks.on('controlToken', async (token) => {
    if (mountManager.isaMount(token.id)) {
      await mountManager.popRider(token.id);
    }
  });

  Hooks.on('preDeleteToken', async (scene, token) => {
    await mountManager.handleTokenDelete(token._id);
    //return true;
  });
};
