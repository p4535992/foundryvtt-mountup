import { i18n } from '../foundryvtt-mountup';
import { MountUpForm } from './mountupForm';

export const MOUNT_UP_MODULE_NAME = 'foundryvtt-mountup';
export const socketName = 'module.' + MOUNT_UP_MODULE_NAME; //'module.mountup';
export const FlagScope = MOUNT_UP_MODULE_NAME; //'mountup';
//export const modName = 'Mount Up';
// const mod = 'foundryvtt-mountup';

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
export function getCanvas(): Canvas {
  if (!(canvas instanceof Canvas) || !canvas.ready) {
    throw new Error('Canvas Is Not Initialized');
  }
  return canvas;
}
/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
export function getGame(): Game {
  if (!(game instanceof Game)) {
    throw new Error('Game Is Not Initialized');
  }
  return game;
}

export const registerSettings = function () {
  getGame().settings.registerMenu(MOUNT_UP_MODULE_NAME, 'settingsMenu', {
    //.registerMenu(CHAT_PORTRAIT_MODULE_NAME, CHAT_PORTRAIT_MODULE_NAME, {
    name: i18n(MOUNT_UP_MODULE_NAME + '.settings.button.name'), // i18n(CHAT_PORTRAIT_MODULE_NAME + '.form'),
    label: i18n(MOUNT_UP_MODULE_NAME + '.settings.button.label'), // i18n(CHAT_PORTRAIT_MODULE_NAME + '.form-title'),
    hint: '', // i18n(CHAT_PORTRAIT_MODULE_NAME + '.form-hint'),
    icon: 'fas fa-horse',
    type: MountUpForm,
    restricted: true,
  });

  /** Which Icon should be used */
  getGame().settings.register(MOUNT_UP_MODULE_NAME, 'icon', {
    scope: 'world',
    config: false,
    type: Number,
    default: 0,
    choices: {
      horse: 'Horse',
      peopleCarrying: 'People Carrying',
      hands: 'Hands',
      openHand: 'Open Hand',
      fist: 'Fist',
      handshake: 'Handshake',
    },
  });

  /** Which column should the button be placed on */
  getGame().settings.register(MOUNT_UP_MODULE_NAME, 'column', {
    scope: 'world',
    config: false,
    type: Number,
    default: 0,
    choices: {
      left: 'Left',
      right: 'Right',
    },
  });

  /** Whether the button should be placed on the top or bottom of the column */
  getGame().settings.register(MOUNT_UP_MODULE_NAME, 'topbottom', {
    scope: 'world',
    config: false,
    type: Number,
    default: 0,
    choices: {
      top: 'Top',
      bottom: 'Bottom',
    },
  });

  /** Whether or not riders should be locked to mounts */
  getGame().settings.register(MOUNT_UP_MODULE_NAME, 'lock-riders', {
    scope: 'world',
    config: false,
    type: Number,
    default: 3,
    choices: {
      noLock: MOUNT_UP_MODULE_NAME + '.settings.riderLock.noLock',
      lockToLocation: 'Lock to location',
      lockToMountBounds: 'Lock to mount bounds',
      dismount: 'Dismount when outside mount bounds',
    },
  });

  getGame().settings.register(MOUNT_UP_MODULE_NAME, 'rider-rotate', {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });

  /** Where to place the rider horizontally on the mount */
  getGame().settings.register(MOUNT_UP_MODULE_NAME, 'rider-x', {
    scope: 'world',
    config: false,
    type: Number,
    default: 1,
    choices: {
      left: 'Left',
      center: 'Center',
      right: 'Right',
    },
  });

  /** Where to place the rider vertically on the mount */
  getGame().settings.register(MOUNT_UP_MODULE_NAME, 'rider-y', {
    scope: 'world',
    config: false,
    type: Number,
    default: 0,
    choices: {
      top: 'Top',
      center: 'Center',
      bottom: 'Bottom',
    },
  });

  /** Whether or not chat messages should be sent */
  getGame().settings.register(MOUNT_UP_MODULE_NAME, 'should-chat', {
    scope: 'world',
    config: false,
    type: Boolean,
    default: true,
  });

  /** The mounting message */
  getGame().settings.register(MOUNT_UP_MODULE_NAME, 'mount-message', {
    scope: 'world',
    config: false,
    type: String,
    default: '{rider} has mounted {mount}.',
  });

  /** The dismounting message */
  getGame().settings.register(MOUNT_UP_MODULE_NAME, 'dismount-message', {
    scope: 'world',
    config: false,
    type: String,
    default: '{rider} has dismounted from {mount}.',
  });
};
