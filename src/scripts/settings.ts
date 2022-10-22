import CONSTANTS from "./constants";
import { i18n } from "./lib/lib";

export const registerSettings = function () {
	// game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'settingsMenu', {
	//   name: i18n(CONSTANTS.MODULE_NAME + '.settings.button.name'),
	//   label: i18n(CONSTANTS.MODULE_NAME + '.settings.button.label'),
	//   hint: i18n(CONSTANTS.MODULE_NAME + '.settings.button.hint'),
	//   icon: 'fas fa-horse',
	//   type: MountUpForm,
	//   restricted: true,
	// });

	game.settings.register(CONSTANTS.MODULE_NAME, "enableActiveEffect", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.enableActiveEffect.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.enableActiveEffect.hint`),
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "enableAutoUpdateElevation", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.enableAutoUpdateElevation.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.enableAutoUpdateElevation.hint`),
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "enableCanMoveConstrained", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.enableCanMoveConstrained.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.enableCanMoveConstrained.hint`),
		scope: "world",
		config: true,
		type: Boolean,
		default: true,
	});

	/** Which Icon should be used */
	game.settings.register(CONSTANTS.MODULE_NAME, "icon", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.icon.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.icon.hint`),
		scope: "world",
		config: true,
		// type: String,
		// default: 'Horse',
		type: Number,
		default: 0,
		choices: <any>{
			0: "Horse",
			1: "People Carrying",
			2: "Hands",
			3: "Open Hand",
			4: "Fist",
			5: "Handshake",
		},
	});

	/** Which column should the button be placed on */
	game.settings.register(CONSTANTS.MODULE_NAME, "column", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.hint`),
		scope: "world",
		config: true,
		// type: String,
		// default: 'Left',
		type: Number,
		default: 0,
		choices: <any>{
			0: "Left",
			1: "Right",
		},
	});

	/** Whether the button should be placed on the top or bottom of the column */
	game.settings.register(CONSTANTS.MODULE_NAME, "topbottom", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.hint`),
		scope: "world",
		config: true,
		// type: String,
		// default: 'Top',
		type: Number,
		default: 0,
		choices: <any>{
			0: "Top",
			1: "Bottom",
		},
	});

	// game.settings.register(CONSTANTS.MODULE_NAME, 'pipPosition', {
	//   name: i18n(`${CONSTANTS.MODULE_NAME}.setting.pipPosition.name`),
	//   hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.pipPosition.hint`),
	//   scope: 'world',
	//   config: true,
	//   default: 'topleft',
	//   type: String,
	//   choices: {
	//     topleft: i18n(`${CONSTANTS.MODULE_NAME}.setting.pipPosition.topleft`),
	//     topright: i18n(`${CONSTANTS.MODULE_NAME}.setting.pipPosition.topright`),
	//     bottomleft: i18n(`${CONSTANTS.MODULE_NAME}.setting.pipPosition.bottomleft`),
	//     bottomright: i18n(`${CONSTANTS.MODULE_NAME}.setting.pipPosition.bottomright`),
	//     centertop: i18n(`${CONSTANTS.MODULE_NAME}.setting.pipPosition.centertop`),
	//     centerbottom: i18n(`${CONSTANTS.MODULE_NAME}.setting.pipPosition.centerbottom`),
	//     random: i18n(`${CONSTANTS.MODULE_NAME}.setting.pipPosition.random`),
	//   },
	// });

	/** Whether or not riders should be locked to mounts */
	game.settings.register(CONSTANTS.MODULE_NAME, "lock-riders", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderLock.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderLock.hint`),
		scope: "world",
		config: true,
		// type: String,
		// default: 'Dismount when outside mount bounds',
		type: Number,
		default: 3,
		choices: <any>{
			0: `${CONSTANTS.MODULE_NAME}.setting.riderLock.noLock`,
			1: "Lock to location",
			2: "Lock to mount bounds",
			3: "Dismount when outside mount bounds",
		},
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "rider-rotate", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderRotate.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderRotate.hint`),
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
	});

	/** Where to place the rider horizontally on the mount */
	game.settings.register(CONSTANTS.MODULE_NAME, "rider-x", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderX.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderX.hint`),
		scope: "world",
		config: true,
		// type: String,
		// default: 'Center',
		type: Number,
		default: 1,
		choices: <any>{
			0: "Left",
			1: "Center",
			2: "Right",
		},
	});

	/** Where to place the rider vertically on the mount */
	game.settings.register(CONSTANTS.MODULE_NAME, "rider-y", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderY.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderY.hint`),
		scope: "world",
		config: true,
		// type: String,
		// default: 'Top',
		type: Number,
		default: 1,
		choices: <any>{
			0: "Top",
			1: "Center",
			2: "Bottom",
		},
	});

	/** Whether or not chat messages should be sent */
	game.settings.register(CONSTANTS.MODULE_NAME, "should-chat", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.shouldChat.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.shouldChat.hint`),
		scope: "world",
		config: true,
		type: Boolean,
		default: true,
	});

	/** The mounting message */
	game.settings.register(CONSTANTS.MODULE_NAME, "mount-message", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.mountMsg.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.mountMsg.hint`),
		scope: "world",
		config: true,
		type: String,
		default: "{rider} has mounted {mount}.",
	});

	/** The dismounting message */
	game.settings.register(CONSTANTS.MODULE_NAME, "dismount-message", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.dismountMsg.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.dismountMsg.hint`),
		scope: "world",
		config: true,
		type: String,
		default: "{rider} has dismounted from {mount}.",
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "debug", {
		name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
		scope: "client",
		config: true,
		default: false,
		type: Boolean,
	});
};
