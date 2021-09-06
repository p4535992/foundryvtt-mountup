import { i18n } from "../foundryvtt-mountup.js";
import { getGame, MOUNT_UP_MODULE_NAME } from "./settings.js";
export class MountUpForm extends FormApplication {
    constructor(object, options = {}) {
        super(object, options);
        // displayUnknownListOptions: Record<string, string> = {
        //   allCards: i18n(CHAT_PORTRAIT_MODULE_NAME + '.displayUnknown.choice.allCards'), //"Affect every message.",
        //   selfAndGM: i18n(CHAT_PORTRAIT_MODULE_NAME + '.displayUnknown.choice.selfAndGM'), //"Affect own messages and GM messages.",
        //   self: i18n(CHAT_PORTRAIT_MODULE_NAME + '.displayUnknown.choice.self'), //"Only affect own messages.",
        //   gm: i18n(CHAT_PORTRAIT_MODULE_NAME + '.displayUnknown.choice.gm'), //"Only affect GM messages.",
        //   player: i18n(CHAT_PORTRAIT_MODULE_NAME + '.displayUnknown.choice.player'), //"Only affect player messages.",
        //   none: i18n(CHAT_PORTRAIT_MODULE_NAME + '.displayUnknown.choice.none'), //"Don't affect any messages.",
        //   onlyNpc: i18n(CHAT_PORTRAIT_MODULE_NAME + '.displayUnknown.choice.onlyNpc'), //"Affect any messages done from a NPC (need a compatible system with the 'npc' type like D&D5)."
        // };
        this.iconOptions = {
            horse: 'Horse',
            peopleCarrying: 'People Carrying',
            hands: 'Hands',
            openHand: 'Open Hand',
            fist: 'Fist',
            handshake: 'Handshake',
        };
        this.hudColumns = {
            left: 'Left',
            right: 'Right',
        };
        this.hudTopBottom = {
            top: 'Top',
            bottom: 'Bottom',
        };
        this.riderXOptions = {
            left: 'Left',
            center: 'Center',
            right: 'Right',
        };
        this.riderYOptions = {
            top: 'Top',
            center: 'Center',
            bottom: 'Bottom',
        };
        this.riderLockOptions = {
            noLock: i18n(MOUNT_UP_MODULE_NAME + '.settings.riderLock.noLock'),
            lockToLocation: 'Lock to location',
            lockToMountBounds: 'Lock to mount bounds',
            dismount: 'Dismount when outside mount bounds',
        };
    }
    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: i18n(MOUNT_UP_MODULE_NAME + '.form-title'),
            id: 'mountup-settings-form',
            template: `modules/${MOUNT_UP_MODULE_NAME}/templates/settings.html`,
            width: 500,
            closeOnSubmit: true,
            classes: ['sheet'],
        });
    }
    getData(options) {
        let data;
        if (this.reset) {
            data = {
                icons: 'Horse',
                hudColumn: 'Left',
                hudTopBottom: 'Top',
                riderLock: i18n(MOUNT_UP_MODULE_NAME + '.settings.riderLock.noLock'),
                riderRotate: false,
                riderX: 'Left',
                riderY: 'Top',
                shouldChat: true,
                mountMsg: '{rider} has mounted {mount}.',
                dismountMsg: '{rider} has dismounted from {mount}.',
            };
        }
        else {
            data = {
                icons: this.getSelectList(this.iconOptions, SettingsForm.getIcon()),
                hudColumn: this.getSelectList(this.hudColumns, SettingsForm.getHudColumn()),
                hudTopBottom: this.getSelectList(this.hudTopBottom, SettingsForm.getHudTopBottom()),
                riderLock: this.getSelectList(this.riderLockOptions, SettingsForm.getRiderLock()),
                riderRotate: SettingsForm.getRiderRotate(),
                riderX: this.getSelectList(this.riderXOptions, SettingsForm.getRiderX()),
                riderY: this.getSelectList(this.riderYOptions, SettingsForm.getRiderY()),
                shouldChat: SettingsForm.getShouldChat(),
                mountMsg: SettingsForm.getMountMessage(),
                dismountMsg: SettingsForm.getDismountMessage(),
            };
        }
        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        // this.toggleBorderShape();
        // this.toggleUseUserColorAsBorderColor();
        // html.find('select[name="borderShape"]').change(this.toggleBorderShape.bind(this));
        // html.find('input[name="useUserColorAsBorderColor"]').change(this.toggleUseUserColorAsBorderColor.bind(this));
        // html
        //   .find('input[name="useUserColorAsBackgroundColor"]')
        //   .change(this.toggleUseUserColorAsBackgroundColor.bind(this));
        // html.find('button[name="reset"]').click(this.onReset.bind(this));
        this.reset = false;
    }
    // toggleBorderShape() {
    //   const noneBorder = $('select[name="borderShape"]').val() === 'none';
    //   const useUserColor: boolean = ($('input[name="useUserColorAsBorderColor"]')[0] as HTMLInputElement).checked;
    //   $('input[name="useUserColorAsBorderColor"]').prop('disabled', noneBorder);
    //   $('input[name="useUserColorAsBackgroundColor"]').prop('disabled', noneBorder);
    //   $('input[name="borderColor"]').prop('disabled', noneBorder || useUserColor);
    //   $('input[name="borderColorSelector"]').prop('disabled', noneBorder || useUserColor);
    //   $('input[name="borderWidth"]').prop('disabled', noneBorder);
    // }
    // toggleUseUserColorAsBorderColor() {
    //   const noneBorder = $('select[name="borderShape"]').val() === 'none';
    //   const useUserColor: boolean = ($('input[name="useUserColorAsBorderColor"]')[0] as HTMLInputElement).checked;
    //   $('input[name="borderColor"]').prop('disabled', noneBorder || useUserColor);
    //   $('input[name="borderColorSelector"]').prop('disabled', noneBorder || useUserColor);
    // }
    // toggleUseUserColorAsBackgroundColor() {
    //   const noneBorder = $('select[name="borderShape"]').val() === 'none';
    //   const useUserColor: boolean = ($('input[name="useUserColorAsBackgroundColor"]')[0] as HTMLInputElement).checked;
    //   $('input[name="borderColor"]').prop('disabled', noneBorder || useUserColor);
    //   $('input[name="borderColorSelector"]').prop('disabled', noneBorder || useUserColor);
    // }
    onReset() {
        this.reset = true;
        this.render();
    }
    /**
     * Executes on form submission.
     * @param {Object} event - the form submission event
     * @param {Object} formData - the form data
     */
    async _updateObject(event, formData) {
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
        const options = [];
        Object.keys(myselectslist).forEach((x, i) => {
            options.push({ value: x, selected: x == selected });
        });
        return options;
    }
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
    static setShouldChat(val) {
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
    static setMountMessage(val) {
        getGame().settings.set(MOUNT_UP_MODULE_NAME, 'mount-message', val);
    }
    /**
     * Returns the user specified dismounting message
     */
    static getDismountMessage() {
        return getGame().settings.get(MOUNT_UP_MODULE_NAME, 'dismount-message');
    }
    static setDismountMessage(val) {
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
}
