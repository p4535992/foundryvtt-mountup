/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module
 */
// Import JavaScript modules

// Import TypeScript modules
import { preloadTemplates } from './module/preloadTemplates';
import { registerSettings, MOUNT_UP_MODULE_NAME } from './module/settings';
import { initHooks, readyHooks } from './module/Hooks';
import { game } from './module/settings';

export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3
export const debug = (...args) => {
  if (debugEnabled > 1) console.log(`DEBUG:${MOUNT_UP_MODULE_NAME} | `, ...args);
};
export const log = (...args) => console.log(`${MOUNT_UP_MODULE_NAME} | `, ...args);
export const warn = (...args) => {
  if (debugEnabled > 0) console.warn(`${MOUNT_UP_MODULE_NAME} | `, ...args);
};
export const error = (...args) => console.error(`${MOUNT_UP_MODULE_NAME} | `, ...args);
export const timelog = (...args) => warn(`${MOUNT_UP_MODULE_NAME} | `, Date.now(), ...args);

export const i18n = (key) => {
  return game.i18n.localize(key);
};
export const i18nFormat = (key, data = {}) => {
  return game.i18n.format(key, data);
};

export const setDebugLevel = (debugText: string) => {
  debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
  // 0 = none, warnings = 1, debug = 2, all = 3
  if (debugEnabled >= 3) CONFIG.debug.hooks = true;
};

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async () => {
  console.log(`${MOUNT_UP_MODULE_NAME} | Initializing ${MOUNT_UP_MODULE_NAME}`);
  // Assign custom classes and constants here

  // Register custom module settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // Register custom sheets (if any)
  initHooks();
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
  // Do anything after initialization but before ready
  // setupModules();

  registerSettings();
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', () => {
  // Do anything once the module is ready
  if (!game.modules.get('lib-wrapper')?.active && game.user?.isGM) {
    ui.notifications?.error(
      `The '${MOUNT_UP_MODULE_NAME}' module requires to install and activate the 'libWrapper' module.`,
    );
    return;
  }
  if (!game.modules.get('token-attacher')?.active && game.user?.isGM) {
    ui.notifications?.error(
      `The '${MOUNT_UP_MODULE_NAME}' module requires to install and activate the 'token-attacher' module.`,
    );
    return;
  }

  // if (game.modules.get('mountup')?.active && game.user?.isGM) {
  //   ui.notifications?.warn(`The 'mountup', is not needed anymore just use '${MOUNT_UP_MODULE_NAME}'`);
  // }

  readyHooks();
});

// Add any additional hooks if necessary

Hooks.once('libChangelogsReady', function () {
  //@ts-ignore
  libChangelogs.register(
    MOUNT_UP_MODULE_NAME,
    `
    - Removed old flag set
    - Better center calculation coordinates
  `,
    'minor',
  );
});
