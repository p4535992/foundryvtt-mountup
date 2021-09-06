import { warn } from "../foundryvtt-mountup.js";
import { MOUNT_UP_MODULE_NAME } from "./settings.js";
import { dismount, dropRider, mount } from './macros.js';
import { MountHud } from './mountHud.js';
import { MountManager } from './mountManager.js';
export const readyHooks = async () => {
    // Settings.registerSettings();
    window[MOUNT_UP_MODULE_NAME] = {
        mount: mount,
        dismount: dismount,
        dropRider: dropRider,
    };
    // FOR RETROCOMPATIBILITY
    window['MountUp'] = {
        mount: mount,
        dismount: dismount,
        dropRider: dropRider,
    };
};
export const initHooks = () => {
    warn('Init Hooks processing');
    // setup all the hooks
    Hooks.on('renderTokenHUD', (app, html, data) => {
        MountHud.renderMountHud(app, html, data);
    });
    Hooks.on('preUpdateToken', async (scene, token, updateData) => {
        if (updateData.x || updateData.y || updateData.rotation) {
            //await findTokenById(token._id).setFlag(FlagScope, Flags.MountMove, true);
            // NO NEED ANYMORE TOKEN ATTACHER DO THE WORK
            // await MountManager.doTokenUpdate(token._id, updateData);
            await MountManager.doTokenUpdateOnlyCheckBoundHandler(token.document.id, updateData);
            if (MountManager.isaRider(token.document.id)) {
                await MountManager.doPostTokenUpdate(token.document.id, updateData);
            }
        }
    });
    // REMOVED ?????
    Hooks.on('canvasReady', async () => {
        MountManager.popAllRiders();
    });
    Hooks.on('updateToken', async (scene, token, updateData) => {
        if (updateData.x || updateData.y || updateData.rotation) {
            if (MountManager.isaMount(updateData._id)) {
                MountManager.popRider(updateData._id);
            }
            if (MountManager.isaRider(updateData._id)) {
                await MountManager.doPostTokenUpdate(updateData._id, updateData);
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
};
