import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import { EffectChangeData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData';
import { ActorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import CONSTANTS from './constants';
import Effect, { EffectSupport } from './effects/effect';
import EffectInterface from './effects/effect-interface';
import { error, getElevationToken } from './lib/lib';
import { MountManager } from './mountManager';
import { MountupEffectDefinitions } from './mountup-effect-definition';
import { findTokenById, findTokenByName, MountUpFlags } from './utils';
import { game } from './settings';

const API = {
  effectInterface: EffectInterface,

  /**
   * Macro function to mount a rider token onto a mount token
   * @param {string} riderNameOrId - The name or the ID of the rider token
   * @param {string} mountNameOrId - The name or the ID of the mount token
   */
  mount(riderNameOrId: string, mountNameOrId: string) {
    const rider: Token = findTokenById(riderNameOrId) || findTokenByName(riderNameOrId);
    const mount: Token = findTokenById(mountNameOrId) || findTokenByName(mountNameOrId);

    const mountName = mount.name;
    const riderName = rider.name;

    if (rider) {
      if (mount) {
        if (rider.id != mount.id) {
          MountManager.doCreateMount(rider, mount);
        } else {
          error('You cannot mount a token to itself');
        }
      } else {
        error(`A token could not be found with the name or id : ${mountName}`);
      }
    } else {
      error(`A token could not be found with the name or id : ${riderName}`);
    }
  },

  /**
   * Macro function to dismount a rider token from its mount
   * @param {string} riderNameOrId - The name or the ID of the rider token
   */
  dismount(riderNameOrId: string) {
    const rider: Token = findTokenById(riderNameOrId) || findTokenByName(riderNameOrId);
    const riderName: string = rider.name;

    if (rider) {
      if (MountManager.isaRider(rider.id)) {
        const mountToken = findTokenById(<string>rider.document.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.Mount));
        MountManager.doRemoveMount(rider, mountToken);
      } else {
        error(`Token '${riderName}' is not a rider`);
      }
    } else {
      error(`A token could not be found with the name or id : ${riderName}`);
    }
  },

  /**
   * Macro function to have a mount drop its rider
   * @param {string} mountNameOrId - The name or the ID of the mount token
   */
  dropRider(mountNameOrId: string) {
    const mount: Token = findTokenById(mountNameOrId) || findTokenByName(mountNameOrId);
    const mountName: string = mount.name;

    if (mount) {
      if (MountManager.isaMount(mount.id)) {
        const riders = <string[]>mount.document.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.Riders);
        for (const rider in riders) {
          const riderToken: Token = findTokenById(rider);
          MountManager.doRemoveMount(riderToken, mount);
        }
      } else {
        error(`Token '${mountName}' is not a mount`);
      }
    } else {
      error(`A token could not be found with the name or id : ${mountName}`);
    }
  },

  /**
   * Macro function to toggle a rider mount pair
   * @param {string} riderNameOrId - The name or the ID of the rider
   * @param {string} mountNameOrId - The name or the ID of the mount
   */
  toggleMount(riderNameOrId: string, mountNameOrId: string) {
    const riderToken = findTokenById(riderNameOrId) || findTokenByName(riderNameOrId);
    const mountToken = findTokenById(mountNameOrId) || findTokenByName(mountNameOrId);

    if (riderToken.document.getFlag(CONSTANTS.MODULE_NAME, MountUpFlags.Mount) == mountToken.id) {
      API.dismount(riderNameOrId);
    } else {
      API.mount(riderNameOrId, mountNameOrId);
    }
  },

  // ======================
  // Effect Management
  // ======================

  async removeEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectArr | inAttributes must be of type array');
    }
    const [params] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffect(params);
    return result;
  },

  async toggleEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('toggleEffectArr | inAttributes must be of type array');
    }
    const [effectName, params] = inAttributes;
    const result = await this.effectInterface.toggleEffect(effectName, params);
    return result;
  },

  async addEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectArr | inAttributes must be of type array');
    }
    const [params] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.addEffect(params);
    return result;
  },

  async hasEffectAppliedArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('hasEffectAppliedArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.hasEffectApplied(effectName, uuid);
    return result;
  },

  async addEffectOnActorArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid, origin, overlay, effect] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.addEffectOnActor(
      effectName,
      uuid,
      origin,
      overlay,
      effect,
    );
    return result;
  },

  async removeEffectOnActorArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffectOnActor(effectName, uuid);
    return result;
  },

  async removeEffectFromIdOnActorArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectFromIdOnActor | inAttributes must be of type array');
    }
    const [effectId, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffectFromIdOnActor(
      effectId,
      uuid,
    );
    return result;
  },

  async toggleEffectFromIdOnActorArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectId, uuid, alwaysDelete, forceEnabled, forceDisabled] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.toggleEffectFromIdOnActor(
      effectId,
      uuid,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  },

  async findEffectByNameOnActorArr(...inAttributes: any[]): Promise<ActiveEffect | null> {
    if (!Array.isArray(inAttributes)) {
      throw error('findEffectByNameOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.findEffectByNameOnActor(
      effectName,
      uuid,
    );
    return result;
  },

  async addEffectOnTokenArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid, origin, overlay, effect] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.addEffectOnToken(
      effectName,
      uuid,
      origin,
      overlay,
      effect,
    );
    return result;
  },

  async removeEffectOnTokenArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffectOnToken(effectName, uuid);
    return result;
  },

  async removeEffectFromIdOnTokenArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectFromIdOnToken | inAttributes must be of type array');
    }
    const [effectId, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffectFromIdOnToken(
      effectId,
      uuid,
    );
    return result;
  },

  async toggleEffectFromIdOnTokenArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnTokenArr | inAttributes must be of type array');
    }
    const [effectId, uuid, alwaysDelete, forceEnabled, forceDisabled] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.toggleEffectFromIdOnToken(
      effectId,
      uuid,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  },

  async findEffectByNameOnTokenArr(...inAttributes: any[]): Promise<ActiveEffect | null> {
    if (!Array.isArray(inAttributes)) {
      throw error('findEffectByNameOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.findEffectByNameOnToken(
      effectName,
      uuid,
    );
    return result;
  },

  // ======================
  // Effect Actor Management
  // ======================
  /*
  async addEffectOnActor(actorId: string, effectName: string, effect: Effect) {
    const result = await API.effectInterface.addEffectOnActor(effectName, <string>actorId, effect);
    return result;
  }.

  async findEffectByNameOnActor(actorId: string, effectName: string): Promise<ActiveEffect | null> {
    const result = await API.effectInterface.findEffectByNameOnActor(effectName, <string>actorId);
    return result;
  },

  async hasEffectAppliedOnActor(actorId: string, effectName: string, includeDisabled:boolean) {
    const result = await API.effectInterface.hasEffectAppliedOnActor(effectName, <string>actorId, includeDisabled);
    return result;
  },

  async hasEffectAppliedFromIdOnActor(actorId: string, effectId: string, includeDisabled:boolean) {
    const result = await API.effectInterface.hasEffectAppliedFromIdOnActor(effectId, <string>actorId, includeDisabled);
    return result;
  },

  async toggleEffectFromIdOnActor(
    actorId: string,
    effectId: string,
    alwaysDelete: boolean,
    forceEnabled?: boolean,
    forceDisabled?: boolean,
  ) {
    const result = await API.effectInterface.toggleEffectFromIdOnActor(
      effectId,
      <string>actorId,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  },

  async addActiveEffectOnActor(actorId: string, activeEffect: ActiveEffect) {
    const result = API.effectInterface.addActiveEffectOnActor(<string>actorId, activeEffect.data);
    return result;
  },

  static async removeEffectOnActor(actorId: string, effectName: string) {
    const result = await API.effectInterface.removeEffectOnActor(effectName, <string>actorId);
    return result;
  }

  async removeEffectFromIdOnActor(actorId: string, effectId: string) {
    const result = await API.effectInterface.removeEffectFromIdOnActor(effectId, <string>actorId);
    return result;
  },
  */
  // ======================
  // Effect Token Management
  // ======================

  async addEffectOnToken(tokenId: string, effectName: string, effect: Effect) {
    const result = await this.effectInterface.addEffectOnToken(effectName, <string>tokenId, effect);
    return result;
  },

  async findEffectByNameOnToken(tokenId: string, effectName: string): Promise<ActiveEffect | null> {
    const result = await this.effectInterface.findEffectByNameOnToken(effectName, <string>tokenId);
    return result;
  },

  async hasEffectAppliedOnToken(tokenId: string, effectName: string, includeDisabled: boolean) {
    const result = await this.effectInterface.hasEffectAppliedOnToken(effectName, <string>tokenId, includeDisabled);
    return result;
  },

  async hasEffectAppliedFromIdOnToken(tokenId: string, effectId: string, includeDisabled: boolean) {
    const result = await this.effectInterface.hasEffectAppliedFromIdOnToken(effectId, <string>tokenId, includeDisabled);
    return result;
  },

  async toggleEffectFromIdOnToken(
    tokenId: string,
    effectId: string,
    alwaysDelete: boolean,
    forceEnabled?: boolean,
    forceDisabled?: boolean,
  ) {
    const result = await this.effectInterface.toggleEffectFromIdOnToken(
      effectId,
      <string>tokenId,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  },

  async addActiveEffectOnToken(tokenId: string, activeEffect: ActiveEffect) {
    const result = this.effectInterface.addActiveEffectOnToken(<string>tokenId, activeEffect.data);
    return result;
  },

  async removeEffectOnToken(tokenId: string, effectName: string) {
    const result = await this.effectInterface.removeEffectOnToken(effectName, <string>tokenId);
    return result;
  },

  async removeEffectFromIdOnToken(tokenId: string, effectId: string) {
    const result = await this.effectInterface.removeEffectFromIdOnToken(effectId, <string>tokenId);
    return result;
  },

  // =======================================================================================

  async applyFlying(token: Token) {
    if (game.modules.get('tokenmagic')?.active) {
      if (!token) {
        token = <Token>canvas?.tokens?.controlled[0];
      }
      const elevation = getElevationToken(token);
      // const filter = elevation > 5 ? true : false;
      const tokenMagicEffectId = CONSTANTS.TM_FLYING;
      const params = MountupEffectDefinitions.tokenMagicParamsFlying(tokenMagicEffectId, elevation);
      //@ts-ignore
      await TokenMagic.addUpdateFilters(token, params);
      //@ts-ignore
      // await tokenInstance.TMFXdeleteFilters(tokenMagicEffectId);
      // if (filter) {
      //  //@ts-ignore
      //  await TokenMagic.addUpdateFilters(tokenInstance, params);
      // }
    }
  },

  async removeFlying(token: Token) {
    if (game.modules.get('tokenmagic')?.active) {
      if (!token) {
        token = <Token>canvas?.tokens?.controlled[0];
      }
      //@ts-ignore
      await TokenMagic.deleteFilters(token, CONSTANTS.TM_FLYING);
    }
  },
};

export default API;
