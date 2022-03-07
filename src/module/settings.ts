import CONSTANTS from './constants';
import { i18n } from './lib/lib';

export const game = getGame();
export const canvas = getCanvas();

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
  // game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'settingsMenu', {
  //   name: i18n(CONSTANTS.MODULE_NAME + '.settings.button.name'),
  //   label: i18n(CONSTANTS.MODULE_NAME + '.settings.button.label'),
  //   hint: i18n(CONSTANTS.MODULE_NAME + '.settings.button.hint'),
  //   icon: 'fas fa-horse',
  //   type: MountUpForm,
  //   restricted: true,
  // });

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableActiveEffect', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.enableActiveEffect.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.enableActiveEffect.hint`),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableAutoUpdateElevation', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.enableAutoUpdateElevation.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.enableAutoUpdateElevation.hint`),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  /** Which Icon should be used */
  game.settings.register(CONSTANTS.MODULE_NAME, 'icon', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.icon.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.icon.hint`),
    scope: 'world',
    config: true,
    // type: String,
    // default: 'Horse',
    type: Number,
    default: 0,
    choices: {
      0: 'Horse',
      1: 'People Carrying',
      2: 'Hands',
      3: 'Open Hand',
      4: 'Fist',
      5: 'Handshake',
    },
  });

  /** Which column should the button be placed on */
  game.settings.register(CONSTANTS.MODULE_NAME, 'column', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.hint`),
    scope: 'world',
    config: true,
    // type: String,
    // default: 'Left',
    type: Number,
    default: 0,
    choices: {
      0: 'Left',
      1: 'Right',
    },
  });

  /** Whether the button should be placed on the top or bottom of the column */
  game.settings.register(CONSTANTS.MODULE_NAME, 'topbottom', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.hint`),
    scope: 'world',
    config: true,
    // type: String,
    // default: 'Top',
    type: Number,
    default: 0,
    choices: {
      0: 'Top',
      1: 'Bottom',
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
  game.settings.register(CONSTANTS.MODULE_NAME, 'lock-riders', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderLock.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderLock.hint`),
    scope: 'world',
    config: true,
    // type: String,
    // default: 'Dismount when outside mount bounds',
    type: Number,
    default: 3,
    choices: {
      0: `${CONSTANTS.MODULE_NAME}.setting.riderLock.noLock`,
      1: 'Lock to location',
      2: 'Lock to mount bounds',
      3: 'Dismount when outside mount bounds',
    },
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'rider-rotate', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderRotate.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderRotate.hint`),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  /** Where to place the rider horizontally on the mount */
  game.settings.register(CONSTANTS.MODULE_NAME, 'rider-x', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderX.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderX.hint`),
    scope: 'world',
    config: true,
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
  game.settings.register(CONSTANTS.MODULE_NAME, 'rider-y', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderY.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.riderY.hint`),
    scope: 'world',
    config: true,
    // type: String,
    // default: 'Top',
    type: Number,
    default: 1,
    choices: {
      0: 'Top',
      1: 'Center',
      2: 'Bottom',
    },
  });

  /** Whether or not chat messages should be sent */
  game.settings.register(CONSTANTS.MODULE_NAME, 'should-chat', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.shouldChat.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.shouldChat.hint`),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  /** The mounting message */
  game.settings.register(CONSTANTS.MODULE_NAME, 'mount-message', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.mountMsg.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.mountMsg.hint`),
    scope: 'world',
    config: true,
    type: String,
    default: '{rider} has mounted {mount}.',
  });

  /** The dismounting message */
  game.settings.register(CONSTANTS.MODULE_NAME, 'dismount-message', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.dismountMsg.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.dismountMsg.hint`),
    scope: 'world',
    config: true,
    type: String,
    default: '{rider} has dismounted from {mount}.',
  });
};
