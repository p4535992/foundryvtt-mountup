// import { SettingsForm } from './mountupForm.ts';
import { findTokenById } from './utils';
import { MOUNT_UP_MODULE_NAME } from './settings';
import { game } from './settings';

/**
 * Provides functionality for sending chat messages
 */
export class Chatter {
  _shouldChat: boolean;
  _iconClass: string;
  _mountMessage: string;
  _dismountMessage: string;

  constructor() {
    this._shouldChat = <boolean>game.settings.get(MOUNT_UP_MODULE_NAME, 'should-chat');
    this._iconClass = <string>game.settings.get(MOUNT_UP_MODULE_NAME, 'icon');
    this._mountMessage = <string>game.settings.get(MOUNT_UP_MODULE_NAME, 'mount-message');
    this._dismountMessage = <string>game.settings.get(MOUNT_UP_MODULE_NAME, 'dismount-message');
  }

  /**
   * Attempts to display a chat message notifying about a mount action
   * @param {String} riderId - The ID of the rider
   * @param {String} mountId - The ID of the mount
   */
  mountMessage(riderId, mountId) {
    if (this._shouldChat) {
      const icon = `<span class="fa-stack"><i class="fas ${this._iconClass} fa-stack-1x"></i></span>&nbsp;`;
      this.sendChatMessage(icon + this._mountMessage, riderId, mountId);
    }
  }

  /**
   * Attempts to display a chat message notifying about a dismount action
   * @param {String} riderId - The ID of the rider
   * @param {String} mountId - The ID of the mount
   */
  dismountMessage(riderId, mountId) {
    if (this._shouldChat) {
      const icon = `<span class="fa-stack" >
                            <i class="fas ${this._iconClass} fa-stack-1x"></i>
                            <i class="fas fa-slash fa-stack-1x" style="color: tomato"></i>
                        </span>&nbsp;`;
      this.sendChatMessage(icon + this._dismountMessage, riderId, mountId);
    }
  }

  /**
   * Sends a preformatted message to the chat log
   * @param {string} message - The message to be sent
   * @param {string} riderId - The ID of the rider token
   * @param {string} mountId - The ID of the mount token
   */
  sendChatMessage(message, riderId, mountId) {
    const rider = findTokenById(riderId);
    const mount = findTokenById(mountId);

    message = message.replace('{mount}', mount.data.name).replace('{rider}', rider.data.name);

    ChatMessage.create({
      content: message,
    });
  }
}
