import API from './api';
import { MountHud } from './mountHud';
import { MountManager } from './mountManager';
import { TokenData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import { canvas, game } from './settings';
import CONSTANTS from './constants';
import { debug, warn } from './lib/lib';
import HOOKS from './hooks';
import EffectInterface from './effects/effect-interface';
import { MountupEffectDefinitions } from './mountup-effect-definition';

export const initHooks = () => {
  warn('Init Hooks processing');

  // if (game.settings.get(CONSTANTS.MODULE_NAME, 'debugHooks')) {
  //   for (const hook of Object.values(HOOKS)) {
  //     if (typeof hook === 'string') {
  //       Hooks.on(hook, (...args) => debug(`Hook called: ${hook}`, ...args));
  //       debug(`Registered hook: ${hook}`);
  //     } else {
  //       for (const innerHook of Object.values(hook)) {
  //         Hooks.on(<string>innerHook, (...args) => debug(`Hook called: ${innerHook}`, ...args));
  //         debug(`Registered hook: ${innerHook}`);
  //       }
  //     }
  //   }
  // }

  //@ts-ignore
  window[CONSTANTS.MODULE_NAME] = {
    API,
    mount: API.mount,
    dismount: API.dismount,
    dropRider: API.dropRider,
    toggleMount: API.toggleMount,
  };

  // FOR RETROCOMPATIBILITY
  //@ts-ignore
  window.MountUp = {
    API,
    mount: API.mount,
    dismount: API.dismount,
    dropRider: API.dropRider,
    toggleMount: API.toggleMount,
  };
};

export const setupHooks = async (): Promise<void> => {
  // setup all the hooks

  //@ts-ignore
  window.MountUp.API.effectInterface = new EffectInterface(CONSTANTS.MODULE_NAME);
  //@ts-ignore
  window.MountUp.API.effectInterface.initialize();
  //@ts-ignore
  window[CONSTANTS.MODULE_NAME].API.effectInterface = new EffectInterface(CONSTANTS.MODULE_NAME);
  //@ts-ignore
  window[CONSTANTS.MODULE_NAME].API.effectInterface.initialize();

  if (game[CONSTANTS.MODULE_NAME]) {
    game[CONSTANTS.MODULE_NAME] = {};
  }
  if (game[CONSTANTS.MODULE_NAME].API) {
    game[CONSTANTS.MODULE_NAME].API = {};
  }
  //@ts-ignore
  game[CONSTANTS.MODULE_NAME].API = window.MountUp.API;
};

export const readyHooks = async () => {
  Hooks.on('renderTokenHUD', (app, html, data) => {
    MountHud.renderMountHud(app, html, data);
  });

  Hooks.on('preUpdateToken', async (scene: Scene, token: Token, updateData: TokenData) => {
    if (updateData.x || updateData.y || updateData.rotation) {
      //await findTokenById(token._id).document.setFlag(FlagScope, Flags.MountMove, true);

      // NO NEED ANYMORE TOKEN ATTACHER DO THE WORK
      // await MountManager.doTokenUpdate(token._id, updateData);

      await MountManager.doTokenUpdateOnlyCheckBoundHandler(token.document.id, updateData);
      if (MountManager.isaRider(token.document.id)) {
        await MountManager.doPostTokenUpdate(<string>token.document.id, updateData);
      }
    }
  });

  // REMOVED ?????

  Hooks.on('canvasReady', async () => {
    MountManager.popAllRiders();
  });

  Hooks.on('updateToken', async (scene: Scene, token: Token, updateData: TokenData) => {
    if (updateData.x || updateData.y || updateData.rotation) {
      if (MountManager.isaMount(<string>updateData._id)) {
        MountManager.popRider(<string>updateData._id);
      }
      if (MountManager.isaRider(updateData._id)) {
        await MountManager.doPostTokenUpdate(<string>updateData._id, updateData);
      }
    }
  });

  Hooks.on('controlToken', async (token) => {
    if (MountManager.isaMount(token.id)) {
      await MountManager.popRider(token.id);
    }
  });

  Hooks.on('preDeleteToken', async (scene, token) => {
    await MountManager.handleTokenDelete(token._id);
    //return true;
  });

  if (game.modules.get('tokenmagic')?.active) {
    const params = MountupEffectDefinitions.tokenMagicParamsFlying(CONSTANTS.TM_FLYING);
    //@ts-ignore
    TokenMagic.addPreset(CONSTANTS.TM_FLYING, params);
  }
};
