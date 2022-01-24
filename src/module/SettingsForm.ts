import { getGame, MOUNT_UP_MODULE_NAME } from './settings';

/**
 * Provides functionality for interaction with module settings
 */
export class SettingsForm {
  //#region getters and setters
  static getIcon() {
    return getGame().settings.get(MOUNT_UP_MODULE_NAME, 'icon');
  }

  static setIcon(val) {
    getGame().settings.set(MOUNT_UP_MODULE_NAME, 'icon', val);
  }

  static getHudColumn() {
    return getGame().settings.get(MOUNT_UP_MODULE_NAME, 'column');
  }
  static setHudColumn(val) {
    getGame().settings.set(MOUNT_UP_MODULE_NAME, 'column', val);
  }

  static getHudTopBottom() {
    return getGame().settings.get(MOUNT_UP_MODULE_NAME, 'topbottom');
  }

  static setHudTopBottom(val) {
    getGame().settings.set(MOUNT_UP_MODULE_NAME, 'topbottom', val);
  }

  /**
   * Returns the user specified rider horizontal location
   */
  static getRiderX() {
    return getGame().settings.get(MOUNT_UP_MODULE_NAME, 'rider-x');
  }

  static setRiderX(val) {
    getGame().settings.set(MOUNT_UP_MODULE_NAME, 'rider-x', val);
  }

  /**
   * Returns the user specified rider vertical location
   */
  static getRiderY() {
    return getGame().settings.get(MOUNT_UP_MODULE_NAME, 'rider-y');
  }

  static setRiderY(val) {
    getGame().settings.set(MOUNT_UP_MODULE_NAME, 'rider-y', val);
  }

  /**
   * Returns true if chat messages should be sent
   */
  static getShouldChat() {
    return getGame().settings.get(MOUNT_UP_MODULE_NAME, 'should-chat');
  }

  static setShouldChat(val: boolean) {
    getGame().settings.set(MOUNT_UP_MODULE_NAME, 'should-chat', val);
  }

  /**
   * Returns true if the setting to lock riders is enabled
   */
  static getRiderLock() {
    return getGame().settings.get(MOUNT_UP_MODULE_NAME, 'lock-riders');
  }

  static setRiderLock(val) {
    getGame().settings.set(MOUNT_UP_MODULE_NAME, 'lock-riders', val);
  }

  static getRiderRotate() {
    return getGame().settings.get(MOUNT_UP_MODULE_NAME, 'rider-rotate');
  }

  static setRiderRotate(val) {
    getGame().settings.set(MOUNT_UP_MODULE_NAME, 'rider-rotate', val);
  }

  /**
   * Returns the user specified mounting message
   */
  static getMountMessage() {
    return getGame().settings.get(MOUNT_UP_MODULE_NAME, 'mount-message');
  }

  static setMountMessage(val: string) {
    getGame().settings.set(MOUNT_UP_MODULE_NAME, 'mount-message', val);
  }

  /**
   * Returns the user specified dismounting message
   */
  static getDismountMessage() {
    return getGame().settings.get(MOUNT_UP_MODULE_NAME, 'dismount-message');
  }

  static setDismountMessage(val: string) {
    getGame().settings.set(MOUNT_UP_MODULE_NAME, 'dismount-message', val);
  }
  //#endregion

  //#region CSS Getters
  /**
   * Returns the css class for the left or right HUD column based on the game setting
   */
  static getHudColumnClass() {
    return getGame().settings.get(MOUNT_UP_MODULE_NAME, 'column') == 0 ? '.col.left' : '.col.right';
  }

  /**
   * Returns whether the button should be placed on the top or bottom of the HUD column
   */
  static getHudTopBottomClass() {
    return getGame().settings.get(MOUNT_UP_MODULE_NAME, 'topbottom') == 0 ? 'top' : 'bottom';
  }

  /**
   * Gets the icon that should be used on the HUD
   */
  static getIconClass() {
    switch (getGame().settings.get(MOUNT_UP_MODULE_NAME, 'icon')) {
      case 0:
        return 'fa-horse';
      case 1:
        return 'fa-people-carry';
      case 2:
        return 'fa-hands';
      case 3:
        return 'fa-hand-holding';
      case 4:
        return 'fa-fist-raised';
      case 5:
        return 'fa-handshake';
    }
  }
  //#endregion CSS Getters
}
