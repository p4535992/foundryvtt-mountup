export const game = getGame();
export const canvas = getCanvas();

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
function getCanvas(): Canvas {
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
function getGame(): Game {
  if (!(game instanceof Game)) {
    throw new Error('Game Is Not Initialized');
  }
  return game;
}

export const registerSettings = function () {
  // game.settings.registerMenu(MOUNT_UP_MODULE_NAME, 'settingsMenu', {
  //   name: i18n(MOUNT_UP_MODULE_NAME + '.settings.button.name'),
  //   label: i18n(MOUNT_UP_MODULE_NAME + '.settings.button.label'),
  //   hint: i18n(MOUNT_UP_MODULE_NAME + '.settings.button.hint'),
  //   icon: 'fas fa-horse',
  //   type: MountUpForm,
  //   restricted: true,
  // });

  /** Which Icon should be used */
  game.settings.register(MOUNT_UP_MODULE_NAME, 'icon', {
    scope: 'world',
    config: false,
    type: String,
    default: 'Horse',
    // type: Number,
    // default: 0,
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
  game.settings.register(MOUNT_UP_MODULE_NAME, 'column', {
    scope: 'world',
    config: false,
    type: String,
    default: 'Left',
    // type: Number,
    // default: 0,
    choices: {
      left: 'Left',
      right: 'Right',
    },
  });

  /** Whether the button should be placed on the top or bottom of the column */
  game.settings.register(MOUNT_UP_MODULE_NAME, 'topbottom', {
    scope: 'world',
    config: false,
    type: String,
    default: 'Top',
    // type: Number,
    // default: 0,
    choices: {
      top: 'Top',
      bottom: 'Bottom',
    },
  });

  /** Whether or not riders should be locked to mounts */
  game.settings.register(MOUNT_UP_MODULE_NAME, 'lock-riders', {
    scope: 'world',
    config: false,
    // type: String,
    // default: 'Dismount when outside mount bounds',
    type: Number,
    default: 3,
    choices: {
      0: MOUNT_UP_MODULE_NAME + '.settings.riderLock.noLock',
      1: 'Lock to location',
      2: 'Lock to mount bounds',
      3: 'Dismount when outside mount bounds',
    },
  });

  game.settings.register(MOUNT_UP_MODULE_NAME, 'rider-rotate', {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });

  /** Where to place the rider horizontally on the mount */
  game.settings.register(MOUNT_UP_MODULE_NAME, 'rider-x', {
    scope: 'world',
    config: false,
    // type: String,
    // default: 'Center',
    type: Number,
    default: 1,
    choices: {
      0: 'Left',
      1: 'Center',
      2: 'Right',
    },
  });

  /** Where to place the rider vertically on the mount */
  game.settings.register(MOUNT_UP_MODULE_NAME, 'rider-y', {
    scope: 'world',
    config: false,
    // type: String,
    // default: 'Top',
    type: Number,
    default: 0,
    choices: {
      0: 'Top',
      1: 'Center',
      2: 'Bottom',
    },
  });

  /** Whether or not chat messages should be sent */
  game.settings.register(MOUNT_UP_MODULE_NAME, 'should-chat', {
    scope: 'world',
    config: false,
    type: Boolean,
    default: true,
  });

  /** The mounting message */
  game.settings.register(MOUNT_UP_MODULE_NAME, 'mount-message', {
    scope: 'world',
    config: false,
    type: String,
    default: '{rider} has mounted {mount}.',
  });

  /** The dismounting message */
  game.settings.register(MOUNT_UP_MODULE_NAME, 'dismount-message', {
    scope: 'world',
    config: false,
    type: String,
    default: '{rider} has dismounted from {mount}.',
  });
};
