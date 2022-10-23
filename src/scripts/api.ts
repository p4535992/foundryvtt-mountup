import CONSTANTS from "./constants";
import type Effect from "./effects/effect";
import { error, getElevationToken, i18n, info, isStringEquals, warn } from "./lib/lib";
import { MountManager } from "./mountManager";
import { MountupEffectDefinitions } from "./mountup-effect-definition";
import { findTokenById, findTokenByName, MountUpFlags } from "./utils";

const API = {
	// effectInterface: <EffectInterfaceApi>{},

	/**
	 * Macro function to mount a rider token onto a mount token
	 * @param {string} riderNameOrId - The name or the ID of the rider token
	 * @param {string} mountNameOrId - The name or the ID of the mount token
	 */
	mount(riderNameOrId: string, mountNameOrId: string) {
		const rider: Token = findTokenById(riderNameOrId) || findTokenByName(riderNameOrId);
		const mount: Token = findTokenById(mountNameOrId) || findTokenByName(mountNameOrId);
		if (!rider) {
			warn(`No rider with reference '${riderNameOrId}' is been found`, true);
			return;
		}
		if (!mount) {
			warn(`No mount with reference '${mountNameOrId}' is been found`, true);
			return;
		}

		const mountName = mount.name;
		const riderName = rider.name;

		if (rider) {
			if (mount) {
				if (rider.id !== mount.id) {
					MountManager.doCreateMount(rider, mount);
				} else {
					error("You cannot mount a token to itself");
				}
			} else {
				error(`A token could not be found with the name or id : ${mountName}`);
			}
		} else {
			error(`A token could not be found with the name or id : ${riderName}`);
		}
	},

	/**
	 * Macro function to dismount a rider token from its mount
	 * @param {string} riderNameOrId - The name or the ID of the rider token
	 */
	dismount(riderNameOrId: string) {
		const rider: Token = findTokenById(riderNameOrId) || findTokenByName(riderNameOrId);
		if (!rider) {
			warn(`No rider with reference '${riderNameOrId}' is been found`, true);
			return;
		}
		const riderName: string = rider.name;

		if (rider) {
			if (MountManager.isaRider(rider.id)) {
				const mountTokenId =
					<string>rider.actor?.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.Mount)
				const mountToken = findTokenById(mountTokenId);
				if (!mountToken) {
					warn(`No mount with reference '${mountTokenId}' is been found`, true);
					return;
				}
				MountManager.doRemoveMount(rider, mountToken);
			} else {
				error(`Token '${riderName}' is not a rider`);
			}
		} else {
			error(`A token could not be found with the name or id : ${riderName}`);
		}
	},

	/**
	 * Macro function to have a mount drop its rider
	 * @param {string} mountNameOrId - The name or the ID of the mount token
	 */
	dropRider(mountNameOrId: string) {
		const mount: Token = findTokenById(mountNameOrId) || findTokenByName(mountNameOrId);
		if (!mount) {
			warn(`No mount with reference '${mountNameOrId}' is been found`, true);
			return;
		}
		const mountName: string = mount.name;

		if (mount) {
			if (MountManager.isaMount(mount.id)) {
				const riders =
					<string[]>mount.actor?.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.Riders);
				for (const rider in riders) {
					const riderToken: Token = findTokenById(rider);
					if (!riderToken) {
						warn(`No rider with reference '${rider}' is been found`, true);
						return;
					}
					MountManager.doRemoveMount(riderToken, mount);
				}
			} else {
				error(`Token '${mountName}' is not a mount`);
			}
		} else {
			error(`A token could not be found with the name or id : ${mountName}`);
		}
	},

	/**
	 * Macro function to toggle a rider mount pair
	 * @param {string} riderNameOrId - The name or the ID of the rider
	 * @param {string} mountNameOrId - The name or the ID of the mount
	 */
	toggleMount(riderNameOrId: string, mountNameOrId: string) {
		const riderToken = findTokenById(riderNameOrId) || findTokenByName(riderNameOrId);
		const mountToken = findTokenById(mountNameOrId) || findTokenByName(mountNameOrId);
		if (!riderToken) {
			warn(`No rider with reference '${riderNameOrId}' is been found`, true);
			return;
		}
		if (!mountToken) {
			warn(`No mount with reference '${mountNameOrId}' is been found`, true);
			return;
		}

		if (
			riderToken.actor?.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.Mount) === mountToken.id
		) {
			API.dismount(riderNameOrId);
		} else {
			API.mount(riderNameOrId, mountNameOrId);
		}
	},

	// =======================================================================================

	async applyFlying(token: Token) {
		if (game.modules.get("tokenmagic")?.active) {
			if (!token) {
				token = <Token>canvas?.tokens?.controlled[0];
			}
			const elevation = getElevationToken(token);
			// const filter = elevation > 5 ? true : false;
			const tokenMagicEffectId = CONSTANTS.TM_FLYING;
			const params = MountupEffectDefinitions.tokenMagicParamsFlying(tokenMagicEffectId, elevation);
			//@ts-ignore
			await TokenMagic.addUpdateFilters(token, params);
			//@ts-ignore
			// await tokenInstance.TMFXdeleteFilters(tokenMagicEffectId);
			// if (filter) {
			//  //@ts-ignore
			//  await TokenMagic.addUpdateFilters(tokenInstance, params);
			// }
		}
	},

	async removeFlying(token: Token) {
		if (game.modules.get("tokenmagic")?.active) {
			if (!token) {
				token = <Token>canvas?.tokens?.controlled[0];
			}
			//@ts-ignore
			await TokenMagic.deleteFilters(token, CONSTANTS.TM_FLYING);
		}
	},

	async cleanUpTokenSelected() {
		const tokens = <Token[]>canvas.tokens?.controlled;
		if (!tokens || tokens.length === 0) {
			warn(`No tokens are selected`, true);
			return;
		}
		for (const token of tokens) {
			if (token && token.document) {
				if (getProperty(token.document, `data.flags.${CONSTANTS.MODULE_NAME}`)) {
					const p = getProperty(token.document, `data.flags.${CONSTANTS.MODULE_NAME}`);
					for (const key in p) {
						const senseOrConditionIdKey = key;
						const senseOrConditionValue = <any>p[key];
						await token.actor?.unsetFlag(CONSTANTS.MODULE_NAME, senseOrConditionIdKey);
					}
					const attached = token.document.getFlag("token-attacher", `attached`);
					if (attached) {
						await window["tokenAttacher"].detachAllElementsFromToken(token, true);
					}
					info(`Cleaned up token '${token.name}'`, true);
				}
			} else {
				warn(`No token found on the canvas for id '${token.id}'`, true);
			}
		}
		for (const token of tokens) {
			if (token && token.actor) {
				if (getProperty(token.actor, `data.flags.${CONSTANTS.MODULE_NAME}`)) {
					const p = getProperty(token.actor, `data.flags.${CONSTANTS.MODULE_NAME}`);
					for (const key in p) {
						const senseOrConditionIdKey = key;
						const senseOrConditionValue = <any>p[key];
						await token.actor.unsetFlag(CONSTANTS.MODULE_NAME, senseOrConditionIdKey);
					}
					info(`Cleaned up actor '${token.name}'`, true);
				}
			} else {
				warn(`No token found on the canvas for id '${token.id}'`, true);
			}
		}
	},

	async cleanUpToken(token: Token) {
		if (token && token.document) {
			if (getProperty(token.document, `data.flags.${CONSTANTS.MODULE_NAME}`)) {
				const p = getProperty(token.document, `data.flags.${CONSTANTS.MODULE_NAME}`);
				for (const key in p) {
					const senseOrConditionIdKey = key;
					const senseOrConditionValue = <any>p[key];
					await token.actor?.unsetFlag(CONSTANTS.MODULE_NAME, senseOrConditionIdKey);
				}
				const attached = token.document.getFlag("token-attacher", `attached`);
				if (attached) {
					await window["tokenAttacher"].detachAllElementsFromToken(token, true);
				}
				info(`Cleaned up token '${token.name}'`, true);
			}
		} else {
			warn(`No token found on the canvas for id '${token.id}'`, true);
		}

		if (token && token.actor) {
			if (getProperty(token.actor, `data.flags.${CONSTANTS.MODULE_NAME}`)) {
				const p = getProperty(token.actor, `data.flags.${CONSTANTS.MODULE_NAME}`);
				for (const key in p) {
					const senseOrConditionIdKey = key;
					const senseOrConditionValue = <any>p[key];
					await token.actor.unsetFlag(CONSTANTS.MODULE_NAME, senseOrConditionIdKey);
				}
				info(`Cleaned up actor '${token.name}'`, true);
			}
		} else {
			warn(`No token found on the canvas for id '${token.id}'`, true);
		}
	},

	async cleanUpTokenDialog(token: Token) {
		if (!token) {
			warn(`No tokens are selected`, true);
			return;
		}
		new Dialog({
			title: i18n(`${CONSTANTS.MODULE_NAME}.dialogCleanUp.title`),
			content: `
      <form>
        <div class="form-group">
          <label>${i18n(`${CONSTANTS.MODULE_NAME}.dialogCleanUp.message`)}</label>
        </div>
      </form>
      `,
			buttons: {
				yes: {
					icon: "<i class='fas fa-check'></i>",
					label: i18n(`${CONSTANTS.MODULE_NAME}.dialogCleanUp.yes`),
					callback: async (ev) => {
						this.cleanUpToken(token);
					},
				},
				no: {
					icon: "<i class='fas fa-times'></i>",
					label: i18n(`${CONSTANTS.MODULE_NAME}.dialogCleanUp.no`),
				},
			},
			default: "no",
			close: (html) => {
				// DO NOTHING
			},
		}).render(true);
	},
};

export default API;
