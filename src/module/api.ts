import { error } from '../foundryvtt-mountup';
import { MountManager } from './mountManager';
import { FlagScope } from './settings';
import { findTokenById, findTokenByName, Flags } from './utils';


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
        const mountToken = findTokenById(<string>rider.document.getFlag(FlagScope, Flags.Mount));
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
        const riders = <string[]>mount.document.getFlag(FlagScope, Flags.Riders);
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

    if (riderToken.document.getFlag(FlagScope, Flags.Mount) == mountToken.id) {
      dismount(riderNameOrId);
    } else {
      mount(riderNameOrId, mountNameOrId);
    }
  }

};

export default API;
