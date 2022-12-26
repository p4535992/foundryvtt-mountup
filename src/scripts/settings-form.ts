import CONSTANTS from "./constants";

/**
 * Provides functionality for interaction with module settings
 */
export class SettingsForm {
	//#region getters and setters
	static getIcon() {
		return game.settings.get(CONSTANTS.MODULE_NAME, "icon");
	}

	static setIcon(val) {
		game.settings.set(CONSTANTS.MODULE_NAME, "icon", val);
	}

	static getHudColumn() {
		return game.settings.get(CONSTANTS.MODULE_NAME, "column");
	}
	static setHudColumn(val) {
		game.settings.set(CONSTANTS.MODULE_NAME, "column", val);
	}

	static getHudTopBottom() {
		return game.settings.get(CONSTANTS.MODULE_NAME, "topbottom");
	}

	static setHudTopBottom(val) {
		game.settings.set(CONSTANTS.MODULE_NAME, "topbottom", val);
	}

	/**
	 * Returns the user specified rider horizontal location
	 */
	static getRiderX() {
		return game.settings.get(CONSTANTS.MODULE_NAME, "rider-x");
	}

	static setRiderX(val) {
		game.settings.set(CONSTANTS.MODULE_NAME, "rider-x", val);
	}

	/**
	 * Returns the user specified rider vertical location
	 */
	static getRiderY() {
		return game.settings.get(CONSTANTS.MODULE_NAME, "rider-y");
	}

	static setRiderY(val) {
		game.settings.set(CONSTANTS.MODULE_NAME, "rider-y", val);
	}

	// static getRiderPipPosition() {
	//   return game.settings.get(CONSTANTS.MODULE_NAME, 'pipPosition');
	// }

	// static setRiderPipPosition(val) {
	//   game.settings.set(CONSTANTS.MODULE_NAME, 'pipPosition', val);
	// }

	/**
	 * Returns true if chat messages should be sent
	 */
	static getShouldChat() {
		return game.settings.get(CONSTANTS.MODULE_NAME, "should-chat");
	}

	static setShouldChat(val: boolean) {
		game.settings.set(CONSTANTS.MODULE_NAME, "should-chat", val);
	}

	/**
	 * Returns true if the setting to lock riders is enabled
	 */
	static getRiderLock() {
		return game.settings.get(CONSTANTS.MODULE_NAME, "lock-riders");
	}

	static setRiderLock(val) {
		game.settings.set(CONSTANTS.MODULE_NAME, "lock-riders", val);
	}

	static getRiderRotate() {
		return game.settings.get(CONSTANTS.MODULE_NAME, "rider-rotate");
	}

	static setRiderRotate(val) {
		game.settings.set(CONSTANTS.MODULE_NAME, "rider-rotate", val);
	}

	/**
	 * Returns the user specified mounting message
	 */
	static getMountMessage() {
		return game.settings.get(CONSTANTS.MODULE_NAME, "mount-message");
	}

	static setMountMessage(val: string) {
		game.settings.set(CONSTANTS.MODULE_NAME, "mount-message", val);
	}

	/**
	 * Returns the user specified dismounting message
	 */
	static getDismountMessage() {
		return game.settings.get(CONSTANTS.MODULE_NAME, "dismount-message");
	}

	static setDismountMessage(val: string) {
		game.settings.set(CONSTANTS.MODULE_NAME, "dismount-message", val);
	}
	//#endregion

	//#region CSS Getters
	/**
	 * Returns the css class for the left or right HUD column based on the game setting
	 */
	static getHudColumnClass() {
		return game.settings.get(CONSTANTS.MODULE_NAME, "column") === 0 ? ".col.left" : ".col.right";
	}

	/**
	 * Returns whether the button should be placed on the top or bottom of the HUD column
	 */
	static getHudTopBottomClass() {
		return game.settings.get(CONSTANTS.MODULE_NAME, "topbottom") === 0 ? "top" : "bottom";
	}

	/**
	 * Gets the icon that should be used on the HUD
	 */
	static getIconClass(iconClassIndex: any = undefined) {
		if (!iconClassIndex == undefined) {
			iconClassIndex = game.settings.get(CONSTANTS.MODULE_NAME, "icon");
		}
		switch (iconClassIndex) {
			case 0: {
				return "fa-horse";
			}
			case 1: {
				return "fa-people-carry";
			}
			case 2: {
				return "fa-hands";
			}
			case 3: {
				return "fa-hand-holding";
			}
			case 4: {
				return "fa-fist-raised";
			}
			case 5: {
				return "fa-handshake";
			}
			default: {
				return "fa-horse";
			}
		}
	}
	//#endregion CSS Getters
}
