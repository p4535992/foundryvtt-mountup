import { error, warn } from '../foundryvtt-mountup';
import { Chatter } from './chatter';
// import { SettingsForm } from './mountupForm';
import { FlagScope, MOUNT_UP_MODULE_NAME } from './settings';
import { SettingsForm } from './SettingsForm';
import { detachAllFromToken, dismountDropAll, dismountDropTarget, mountUp, moveToken } from './tokenAttacherHelper';
import { findTokenById, Flags, getTokenShape, riderLock, riderX, riderY, socketAction } from './utils';
import { canvas, game } from './settings';

/**
 * Provides all of the functionality for interacting with the game (tokens, canvas, etc.)
 */
export class MountManager {
  /**
   * Called when the mount up button was clicked on a token's HUD
   * Determines if conditions are appropriate for mounting, and executes the mount if so
   * @param {Object} hudToken - The token from which the button was clicked on the hud
   */
  static async mountUpHud(hudToken) {
    const mountToken = <Token>canvas.tokens?.controlled.find((t) => t.id == hudToken._id);
    const tokensToCheck = canvas.tokens?.controlled || [];
    for (const riderToken of tokensToCheck) {
      if (riderToken.id != mountToken.id) {
        const mountTokenTmp = <Token>findTokenById(<string>riderToken.document.getFlag(FlagScope, Flags.Mount));
        // check that the new rider isn't already a rider of a different mount
        if (this.isaRider(riderToken.id) && !this.isRidersMount(riderToken.id, hudToken._id)) {
          warn(`Couldn't mount '${riderToken.name}' on to '${hudToken.name}' because \
                        it is already mounted to '${mountTokenTmp.name}'.`);
          // MOD 4535992 ADD CHECK
          // const mountTokenTmp = findTokenById(<string>riderToken.document.getFlag(FlagScope, Flags.Mount));
          if (mountToken.id != mountTokenTmp.id) {
            continue;
          }
        }
        if (this.isAncestor(mountToken.id, riderToken.id)) {
          continue;
        }
        let riders: string[] = <string[]>mountToken.document.getFlag(FlagScope, Flags.Riders);
        if (riders == undefined) {
          riders = [];
        }
        if (!riders.includes(riderToken.id)) {
          riders.push(riderToken.id);
        }
        await mountToken.document.unsetFlag(FlagScope, Flags.Riders);
        await mountToken.document.setFlag(FlagScope, Flags.Riders, riders);
        await riderToken.document.setFlag(FlagScope, Flags.Mount, mountToken.id);
        if (!riderToken.document.getFlag(FlagScope, Flags.OrigSize)) {
          await riderToken.document.setFlag(FlagScope, Flags.OrigSize, { w: riderToken.w, h: riderToken.h });
        }

        // CALL TOKEN ATTACHER
        await mountUp(riderToken, mountToken);

        Chatter.mountMessage(riderToken.id, mountToken.id);

        // // shrink the rider if needed
        // if (riderToken.w >= mountToken.w || riderToken.h >= mountToken.h) {
        //   const grid = <number>canvas.scene?.data.grid;
        //   const newWidth = mountToken.w / 2 / grid;
        //   const newHeight = mountToken.h / 2 / grid;
        //   await riderToken.document.update({
        //     width: newWidth,
        //     height: newHeight,
        //   });
        //   riderToken.zIndex = mountToken.zIndex + 10;
        // }

        // const loc: { x; y } = await this.getRiderInitialLocation(riderToken, mountToken);
        await riderToken.document.setFlag(FlagScope, Flags.MountMove, true);
        // await riderToken.document.update({
        //   x: loc.x,
        //   y: loc.y,
        // });
      }
    }

    mountToken.parent.sortChildren();
  }

  static async dismount(hudToken) {
    const riderToken: Token = findTokenById(hudToken._id);
    const mountToken: Token = findTokenById(<string>riderToken.document.getFlag(FlagScope, Flags.Mount));
    // MOD 4535992
    // CALL TOKEN ATTACHER MOVED UP
    dismountDropTarget(mountToken, riderToken);
    this.doRemoveMount(riderToken, mountToken);
  }

  static async removeAllRiders(hudToken) {
    const mountToken: Token = findTokenById(hudToken._id);
    // CALL TOKEN ATTACHER
    dismountDropAll(mountToken);
    const riders: string[] = <string[]>mountToken.document.getFlag(FlagScope, Flags.Riders);
    for (const riderId of riders) {
      const riderToken = findTokenById(riderId);
      // MOD 4535992
      this.doRemoveMount(riderToken, mountToken);
    }
  }

