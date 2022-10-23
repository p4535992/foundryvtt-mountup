import type EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs";
import type { ActorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import API from "../api";
import CONSTANTS from "../constants";
import type Effect from "../effects/effect";
import { aemlApi } from "../module";
import { MountupEffectDefinitions } from "../mountup-effect-definition";
import { ActiveTokenMountUpData } from "../utils";

// =============================
// Module Generic function
// =============================

export async function getToken(documentUuid) {
	const document = await fromUuid(documentUuid);
	//@ts-ignore
	return document?.token ?? document;
}

export function getOwnedTokens(priorityToControlledIfGM: boolean): Token[] {
	const gm = game.user?.isGM;
	if (gm) {
		if (priorityToControlledIfGM) {
			return <Token[]>canvas.tokens?.controlled;
		} else {
			return <Token[]>canvas.tokens?.placeables;
		}
	}
	let ownedTokens = <Token[]>(
		canvas.tokens?.placeables.filter((token) => token.isOwner && (!token.document.hidden || gm))
	);
	if (ownedTokens.length === 0 || !canvas.tokens?.controlled[0]) {
		ownedTokens = <Token[]>(
			canvas.tokens?.placeables.filter(
				(token) => (token.observer || token.isOwner) && (!token.document.hidden || gm)
			)
		);
	}
	return ownedTokens;
}

export function is_UUID(inId) {
	return typeof inId === "string" && (inId.match(/\./g) || []).length && !inId.endsWith(".");
}

export function getUuid(target) {
	// If it's an actor, get its TokenDocument
	// If it's a token, get its Document
	// If it's a TokenDocument, just use it
	// Otherwise fail
	const document = getDocument(target);
	return document?.uuid ?? false;
}

export function getDocument(target) {
	if (target instanceof foundry.abstract.Document) return target;
	return target?.document;
}

export function is_real_number(inNumber) {
	return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
}

export function isGMConnected() {
	return !!Array.from(<Users>game.users).find((user) => user.isGM && user.active);
}

export function isGMConnectedAndSocketLibEnable() {
	return isGMConnected() && !game.settings.get(CONSTANTS.MODULE_NAME, "doNotUseSocketLibFeature");
}

export function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isActiveGM(user) {
	return user.active && user.isGM;
}

export function getActiveGMs() {
	return game.users?.filter(isActiveGM);
}

export function isResponsibleGM() {
	if (!game.user?.isGM) return false;
	return !getActiveGMs()?.some((other) => other.id < <string>game.user?.id);
}

// ================================
// Logger utility
// ================================

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, args = "") {
	if (game.settings.get(CONSTANTS.MODULE_NAME, "debug")) {
		console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args);
	}
	return msg;
}

export function log(message) {
	message = `${CONSTANTS.MODULE_NAME} | ${message}`;
	console.log(message.replace("<br>", "\n"));
	return message;
}

export function notify(message) {
	message = `${CONSTANTS.MODULE_NAME} | ${message}`;
	ui.notifications?.notify(message);
	console.log(message.replace("<br>", "\n"));
	return message;
}

export function info(info, notify = false) {
	info = `${CONSTANTS.MODULE_NAME} | ${info}`;
	if (notify) ui.notifications?.info(info);
	console.log(info.replace("<br>", "\n"));
	return info;
}

export function warn(warning, notify = false) {
	warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
	if (notify) ui.notifications?.warn(warning);
	console.warn(warning.replace("<br>", "\n"));
	return warning;
}

export function error(error, notify = true) {
	error = `${CONSTANTS.MODULE_NAME} | ${error}`;
	if (notify) ui.notifications?.error(error);
	return new Error(error.replace("<br>", "\n"));
}

export function timelog(message): void {
	warn(Date.now(), message);
}

export const i18n = (key: string): string => {
	return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key: string, data = {}): string => {
	return game.i18n.format(key, data)?.trim();
};

// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
	return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_NAME}</strong>
        <br><br>${message}
    </p>`;
}

// =========================================================================================

export function cleanUpString(stringToCleanUp: string) {
	// regex expression to match all non-alphanumeric characters in string
	const regex = /[^A-Za-z0-9]/g;
	if (stringToCleanUp) {
		return i18n(stringToCleanUp).replace(regex, "").toLowerCase();
	} else {
		return stringToCleanUp;
	}
}

export function isStringEquals(stringToCheck1: string, stringToCheck2: string, startsWith = false): boolean {
	if (stringToCheck1 && stringToCheck2) {
		const s1 = cleanUpString(stringToCheck1) ?? "";
		const s2 = cleanUpString(stringToCheck2) ?? "";
		if (startsWith) {
			return s1.startsWith(s2) || s2.startsWith(s1);
		} else {
			return s1 === s2;
		}
	} else {
		return stringToCheck1 === stringToCheck2;
	}
}

/**
 * The duplicate function of foundry keep converting my stirng value to "0"
 * i don't know why this methos is a brute force solution for avoid that problem
 */
export function duplicateExtended(obj: any): any {
	try {
		//@ts-ignore
		if (structuredClone) {
			//@ts-ignore
			return structuredClone(obj);
		} else {
			// Shallow copy
			// const newObject = jQuery.extend({}, oldObject);
			// Deep copy
			// const newObject = jQuery.extend(true, {}, oldObject);
			return jQuery.extend(true, {}, obj);
		}
	} catch (e) {
		return duplicate(obj);
	}
}

// =========================================================================================

/**
 *
 * @param obj Little helper for loop enum element on typescript
 * @href https://www.petermorlion.com/iterating-a-typescript-enum/
 * @returns
 */
export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
	return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

/**
 * @href https://stackoverflow.com/questions/7146217/merge-2-arrays-of-objects
 * @param target
 * @param source
 * @param prop
 */
export function mergeByProperty(target: any[], source: any[], prop: any) {
	for (const sourceElement of source) {
		const targetElement = target.find((targetElement) => {
			return sourceElement[prop] === targetElement[prop];
		});
		targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
	}
	return target;
}

/**
 * Returns the first selected token
 */
export function getFirstPlayerTokenSelected(): Token | null {
	// Get first token ownted by the player
	const selectedTokens = <Token[]>canvas.tokens?.controlled;
	if (selectedTokens.length > 1) {
		//iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
		return null;
	}
	if (!selectedTokens || selectedTokens.length === 0) {
		//if(game.user.character.token){
		//  //@ts-ignore
		//  return game.user.character.token;
		//}else{
		return null;
		//}
	}
	return <Token>selectedTokens[0];
}

/**
 * Returns a list of selected (or owned, if no token is selected)
 * note: ex getSelectedOrOwnedToken
 */
export function getFirstPlayerToken(): Token | null {
	// Get controlled token
	let token: Token;
	const controlled: Token[] = <Token[]>canvas.tokens?.controlled;
	// Do nothing if multiple tokens are selected
	if (controlled.length && controlled.length > 1) {
		//iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
		return null;
	}
	// If exactly one token is selected, take that
	token = <Token>controlled[0];
	if (!token) {
		if (!controlled.length || controlled.length === 0) {
			// If no token is selected use the token of the users character
			token = <Token>canvas.tokens?.placeables.find((token) => token.id === game.user?.character?.id);
		}
		// If no token is selected use the first owned token of the users character you found
		if (!token) {
			token = <Token>canvas.tokens?.ownedTokens[0];
		}
	}
	return token;
}

export function getElevationToken(token: Token): number {
	const base = token.document;
	return getElevationPlaceableObject(base);
}

function getElevationWall(wall: Wall): number {
	const base = wall.document;
	return getElevationPlaceableObject(base);
}

function getElevationPlaceableObject(placeableObject: any): number {
	let base = placeableObject;
	if (base.document) {
		base = base.document;
	}
	const base_elevation =
		//@ts-ignore
		typeof _levels !== "undefined" &&
		//@ts-ignore
		_levels?.advancedLOS &&
		(placeableObject instanceof Token || placeableObject instanceof TokenDocument)
			? //@ts-ignore
			  _levels.getTokenLOSheight(placeableObject)
			: base.elevation ??
			  base.flags["levels"]?.elevation ??
			  base.flags["levels"]?.rangeBottom ??
			  base.flags["wallHeight"]?.wallHeightBottom ??
			  0;
	return base_elevation;
}

// =============================
// Module specific function
// =============================

export async function retrieveAtmuActiveEffectsFromToken(token: Token): Promise<ActiveTokenMountUpData> {
	const activeTokenMountUpData = new ActiveTokenMountUpData();
	const toMountOnMount = new Map<string, Effect>();
	const toMountOnDismount = new Map<string, Effect>();
	const toRiderOnMount = new Map<string, Effect>();
	const toRiderOnDismount = new Map<string, Effect>();
	const flyingMount = new Map<string, Effect>();

	const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>token.actor?.effects;
	// const atmuArr:ActiveEffect[] = [];
	for (const effectEntity of actorEffects) {
		//@ts-ignore
		const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.label;
		if (!effectNameToSet) {
			continue;
		}
		const atmuChanges = await aemlApi.retrieveChangesOrderedByPriorityFromAE(effectEntity);
		//atmuValue = effectEntity.changes.find((aee) => {
		for (const aee of atmuChanges) {
			if (isStringEquals(aee.key, "ATMU.toMountOnMount")) {
				if (aee.value && Boolean(aee.value)) {
					const effect = await aemlApi.convertActiveEffectToEffect(effectEntity);
					toMountOnMount.set(<string>effectEntity.id, effect);
				}
			}
			if (isStringEquals(aee.key, "ATMU.toMountOnDismount")) {
				if (aee.value && Boolean(aee.value)) {
					const effect = await aemlApi.convertActiveEffectToEffect(effectEntity);
					toMountOnDismount.set(<string>effectEntity.id, effect);
				}
			}
			if (isStringEquals(aee.key, "ATMU.toRiderOnMount")) {
				if (aee.value && Boolean(aee.value)) {
					const effect = await aemlApi.convertActiveEffectToEffect(effectEntity);
					toRiderOnMount.set(<string>effectEntity.id, effect);
				}
			}
			if (isStringEquals(aee.key, "ATMU.toRiderOnDismount")) {
				if (aee.value && Boolean(aee.value)) {
					const effect = await aemlApi.convertActiveEffectToEffect(effectEntity);
					toRiderOnDismount.set(<string>effectEntity.id, effect);
				}
			}
			if (isStringEquals(aee.key, "ATMU.flying")) {
				if (aee.value && Boolean(aee.value)) {
					const elevation = getElevationToken(token);
					const effect = MountupEffectDefinitions.flying(elevation);
					flyingMount.set(<string>effectEntity.id, effect);
				}
			}
		}
	}
	activeTokenMountUpData.toMountOnDismount = toMountOnDismount;
	activeTokenMountUpData.toMountOnMount = toMountOnMount;
	activeTokenMountUpData.toRiderOnDismount = toRiderOnDismount;
	activeTokenMountUpData.toRiderOnMount = toRiderOnMount;
	activeTokenMountUpData.flyingMount = flyingMount;
	return activeTokenMountUpData;
}

export async function manageAEOnMountUp(riderToken: Token, mountToken: Token) {
	const riderData: ActiveTokenMountUpData = await retrieveAtmuActiveEffectsFromToken(riderToken);
	const mountData: ActiveTokenMountUpData = await retrieveAtmuActiveEffectsFromToken(mountToken);
	for (const value of riderData.toMountOnMount.values()) {
		if (!(await aemlApi.hasEffectAppliedOnToken(mountToken.id, i18n(value.name), true))) {
			await aemlApi.addEffectOnToken(mountToken.id, i18n(value.name), value);
			info(
				`Apply effect '${i18n(value.name)}' on mount  up from rider '${riderToken.name}' to mount '${
					mountToken.name
				}'`
			);
		}
	}
	for (const value of mountData.toRiderOnMount.values()) {
		if (!(await aemlApi.hasEffectAppliedOnToken(riderToken.id, i18n(value.name), true))) {
			await aemlApi.addEffectOnToken(riderToken.id, i18n(value.name), value);
			info(
				`Apply effect '${i18n(value.name)}' on mount up from mount '${mountToken.name}' to rider '${
					riderToken.name
				}'`
			);
		}
	}

	for (const value of riderData.toMountOnDismount.values()) {
		if (
			//await aemlApi.hasEffectAppliedFromIdOnToken(mountToken.id, key, true) ||
			await aemlApi.hasEffectAppliedOnToken(mountToken.id, i18n(value.name), true)
		) {
			//await aemlApi.removeEffectFromIdOnToken(mountToken.id, key);
			await aemlApi.removeEffectOnToken(mountToken.id, i18n(value.name));
			info(
				`Remove effect '${i18n(value.name)}' on mount up from rider '${riderToken.name}' to mount '${
					mountToken.name
				}'`
			);
		}
	}
	for (const value of mountData.toRiderOnDismount.values()) {
		if (
			//await aemlApi.hasEffectAppliedFromIdOnToken(riderToken.id, key, true) ||
			await aemlApi.hasEffectAppliedOnToken(riderToken.id, i18n(value.name), true)
		) {
			//await aemlApi.removeEffectFromIdOnToken(riderToken.id, key);
			await aemlApi.removeEffectOnToken(riderToken.id, i18n(value.name));
			info(
				`Remove effect '${i18n(value.name)}' on mount up from mount '${mountToken.name}' to rider '${
					riderToken.name
				}'`
			);
		}
	}

	for (const value of mountData.flyingMount.values()) {
		if (!(await aemlApi.hasEffectAppliedOnToken(riderToken.id, i18n(value.name), true))) {
			await aemlApi.addEffectOnToken(riderToken.id, i18n(value.name), value);
			await API.applyFlying(mountToken);
			info(
				`Apply flying effect '${i18n(value.name)}' on mount up from mount '${mountToken.name}' to rider '${
					riderToken.name
				}'`
			);
		}
	}
}

