import CONSTANTS from "./constants";
import Effect, { Constants } from "./effects/effect";
import { debug, i18n, i18nFormat, isStringEquals, warn } from "./lib/lib";

/**
 * Defines all of the effect definitions
 */
export class MountupEffectDefinitions {
	constructor() {}

	/**
	 * Get all effects
	 *
	 * @returns {Effect[]} all the effects
	 */
	static all(distance = 0, visionLevel = 0): Effect[] {
		const effects: Effect[] = [];

		// EffectDefinitions.shadowEffect(distance),

		// SENSES
		const blinded = MountupEffectDefinitions.flying();
		if (blinded) {
			effects.push(blinded);
		}
		return effects;
	}

	static async effect(nameOrCustomId: string, distance = 0, visionLevel = 0): Promise<Effect | undefined> {
		const effect = <Effect>MountupEffectDefinitions.all(distance, visionLevel).find((effect: Effect) => {
			return isStringEquals(effect.name, nameOrCustomId) || isStringEquals(effect.customId, nameOrCustomId);
		});
		if (!effect) {
			warn(`Not founded effect with name ${nameOrCustomId}`, true);
			return undefined;
		}
		return effect;
	}

	// ===========================================
	// The source effect
	// =============================================

	static flying(number?: number) {
		// const effectSight = API.SENSES.find((a: SenseData) => {
		//   return isStringEquals(a.id, AtcvEffectSenseFlags.DARKVISION);
		// });
		// if (!effectSight) {
		//   debug(
		//     `Cannot find for system '${game.system.id}' the active effect with id '${AtcvEffectSenseFlags.DARKVISION}'`,
		//   );
		//   return;
		// }
		return new Effect({
			customId: "flying",
			name:
				number && number > 0
					? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.flying.name2`, { number: number })
					: i18n(`${CONSTANTS.MODULE_NAME}.effects.flying.name`),
			description:
				number && number > 0
					? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.flying.description2`, { number: number })
					: i18n(`${CONSTANTS.MODULE_NAME}.effects.flying.description`),
			icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/flying.jpg`,
			// seconds: Constants.SECONDS.IN_EIGHT_HOURS,
			transfer: true,
			changes: [
				{
					key: "ATMU.flying",
					mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
					value: number && number > 0 ? `${number}` : `document.elevation`,
					priority: 5,
				},
			],
			tokenMagicChanges: [
				{
					key: "macro.tokenMagic",
					mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
					value: CONSTANTS.TM_FLYING, // 'bloom',
					priority: 5,
				},
			],
			isTemporary: false,
		});
	}

	static isamount() {
		return new Effect({
			customId: "isamount",
			name: i18n(`${CONSTANTS.MODULE_NAME}.effects.isamount.name`),
			description: i18n(`${CONSTANTS.MODULE_NAME}.effects.isamount.description`),
			icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/flying.jpg`,
			// seconds: Constants.SECONDS.IN_EIGHT_HOURS,
			transfer: true,
			changes: [],
			isTemporary: false,
		});
	}

	// ===========================================
	// Utility Effect
	// =============================================

	// =======================
	// TOKEN MAGIC EFFECT
	// =======================

	/**
	 * This also includes automatic shadow creation for token elevation.
	 * This section requires Token Magic Fx to function.
	 * Changing the elevation of a token over 5ft will automatically set a shadow effect "below" the token,
	 * this is change in distance based on the elevation value.
	 * @param tokenInstance
	 * @param elevation
	 */
	static tokenMagicParamsFlying(tokenMagicEffectId: string, elevation = 0): any {
		//const elevation: number = getProperty(tokenInstance, 'elevation');
		// const elevation: number = getElevationToken(tokenInstance);
		//const tokenInstance = canvas.tokens?.get(tokenID);
		//const tokenMagicEffectId = CONSTANTS.TM_FLYING;
		const twist = {
			filterType: "transform",
			filterId: tokenMagicEffectId,
			twRadiusPercent: 100,
			padding: 10,
			animated: {
				twRotation: {
					animType: "sinOscillation",
					val1: -(elevation / 10),
					val2: +(elevation / 10),
					loopDuration: 5000,
				},
			},
		};
		const shadow = {
			filterType: "shadow",
			filterId: tokenMagicEffectId,
			rotation: 35,
			blur: 2,
			quality: 5,
			distance: elevation * 1.5,
			alpha: Math.min(1 / ((elevation - 10) / 10), 0.7),
			padding: 10,
			shadowOnly: false,
			color: 0x000000,
			zOrder: 6000,
			animated: {
				blur: {
					active: true,
					loopDuration: 5000,
					animType: "syncCosOscillation",
					val1: 2,
					val2: 2.5,
				},
				rotation: {
					active: true,
					loopDuration: 5000,
					animType: "syncSinOscillation",
					val1: 33,
					val2: 33 + elevation * 0.8,
				},
			},
		};
		////const shadowSetting = game.settings.get(CONSTANTS.MODULE_NAME, 'shadows');
		//// let params = [shadow];
		////if (shadowSetting === 'bulge'){
		//// params = [shadow, twist];
		////}
		const params = [shadow, twist];
		return params;
	}
}