  /**
   * Creates a link between the rider and mount and moves the rider onto the mount
   * @param {object} riderToken - The rider token
   * @param {object} mountToken - The mount token
   */
  static async doCreateMount(riderToken: Token, mountToken: Token) {
    let riders = <string[]>mountToken.document.getFlag(FlagScope, Flags.Riders);
    if (riders == undefined) riders = [];
    if (!riders.includes(riderToken.id)) {
      riders.push(riderToken.id);
    }
    await mountToken.document.setFlag(FlagScope, Flags.Riders, riders);
    console.log(riders);
    await mountToken.document.update({ flags: { mountup: { riders: riders } } });
    await riderToken.document.setFlag(FlagScope, Flags.Mount, mountToken.id);
    if (!riderToken.document.getFlag(FlagScope, Flags.OrigSize)) {
      await riderToken.document.setFlag(FlagScope, Flags.OrigSize, { w: riderToken.w, h: riderToken.h });
    }

    // NO NEED ANYMORE TOKEN ATTACHER DO THE WORK
    // this.moveRiderToMount(riderToken, { x: mountToken.x, y: mountToken.y }, null, null, null);

    // CALL TOKEN ATTACHER MOVED UP
    await mountUp(riderToken, mountToken);

    Chatter.mountMessage(riderToken.id, mountToken.id);
    return true;
  }

  /**
   * Removes a link between the rider and mount and restores the rider's size if necessary
   * @param {object} riderToken - The rider token
   * @param {object} mountToken - The mount token
   */
  static async doRemoveMount(riderToken: Token, mountToken: Token) {
    if (!riderToken || !mountToken) {
      return;
    }
    await riderToken.document.setFlag(FlagScope, Flags.MountMove, true);
    this.restoreRiderSize(riderToken);

    // CALL TOKEN ATTACHER MOVED UP
    dismountDropTarget(mountToken, riderToken);

    Chatter.dismountMessage(riderToken.id, mountToken.id);
    const riders = <string[]>mountToken.document.getFlag(FlagScope, Flags.Riders);
    await mountToken.document.unsetFlag(FlagScope, Flags.Riders);
    riders.splice(riders.indexOf(riderToken.id));
    await mountToken.document.setFlag(FlagScope, Flags.Riders, riders);
    await riderToken.document.unsetFlag(FlagScope, Flags.Mount);
    await riderToken.document.unsetFlag(FlagScope, Flags.OrigSize);

    // MOD 4535992 FORCE SHRINK TO OTHERS RIDERS
    //let riders = <string[]>mountToken.document.getFlag(FlagScope, Flags.Riders);
    // for (const riderTmp of riders) {
    //   const riderTokenTmp: Token = findTokenById(riderTmp);
    //   if (riders.includes(riderTokenTmp.id)) {
    //     // shrink the rider if needed
    //     if (riderTokenTmp.w >= mountToken.w || riderTokenTmp.h >= mountToken.h) {
    //       const grid = <number>canvas.scene?.data.grid;
    //       const newWidth = mountToken.w / 2 / grid;
    //       const newHeight = mountToken.h / 2 / grid;
    //       await riderTokenTmp.document.update({
    //         width: newWidth,
    //         height: newHeight,
    //       });
    //       riderTokenTmp.zIndex = mountToken.zIndex + 10;
    //     }
    //   }
    // }
    // END MOD 4535992 FORCE SHRINK TO OTHERS RIDERS

    return true;
  }

  /**
   * Restores the size of a mount's rider token to original size
   * @param {Token} riderToken - The rider token who's size needs to be restored
   */
  static async restoreRiderSize(riderToken: Token) {
    // MOD 4535992 ADD CHECK FOR RIDERS FLAGS
    const mountToken = findTokenById(<string>riderToken.document.getFlag(FlagScope, Flags.Mount));
    const riders = <string[]>mountToken.document.getFlag(FlagScope, Flags.Riders);
    if (riders && riders.includes(riderToken.id)) {
      // let mount = findTokenById(riderToken);
      // let rider = findTokenById(<string[]>mount.document.getFlag(FlagScope, Flags.Riders));
      const origsize = <{ w; h }>riderToken.document.getFlag(FlagScope, Flags.OrigSize);
      // MOD 4535992 REMOVED IF
      //if (riderToken.w < origsize.w || riderToken.h < origsize.h) {
      const grid = <number>canvas.scene?.data.grid;
      const newWidth = riderToken.w < origsize.w ? origsize.w : riderToken.w;
      const newHeight = riderToken.h < origsize.h ? origsize.h : riderToken.h;

      await riderToken.document.update({
        width: newWidth / grid,
        height: newHeight / grid,
      });
      // }

      riderToken.parent.sortChildren();
    }
  }

