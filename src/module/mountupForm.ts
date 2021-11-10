import { i18n } from '../foundryvtt-mountup';
import { getGame, MOUNT_UP_MODULE_NAME } from './settings';

export class MountUpForm extends FormApplication {
  reset: boolean;

  constructor(object, options = {}) {
    super(object, options);
  }

  /**
   * Default Options for this FormApplication
   */
  static get defaultOptions(): FormApplication.Options {
    return mergeObject(super.defaultOptions, {
      title: i18n(MOUNT_UP_MODULE_NAME + '.form-title'),
      id: 'mountup-settings-form',
      template: `modules/${MOUNT_UP_MODULE_NAME}/templates/mountup-settings-form.html`,
      width: 500,
      closeOnSubmit: true,
      classes: ['sheet'],
    });
  }

  getData(options?: any): any {
    let data;
    if (this.reset) {
      data = {
        iconsList: this.getSelectList(this.iconOptions, 'Horse'),
        hudColumnList: this.getSelectList(this.hudColumnsOptions, 'Left'),
        hudTopBottomList: this.getSelectList(this.hudTopBottomOptions, 'Top'),
        riderLockList: this.getSelectList(
          this.riderLockOptions,
          i18n(MOUNT_UP_MODULE_NAME + '.settings.riderLock.noLock'),
        ),
        riderRotate: false,
        riderXList: this.getSelectList(this.riderXOptions, 'Left'),
        riderYList: this.getSelectList(this.riderYOptions, 'Top'),
        shouldChat: true,
        mountMsg: '{rider} has mounted {mount}.',
        dismountMsg: '{rider} has dismounted from {mount}.',
      };
    } else {
      data = {
        iconsList: this.getSelectList(this.iconOptions, SettingsForm.getIcon()),
        hudColumnList: this.getSelectList(this.hudColumnsOptions, SettingsForm.getHudColumn()),
        hudTopBottomList: this.getSelectList(this.hudTopBottomOptions, SettingsForm.getHudTopBottom()),
        riderLockList: this.getSelectList(this.riderLockOptions, SettingsForm.getRiderLock()),
        riderRotate: SettingsForm.getRiderRotate(),
        riderXList: this.getSelectList(this.riderXOptions, SettingsForm.getRiderX()),
        riderYList: this.getSelectList(this.riderYOptions, SettingsForm.getRiderY()),
        shouldChat: SettingsForm.getShouldChat(),
        mountMsg: SettingsForm.getMountMessage(),
        dismountMsg: SettingsForm.getDismountMessage(),
      };
    }

    return data;
  }

  activateListeners(html: JQuery): void {
    super.activateListeners(html);
    html.find('button[name="reset"]').click(this.onReset.bind(this));
    this.reset = false;
  }

  onReset() {
    this.reset = true;
    this.render();
  }

  /**
   * Executes on form submission.
   * @param {Object} event - the form submission event
   * @param {Object} formData - the form data
   */
  async _updateObject(event: Event | JQuery.Event, formData: any): Promise<any> {
    SettingsForm.setIcon(formData.icon);
    SettingsForm.setHudColumn(formData.hudColumn);
    SettingsForm.setHudTopBottom(formData.hudTopBottom);
    SettingsForm.setRiderLock(formData.riderLock);
    SettingsForm.setRiderRotate(formData.riderRotate);
    SettingsForm.setRiderX(formData.riderX);
    SettingsForm.setRiderY(formData.riderY);
    SettingsForm.setShouldChat(formData.shouldChat);
    SettingsForm.setMountMessage(formData.mountMsg);
    SettingsForm.setDismountMessage(formData.dismountMsg);
  }

  getSelectList(myselectslist, selected) {
    const options: any[] = [];
    Object.keys(myselectslist).forEach((x, i) => {
      options.push({ value: x, selected: x == selected });
    });
    return options;
  }

  iconOptions: Record<string, string> = {
    horse: 'Horse',
    peopleCarrying: 'People Carrying',
    hands: 'Hands',
    openHand: 'Open Hand',
    fist: 'Fist',
    handshake: 'Handshake',
  };

  hudColumnsOptions: Record<string, string> = {
    left: 'Left',
    right: 'Right',
  };

  hudTopBottomOptions: Record<string, string> = {
    top: 'Top',
    bottom: 'Bottom',
  };

  riderXOptions: Record<string, string> = {
    left: 'Left',
    center: 'Center',
    right: 'Right',
  };

  riderYOptions: Record<string, string> = {
    top: 'Top',
    center: 'Center',
    bottom: 'Bottom',
  };

  riderLockOptions: Record<string, string> = {
    noLock: i18n(MOUNT_UP_MODULE_NAME + '.settings.riderLock.noLock'),
    lockToLocation: 'Lock to location',
    lockToMountBounds: 'Lock to mount bounds',
    dismount: 'Dismount when outside mount bounds',
  };
}

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

      case 'horse':
        return 'fa-horse';
      case 'peopleCarrying':
        return 'fa-people-carry';
      case 'hands':
        return 'fa-hands';
      case 'openHand':
        return 'fa-hand-holding';
      case 'fist':
        return 'fa-fist-raised';
      case 'handshake':
        return 'fa-handshake';
    }
  }
  //#endregion CSS Getters

  // /**
  //  * Registers all of the necessary game settings for the module
  //  */
  // static registerSettings() {

  // }
}
