import { SettingsForm } from './mountupForm';
import { findTokenById } from './utils';

/**
 * Provides functionality for sending chat messages
 */
export class Chatter {
  /**
   * Attempts to display a chat message notifying about a mount action
   * @param {String} riderId - The ID of the rider
   * @param {String} mountId - The ID of the mount
   */
  static mountMessage(riderId, mountId) {
    if (SettingsForm.getShouldChat()) {
      const icon = `<span class="fa-stack"><i class="fas ${SettingsForm.getIconClass()} fa-stack-1x"></i></span>&nbsp;`;
      this.sendChatMessage(icon + SettingsForm.getMountMessage(), riderId, mountId);
    }
  }

  /**
   * Attempts to display a chat message notifying about a dismount action
   * @param {String} riderId - The ID of the rider
   * @param {String} mountId - The ID of the mount
   */
  static dismountMessage(riderId, mountId) {
    if (SettingsForm.getShouldChat()) {
      const icon = `<span class="fa-stack" >
                            <i class="fas ${SettingsForm.getIconClass()} fa-stack-1x"></i>
                            <i class="fas fa-slash fa-stack-1x" style="color: tomato"></i>
                        </span>&nbsp;`;
      this.sendChatMessage(icon + SettingsForm.getDismountMessage(), riderId, mountId);
    }
  }

  /**
   * Sends a preformatted message to the chat log
   * @param {string} message - The message to be sent
   * @param {string} riderId - The ID of the rider token
   * @param {string} mountId - The ID of the mount token
   */
  static sendChatMessage(message, riderId, mountId) {
    const rider = findTokenById(riderId);
    const mount = findTokenById(mountId);

    message = message.replace('{mount}', mount.data.name).replace('{rider}', rider.data.name);

    ChatMessage.create({
      content: message,
    });
  }
}