  /**
   * Called when a token is deleted, checks if the token is part of any ride link, and breaks said link
   * @param {Object} token - The token being deleted
   */
  static async handleTokenDelete(tokenId: string) {
    if (tokenId) {
      const token = findTokenById(tokenId);

      if (!token) {
        return true;
      }

      if (this.isaRider(token.id)) {
        const mount = findTokenById(<string>token.document.getFlag(FlagScope, Flags.Mount));
        // MOD 4535992 CHECK IF TOKEN IS ALREADY DELETED
        if (mount) {
          await mount.document.unsetFlag(FlagScope, Flags.Riders);
        }
      }

      if (this.isaMount(token.id)) {
        const riders = <string[]>token.document.getFlag(FlagScope, Flags.Riders);
        for (const riderTmp in riders) {
          const rider: Token = findTokenById(riderTmp);
          // MOD 4535992 CHECK IF TOKEN IS ALREADY DELETED
          if (rider) {
            await rider.document.unsetFlag(FlagScope, Flags.Mount);
            await rider.document.unsetFlag(FlagScope, Flags.OrigSize);
          }
        }
      }

      return true;
    } else {
      return false;
    }
  }

  /**
   * Pops all rider tokens on top of their mount tokens (canvas wide)
   */
  static async popAllRiders() {
    await canvas.tokens?.placeables.forEach((token) => {
      if (this.isaMount(token.id) && !this.isaRider(token.id)) {
        this.popRider(token.id);
      }
    });
  }

  /**
   * Recursively pops a mount's riders on the z-index
   * @param {string} mountId - The ID of the mount token
   */
  static async popRider(mountId: string, callcount = 0) {
    if (callcount > 100) {
      error('Pop riders called too many times. Breaking all rides for safety.');
      canvas.tokens?.placeables.forEach((t: Token) => {
        t.document.unsetFlag(MOUNT_UP_MODULE_NAME, Flags.Riders);
        t.document.unsetFlag(MOUNT_UP_MODULE_NAME, Flags.Mount);
      });
      return true;
    }
    const mountToken: Token = findTokenById(mountId);
    const riders: string[] = <string[]>mountToken.document.getFlag(FlagScope, Flags.Riders);
    for (const riderId of riders) {
      const riderToken = findTokenById(riderId);
      if (riderToken) {
        riderToken.zIndex = mountToken.zIndex + 10;
      }

      if (riderToken && this.isaMount(riderToken.id)) {
        //this.popRider(riderToken.id, callcount += 1);
        callcount += 1;
        // CALL TOKEN ATTACHER
        dismountDropTarget(mountToken, riderToken);
        this.doRemoveMount(riderToken, mountToken);
      }

      if (riderToken && riderToken.owner) {
        await riderToken.document.unsetFlag(FlagScope, Flags.MountMove);
      }
    }

    mountToken.parent.sortChildren();

    return true;
  }

