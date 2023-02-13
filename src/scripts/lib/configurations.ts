import CONSTANTS from "../constants";
import { SettingsForm } from "../settings-form";
import { MountUpFlags } from "../utils";
import { injectConfig } from "./injectConfig";
import { info, warn } from "./lib";

/**
 * Handler called when token configuration window is opened. Injects custom form html and deals
 * with updating token.
 * @category GMOnly
 * @function
 * @async
 * @param {TokenConfig} tokenConfig
 * @param {JQuery} html
 */
export async function renderTokenConfigHandler(app, html, data) {
	// if (!game.user?.isGM) {
	// 	info('Only GM can edit the Mount Up Token Configuration');
	// 	return;
	// }
	if (app.object.flags["token-attacher"]?.parent) {
		warn("Detach token before editing token config.", true);
		return;
	}
	const objectOri = app.object;
	let object = objectOri;
	// MOD 4535992
	let noActorDataFlagsOnToken = false;
	//@ts-ignore
	// if (objectOri instanceof TokenDocument && objectOri.actorData) {
	// 	//@ts-ignore
	// 	object = objectOri.actorData;
	// }
	if (!hasProperty(object, "flags")) {
		object.flags = {};
		noActorDataFlagsOnToken = true;
	}
	if (!hasProperty(object.flags, CONSTANTS.MODULE_NAME)) {
		object.flags[CONSTANTS.MODULE_NAME] = {};
		noActorDataFlagsOnToken = true;
	}
	if (noActorDataFlagsOnToken && hasProperty(app, `actor.prototypeToken.flags.${CONSTANTS.MODULE_NAME}`)) {
		const actorFlags = getProperty(app, `actor.prototypeToken.flags.${CONSTANTS.MODULE_NAME}`);
		setProperty(object, `flags.${CONSTANTS.MODULE_NAME}`, actorFlags);
	}
	// END MOD 4535992

	const newData = {
		moduleId: CONSTANTS.MODULE_NAME,
		tab: {
			name: CONSTANTS.MODULE_NAME,
			label: "Mount Up",
			icon: "fas fa-horse fa-fw",
		},
		[MountUpFlags.IsAMount]: {
			type: "checkbox",
			label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.tokenConfig.${MountUpFlags.IsAMount}.name`),
			notes: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.tokenConfig.${MountUpFlags.IsAMount}.hint`),
			default: Boolean(object?.flags[CONSTANTS.MODULE_NAME][MountUpFlags.IsAMount] ?? false),
		},
		[MountUpFlags.LockRider]: {
			type: "checkbox",
			label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.tokenConfig.${MountUpFlags.LockRider}.name`),
			notes: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.tokenConfig.${MountUpFlags.LockRider}.hint`),
			default: Boolean(object?.flags[CONSTANTS.MODULE_NAME][MountUpFlags.LockRider] ?? false),
		},
		[MountUpFlags.IconHud]: {
			type: "select",
			label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.tokenConfig.${MountUpFlags.IconHud}.name`),
			notes: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.tokenConfig.${MountUpFlags.IconHud}.hint`),
			options: {
				0: "Horse",
				1: "People Carrying",
				2: "Hands",
				3: "Open Hand",
				4: "Fist",
				5: "Handshake",
			},
			default:
				object?.flags[CONSTANTS.MODULE_NAME]?.[MountUpFlags.IconHud] ??
				game.settings.get(CONSTANTS.MODULE_NAME, "icon"),
		},
	};
	injectConfig.inject(app, html, newData, app.object);
	/*
	injectConfig.inject(
		tokenConfig,
		html,
		{
			moduleId: CONSTANTS.MODULE_NAME,
			tab: {
				name: CONSTANTS.MODULE_NAME,
				label: "Mount Up",
				icon: "fas fa-horse fa-fw",
			},
		},
		tokenConfig.object
	);
	const posTab = html.find(`.tab[data-tab="${CONSTANTS.MODULE_NAME}"]`);
	let isAMount: string | undefined = undefined;

	if (!hasProperty(tokenConfig.token.flags, CONSTANTS.MODULE_NAME)) {
		setProperty(tokenConfig.token.flags, CONSTANTS.MODULE_NAME, {});
	}

	if (tokenConfig.options.sheetConfig) {
		isAMount = tokenConfig.object.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.IsAMount) ? "checked" : "";
	} else {
		isAMount = tokenConfig.token.actor.flags[CONSTANTS.MODULE_NAME][MountUpFlags.IsAMount] ? "checked" : "";
	}

	let data = {
		isAMount: isAMount,
	};

	const insertHTML = await renderTemplate("modules/" + CONSTANTS.MODULE_NAME + "/templates/token-config.html", data);
	posTab.append(insertHTML);
    */
}
