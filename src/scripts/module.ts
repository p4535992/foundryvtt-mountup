import API from "./api";
import { MountHud } from "./mountHud";
import { MountManager } from "./mountManager";
import type { TokenData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs";
import CONSTANTS from "./constants";
import { debug, getElevationToken, warn } from "./lib/lib";
import HOOKS from "./hooks";
import { EffectInterfaceApi } from "./effects/effect-interface-api";
import { MountupEffectDefinitions } from "./mountup-effect-definition";
import { findTokenById, MountUpFlags } from "./utils";
import { setApi } from "../mountup";
import type { ActiveEffectManagerLibApi } from "./effects/effect-api";

export let aemlApi: ActiveEffectManagerLibApi;

export const initHooks = () => {
	warn("Init Hooks processing");

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

	// //@ts-ignore
	// window[CONSTANTS.MODULE_NAME] = {
	//   API,
	//   mount: API.mount,
	//   dismount: API.dismount,
	//   dropRider: API.dropRider,
	//   toggleMount: API.toggleMount,
	// };

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
	aemlApi = <ActiveEffectManagerLibApi>game.modules.get("active-effect-manager-lib").api;
	aemlApi.effectInterface.initialize(CONSTANTS.MODULE_NAME);

	//@ts-ignore
	window.MountUp.API.effectInterface = aemlApi.effectInterface;

	// // setup all the hooks
	// API.effectInterface = new EffectInterface(CONSTANTS.MODULE_NAME) as unknown as typeof EffectInterface;
	// //@ts-ignore
	// API.effectInterface.initialize();

	//@ts-ignore
	// window.MountUp.API.effectInterface = new EffectInterface(CONSTANTS.MODULE_NAME);
	// //@ts-ignore
	// window.MountUp.API.effectInterface.initialize();

	//@ts-ignore
	setApi(window.MountUp.API);
};

export const readyHooks = async () => {
	Hooks.on("renderTokenHUD", (app, html, data) => {
		if (!app?.object?.document) {
			return;
		}
		const isPlayerOwned = <boolean>app?.object.document.isOwner;
		if (!game.user?.isGM && !isPlayerOwned) {
			return;
		}
		MountHud.renderMountHud(app, html, data);
	});

	// TOKEN ATTAHCER IS DOING THE WORK NOW
	/*
  Hooks.on('preUpdateToken', async (tokenDocument: TokenDocument, data:any, updateData: TokenData) => {
    const isPlayerOwned = <boolean>tokenDocument.isOwner;
    if (!game.user?.isGM && !isPlayerOwned) {
      return;
    }
    if (updateData.x || updateData.y || updateData.rotation) {
      //await findTokenById(token._id).actor.setFlag(FlagScope, Flags.MountMove, true);

      // NO NEED ANYMORE TOKEN ATTACHER DO THE WORK
      // await MountManager.doTokenUpdate(token._id, updateData);

      await MountManager.doTokenUpdateOnlyCheckBoundHandler(tokenDocument.id, updateData);
      if (MountManager.isaRider(tokenDocument.id)) {
        await MountManager.doPostTokenUpdate(<string>tokenDocument.id, updateData);
      }
    }
  });
  */
	// REMOVED ?????

	// Hooks.on('canvasReady', async () => {
	//   MountManager.popAllRiders();
	// });

	Hooks.on("updateToken", async (tokenDocument: TokenDocument, updateData: any, options: any, userId: string) => {
		const sourceToken = <Token>tokenDocument.object;
		if (!sourceToken) {
			return;
		}
		const isPlayerOwned = <boolean>tokenDocument.isOwner;
		if (!game.user?.isGM && !isPlayerOwned) {
			return;
		}
		// if(!updateData.actor?.data?.flags[CONSTANTS.MODULE_NAME]){
		//   return;
		// }
		if (updateData.x || updateData.y || updateData.rotation) {
			if (MountManager.isaMount(<string>updateData._id)) {
				MountManager.popRider(<string>updateData._id);
			}
			if (MountManager.isaRider(updateData._id)) {
				await MountManager.doPostTokenUpdate(<string>updateData._id, updateData);
			}
		}

		if (game.settings.get(CONSTANTS.MODULE_NAME, "enableAutoUpdateElevation")) {
			if (
				hasProperty(updateData, "elevation") &&
				((sourceToken.actor?.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.OrigElevation) !== undefined &&
					sourceToken.actor?.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.OrigElevation) !== null) ||
					// TODO to remove
					(sourceToken.document.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.OrigElevation) !== undefined &&
						sourceToken.document.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.OrigElevation) !== null))
			) {
				if (MountManager.isaMount(<string>updateData._id)) {
					const mountElevation = getElevationToken(sourceToken) || updateData.elevation;
					const riders: string[] =
						<string[]>sourceToken.actor?.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.Riders) ||
						// TODO to remove
						<string[]>sourceToken.document.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.Riders);
					for (const rider of riders) {
						const riderToken = <Token>findTokenById(<string>rider);
						if (riderToken) {
							const riderElevation = getElevationToken(riderToken);
							if (riderElevation !== mountElevation) {
								await riderToken.document.update({
									elevation: mountElevation,
								});
							}
						}
					}
				}

				if (MountManager.isaRider(updateData._id)) {
					const mountTokenId =
						<string>sourceToken.actor?.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.Mount) ||
						// TODO to remove
						<string>tokenDocument.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.Mount);
					const mountToken = <Token>findTokenById(mountTokenId);
					if (mountToken) {
						const mountElevation = getElevationToken(mountToken);
						const riderElevation = getElevationToken(<Token>tokenDocument.object) || updateData.elevation;
						if (riderElevation !== mountElevation) {
							warn(
								`You can't update elevation of rider ${tokenDocument?.name} until you are mounted on ${mountToken?.name}`,
								false
							);
							//updateData.elevation = mountElevation;
							await tokenDocument.update({
								elevation:
									<number>(
										sourceToken.actor?.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.OrigElevation)
									) ||
									// TODO to remove
									<number>tokenDocument.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.OrigElevation) ||
									mountElevation,
							});
						}
					}
				}
			}
		}
	});

	Hooks.on("controlToken", async (token: Token) => {
		const isPlayerOwned = <boolean>token.document.isOwner;
		if (!game.user?.isGM && !isPlayerOwned) {
			return;
		}
		if (MountManager.isaMount(token.id)) {
			await MountManager.popRider(token.id);
		}
	});

	Hooks.on("preDeleteToken", async (tokenDocument: TokenDocument, data: any, updateData: TokenData) => {
		const isPlayerOwned = <boolean>tokenDocument.isOwner;
		if (!game.user?.isGM && !isPlayerOwned) {
			return;
		}
		await MountManager.handleTokenDelete(<string>tokenDocument.id);
		//return true;
	});

	//@ts-ignore
	if (game.modules.get("tokenmagic")?.active && window.TokenMagic) {
		const params = MountupEffectDefinitions.tokenMagicParamsFlying(CONSTANTS.TM_FLYING);
		//@ts-ignore
		if (!TokenMagic.getPreset(CONSTANTS.TM_FLYING)) {
			//@ts-ignore
			TokenMagic.addPreset(CONSTANTS.TM_FLYING, params);
		}
	}
};
