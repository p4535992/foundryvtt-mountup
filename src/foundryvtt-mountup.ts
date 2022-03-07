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
import { initHooks, readyHooks, setupHooks } from './module/module';
import { registerSettings } from './module/settings';
import { game } from './module/settings';
import CONSTANTS from './module/constants';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async () => {
  console.log(`${CONSTANTS.MODULE_NAME} | Initializing ${CONSTANTS.MODULE_NAME}`);
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
  setupHooks();
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', () => {
  // Do anything once the module is ready
  if (!game.modules.get('lib-wrapper')?.active && game.user?.isGM) {
    ui.notifications?.error(
      `The '${CONSTANTS.MODULE_NAME}' module requires to install and activate the 'libWrapper' module.`,
    );
    return;
  }
  // if (game.modules.get('mountup')?.active && game.user?.isGM) {
  //   ui.notifications?.warn(`The 'mountup', is not needed anymore just use '${CONSTANTS.MODULE_NAME}'`);
  // }

  readyHooks();
});

/* ------------------------------------ */
/* Other Hooks							*/
/* ------------------------------------ */

Hooks.once('libChangelogsReady', function () {
  //@ts-ignore
  libChangelogs.registerConflict(
    CONSTANTS.MODULE_NAME,
    'mountup',
    `The 'mountup', is not needed anymore just use '${CONSTANTS.MODULE_NAME}'`,
    'major',
  );

  //@ts-ignore
  libChangelogs.register(
    CONSTANTS.MODULE_NAME,
    `
  - Auto update of the elevation parameter of the rider when mount and dismount, so the elevation of the rider is always syn with the elevation of the mount useful for flying mount with levels.
  - New active effect management for add and remove custom active effect when mount and dismount, you mount a tank ? you got some active effect on the defense !
  - Add token magic effect for apply the "flying" effect, for when a mount is set to be a flying one "just a token amgic effect"
  - Set up for the new token attacher parameters for the mount up macro "Add _canMoveConstrained_ flag and API to set this flag so a attached element is allowed to move within area of base token. This is only supported for Tokens for now."
  - Abbandoned support for 0.8.9
  `,
    'minor',
  );
});