  static async doPostTokenUpdate(tokenId: string, updateData) {
    if (this.isaRider(tokenId)) {
      const riderToken = findTokenById(tokenId);
      const mountToken = findTokenById(<string>riderToken.document.getFlag(FlagScope, Flags.Mount));
      // MOD 4535992 ADD CHECK FOR RIDERS FLAGS
      if (mountToken) {
        const riders: string[] = <string[]>mountToken.document.getFlag(FlagScope, Flags.Riders);
        // if (riders && riders.includes(riderToken.id)) {
        //   // shrink the rider if needed
        //   if (riderToken.w >= mountToken.w || riderToken.h >= mountToken.h) {
        //     const grid = <number>canvas.scene?.data.grid;
        //     const newWidth = mountToken.w / 2 / grid;
        //     const newHeight = mountToken.h / 2 / grid;
        //     await riderToken.document.update({
        //       width: newWidth,
        //       height: newHeight,
        //     });
        //     riderToken.zIndex = mountToken.zIndex + 10;
        //   }
        //   // MOD 4535992 SET UP A OFFSET MORE EASY TO SEE IF MORE TOKEN ON THE SAME MOUNT
        //   // let riders = <string[]>mountToken.document.document.getFlag(FlagScope, Flags.Riders);
        //   // let index = riders.indexOf(riderToken.id); // 1
        //   // let offsetM = index;
        //   // if(!updateData){
        //   //     updateData = {
        //   //         x: riderToken.x,
        //   //         y: riderToken.y
        //   //     };
        //   // }

        //   // const mountLocation = { x: mountToken.x, y: mountToken.y };
        //   // const offset = { x: mountLocation.x - riderToken.x, y: mountLocation.y - riderToken.y };
        //   // const rotation = SettingsForm.getRiderRotate() ? updateData.rotation : riderToken.data.rotation;

        //   // let mount = mountToken;//targets[0];
        //   // let newCoords = {
        //   //     x:riderToken.x,
        //   //     y:riderToken.y
        //   // };
        //   // if(mount.x+mount.w-riderToken.w < riderToken.x){
        //   //     newCoords.x = mount.x+mount.w-riderToken.w;
        //   // }
        //   // else if(mount.x > riderToken.x){
        //   //     newCoords.x = mount.x;
        //   // }
        //   // if(mount.y+mount.h-riderToken.h < riderToken.y){
        //   //     newCoords.y = mount.y+mount.h-riderToken.h;
        //   // }
        //   // else if(mount.y > riderToken.y){
        //   //     newCoords.y = mount.y;
        //   // }
        //   // let newX = newCoords.x;
        //   // let newY = newCoords.y;

        //   // await riderToken.update({
        //   //     x: newX === undefined ? mountLocation.x - offset.x : newX - offset.x,
        //   //     y: newY === undefined ? mountLocation.y - offset.y : newY - offset.y,
        //   //     rotation: rotation
        //   // });
        //   // riderToken.zIndex = mountToken.zIndex + 10;
        //   // END MOD 4535992 SET UP OFFSET MORE EASY TO SEE IF MORE TOKEN ON THE SAME MOUNT

        //   // MOD 4535992 REMOVED

        //   // updateData.x = (updateData.x !== undefined ? updateData.x : mountToken.x);
        //   // updateData.y = (updateData.y !== undefined ? updateData.y : mountToken.y);
        //   // updateData.rotation = updateData.rotation !== undefined ? updateData.rotation : mountToken.data.rotation;

        //   // game.socket['emit'](socketName, {
        //   //     mode: socketAction.UpdateToken,
        //   //     riderId: riderToken.id,
        //   //     // updateData: updateData
        //   //     // mountId: mountToken.id,
        //   //     // x: updateData.x - offset.x,
        //   //     // y: updateData.y - offset.y,
        //   //     x: newX - offset.x,
        //   //     y: newY - offset.y,
        //   //     rotation: rotation
        //   // });
        // }
      }
    }
  }

  /**
   * Called when a token is moved in the game.
   * Determines if the token being moved is a mount - if it is, moves the rider to match
   * @param {String} tokenId - The ID of the token being moved
   * @param {Object} updateData - Update data being sent by the game
   */
  static async doTokenUpdateOnlyCheckBoundHandler(tokenId, updateData) {
    if (this.isaRider(tokenId)) {
      const riderToken = findTokenById(tokenId);
      const mountToken = findTokenById(<string>riderToken.document.getFlag(FlagScope, Flags.Mount));
      // MOD 4535992 ADD CHECK FOR RIDERS FLAGS
      if (mountToken) {
        const riders = <string[]>mountToken.document.getFlag(FlagScope, Flags.Riders);
        if (riders && riders.includes(riderToken.id)) {
          const newLocation = {
            x: updateData.x !== undefined ? updateData.x : riderToken.x,
            y: updateData.y !== undefined ? updateData.y : riderToken.y,
          };

          if (!riderToken.document.getFlag(FlagScope, Flags.MountMove)) {
            if (
              !canvas.tokens?.controlled
                .map((t) => t.id)
                .includes(<string>riderToken.document.getFlag(FlagScope, Flags.Mount))
            ) {
              switch (SettingsForm.getRiderLock()) {
                case riderLock.NoLock:
                  break;
                case riderLock.LockLocation:
                  delete updateData.x;
                  delete updateData.y;
                  warn(`${riderToken.name} is currently locked to a mount`);
                  break;
                case riderLock.LockBounds:
                  if (!this.isInsideTokenBounds(newLocation, mountToken)) {
                    delete updateData.x;
                    delete updateData.y;
                    warn(`${riderToken.name} is currently locked inside a mount`);
                  }
                  break;
                case riderLock.Dismount:
                  if (!this.isInsideTokenBounds(newLocation, mountToken)) {
                    this.doRemoveMount(riderToken, mountToken);
                  }
              }
            }
          }
        }
      }
    }
  }

