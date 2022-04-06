import CONSTANTS from './constants';
import API from './api';
import { debug } from './lib/lib';

export const SOCKET_HANDLERS = {
  /**
   * Generic sockets
   */
  CALL_HOOK: 'callHook',

  /**
   * Item pile sockets
   */

  /**
   * UI sockets
   */

  /**
   * Item & attribute sockets
   */
};

export let mountUpSocket;

export function registerSocket() {
  debug('Registered mountUpSocket');
  if (mountUpSocket) {
    return mountUpSocket;
  }
  //@ts-ignore
  mountUpSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

  /**
   * Generic socket
   */
  mountUpSocket.register(SOCKET_HANDLERS.CALL_HOOK, (hook, ...args) => callHook(hook, ...args));

  // /**
  //  * Conditional Visibility sockets
  //  */
  // mountUpSocket.register(SOCKET_HANDLERS.ON_RENDER_TOKEN_CONFIG, (...args) =>
  //   API._onRenderTokenConfig(...args),
  // );

  /**
   * UI sockets
   */

  /**
   * Item & attribute sockets
   */

  /**
   * Effects
   */

  // mountUpSocket.register('addActorDataChanges', (...args) => API._actorUpdater.addActorDataChanges(...args));
  // mountUpSocket.register('removeActorDataChanges', (...args) => API._actorUpdater.removeActorDataChanges(...args));
  mountUpSocket.register('toggleEffect', (...args) => API.toggleEffectArr(...args));
  mountUpSocket.register('addEffect', (...args) => API.addEffectArr(...args));
  mountUpSocket.register('removeEffect', (...args) => API.removeEffectArr(...args));

  mountUpSocket.register('addEffectOnActor', (...args) => API.addEffectOnActorArr(...args));
  mountUpSocket.register('removeEffectOnActor', (...args) => API.removeEffectOnActorArr(...args));
  mountUpSocket.register('removeEffectFromIdOnActor', (...args) => API.removeEffectFromIdOnActorArr(...args));
  mountUpSocket.register('toggleEffectFromIdOnActor', (...args) => API.toggleEffectFromIdOnActorArr(...args));
  mountUpSocket.register('findEffectByNameOnActor', (...args) => API.findEffectByNameOnActorArr(...args));

  mountUpSocket.register('addEffectOnToken', (...args) => API.addEffectOnTokenArr(...args));
  mountUpSocket.register('removeEffectOnToken', (...args) => API.removeEffectOnTokenArr(...args));
  mountUpSocket.register('removeEffectFromIdOnToken', (...args) => API.removeEffectFromIdOnTokenArr(...args));
  mountUpSocket.register('toggleEffectFromIdOnToken', (...args) => API.toggleEffectFromIdOnTokenArr(...args));
  mountUpSocket.register('findEffectByNameOnToken', (...args) => API.findEffectByNameOnTokenArr(...args));
  mountUpSocket.register('updateEffectFromIdOnToken', (...args) => API.updateEffectFromIdOnTokenArr(...args));
  mountUpSocket.register('updateEffectFromNameOnToken', (...args) => API.updateEffectFromNameOnTokenArr(...args));
  mountUpSocket.register('updateActiveEffectFromIdOnToken', (...args) =>
    API.updateActiveEffectFromIdOnTokenArr(...args),
  );
  mountUpSocket.register('updateActiveEffectFromNameOnToken', (...args) =>
    API.updateActiveEffectFromNameOnTokenArr(...args),
  );
  return mountUpSocket;
}

async function callHook(inHookName, ...args) {
  const newArgs: any[] = [];
  for (let arg of args) {
    if (typeof arg === 'string') {
      const testArg = await fromUuid(arg);
      if (testArg) {
        arg = testArg;
      }
    }
    newArgs.push(arg);
  }
  return Hooks.callAll(inHookName, ...newArgs);
}