export async function manageAEOnDismountUp(riderToken: Token, mountToken: Token) {
	const riderData: ActiveTokenMountUpData = await retrieveAtmuActiveEffectsFromToken(riderToken);
	const mountData: ActiveTokenMountUpData = await retrieveAtmuActiveEffectsFromToken(mountToken);
	for (const value of riderData.toMountOnDismount.values()) {
		if (!(await aemlApi.hasEffectAppliedOnToken(mountToken.id, i18n(value.name), true))) {
			await aemlApi.addEffectOnToken(mountToken.id, i18n(value.name), value);
			info(
				`Apply effect '${i18n(value.name)}' on dismount from rider '${riderToken.name}' to mount '${
					mountToken.name
				}'`
			);
		}
	}
	for (const value of mountData.toRiderOnDismount.values()) {
		if (!(await aemlApi.hasEffectAppliedOnToken(riderToken.id, i18n(value.name), true))) {
			await aemlApi.addEffectOnToken(riderToken.id, i18n(value.name), value);
			info(
				`Apply effect '${i18n(value.name)}' on dismount from mount '${mountToken.name}' to rider '${
					riderToken.name
				}'`
			);
		}
	}

	for (const value of mountData.toRiderOnMount.values()) {
		if (
			//await aemlApi.hasEffectAppliedFromIdOnToken(riderToken.id, key, true) ||
			await aemlApi.hasEffectAppliedOnToken(riderToken.id, i18n(value.name), true)
		) {
			//await aemlApi.removeEffectFromIdOnToken(riderToken.id, key);
			await aemlApi.removeEffectOnToken(riderToken.id, i18n(value.name));
			info(
				`Remove effect '${i18n(value.name)}' on dismount from rider '${riderToken.name}' to mount '${
					mountToken.name
				}'`
			);
		}
	}
	for (const value of riderData.toMountOnMount.values()) {
		if (
			//await aemlApi.hasEffectAppliedFromIdOnToken(mountToken.id, key, true) ||
			await aemlApi.hasEffectAppliedOnToken(mountToken.id, i18n(value.name), true)
		) {
			//await aemlApi.removeEffectFromIdOnToken(mountToken.id, key);
			await aemlApi.removeEffectOnToken(mountToken.id, i18n(value.name));
			info(
				`Remove effect '${i18n(value.name)}' on dismount from mount '${mountToken.name}' to rider '${
					riderToken.name
				}'`
			);
		}
	}

	for (const value of mountData.flyingMount.values()) {
		if (
			//await aemlApi.hasEffectAppliedFromIdOnToken(riderToken.id, key, true) ||
			await aemlApi.hasEffectAppliedOnToken(riderToken.id, i18n(value.name), true)
		) {
			//await aemlApi.removeEffectFromIdOnToken(riderToken.id, key);
			await aemlApi.removeEffectOnToken(riderToken.id, i18n(value.name));
			await API.removeFlying(mountToken);
			await API.removeFlying(riderToken);
			info(
				`Remove flying effect '${i18n(value.name)}' on dismount from rider '${riderToken.name}' to mount '${
					mountToken.name
				}'`
			);
		}
	}
}