  static isInsideTokenBounds(location: { x; y }, token: Token) {
    const x = token.x + token.w;
    const y = token.y + token.h;

    return (
      location.x >= token.x && location.x < token.x + token.w && location.y >= token.y && location.y < token.y + token.h
    );
  }

  /**
   * Returns true if the token is currently serving as a mount in any existing ride link
   * @param {String} tokenId - The ID of the token to evaluate
   */
  static isaMount(tokenId: string) {
    const token = findTokenById(tokenId);
    if (token) {
      const riders: string[] = <string[]>token.document.getFlag(FlagScope, Flags.Riders);
      return <string[]>token.document.getFlag(FlagScope, Flags.Riders) != undefined && riders.length > 0;
    } else {
      return false;
    }
  }

  /**
   * Returns true if the token is currenty serving as a rider in any existing ride link
   * @param {String} tokenId - The ID of the token to evaluate
   */
  static isaRider(tokenId) {
    const token = findTokenById(tokenId);
    if (token) {
      return token.document.getFlag(MOUNT_UP_MODULE_NAME, Flags.Mount) != undefined;
    } else {
      return false;
    }
  }

  /**
   * Returns true if the specified mount belongs to the specified rider
   * @param {string} riderId - The rider token's ID
   * @param {string} mountId - The mount token's ID
   */
  static isRidersMount(riderId, mountId) {
    const rider = findTokenById(riderId);
    const mount = findTokenById(mountId);
    return <string>rider.document.getFlag(FlagScope, Flags.Mount) == mount.id;
  }

  // /**
  //  * Gets the correct rider placement coordinates based on the mount's position and movement
  //  * @param {token} riderToken - The rider token
  //  * @param {token} mountToken - The mount token
  //  */
  // static async getRiderInitialLocation(riderToken: Token, mountToken: Token): Promise<{ x; y }> {
  //   const loc = { x: mountToken.x, y: mountToken.y };

  //   // MOD 4535992 SET UP A OFFSET MORE EASY TO SEE IF MORE TOKEN ON THE SAME MOUNT
  //   const riders = <string[]>mountToken.document.getFlag(FlagScope, Flags.Riders);
  //   const index = riders.indexOf(riderToken.id); // 1
  //   const offset: number = index;
  //   // END MOD 4535992 SET UP OFFSET MORE EASY TO SEE IF MORE TOKEN ON THE SAME MOUNT

  //   switch (SettingsForm.getRiderX()) {
  //     case riderX.Center:
  //       // eslint-disable-next-line no-case-declarations
  //       const mountCenter = getTokenShape(mountToken); //mountToken.getCenter(mountToken.x, mountToken.y);
  //       loc.x = mountCenter.x - riderToken.w / 2 + offset;
  //       break;
  //     case riderX.Right:
  //       loc.x = mountToken.x + mountToken.w - riderToken.w + offset;
  //       break;
  //   }

  //   switch (SettingsForm.getRiderY()) {
  //     case riderY.Center:
  //       // eslint-disable-next-line no-case-declarations
  //       const mountCenter = getTokenShape(mountToken); //mountToken.getCenter(mountToken.x, mountToken.y);
  //       loc.y = mountCenter.y - riderToken.h / 2 + offset;
  //       break;
  //     case riderY.Bottom:
  //       loc.y = mountToken.y + mountToken.h - riderToken.h + offset;
  //       break;
  //   }
  //   return loc;
  // }

  /**
   * Returns true if the tokens are related via a long mount chain
   * @param {string} childId - The ID of the child
   * @param {string} ancestorId - The ID of the ancestor
   */
  static isAncestor(childId: string, ancestorId: string) {
    if (this.isaRider(childId)) {
      const child: Token = findTokenById(childId);
      const parent: Token = findTokenById(<string>child.document.getFlag(FlagScope, Flags.Mount));
      if (parent.id == ancestorId) {
        return true;
      }
      return this.isAncestor(parent.id, ancestorId);
    }
    return false;
  }
}
