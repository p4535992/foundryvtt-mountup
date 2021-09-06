import { MOUNT_UP_MODULE_NAME } from "./settings.js";
let socket;
// getGame().socket.on(socketName, (data) => {
//   if (game.user.isGM) {
//     switch (data.mode) {
//       case socketAction.UpdateToken:
//         findTokenById(data.riderId).update({
//           x: data.x,
//           y: data.y,
//           rotation: data.rotation,
//         });
//     }
//   }
// });
Hooks.once('socketlib.ready', () => {
    //@ts-ignore
    socket = socketlib.registerModule(MOUNT_UP_MODULE_NAME);
    // socket.register("updateCombatantDragRulerFlags", _socketUpdateCombatantDragRulerFlags);
    // socket.register("recalculate", _socketRecalculate);
});
// export function updateCombatantDragRulerFlags(combat, updates) {
// 	const combatId = combat.id;
// 	// TODO Check if canvas.tokens.get is still neccessary in future foundry versions
// 	return socket.executeAsGM(_socketUpdateCombatantDragRulerFlags, combatId, updates)
// 	             .then(() => currentSpeedProvider.onMovementHistoryUpdate(updates.map(update => canvas.tokens.get(combat.combatants.get(update._id).token.id))));
// }
// async function _socketUpdateCombatantDragRulerFlags(combatId, updates) {
// 	const user = game.users.get(this.socketdata.userId);
// 	const combat = game.combats.get(combatId);
// 	const requestedUpdates = updates.length;
// 	updates = updates.filter(update => {
// 		const actor = combat.combatants.get(update._id).actor;
// 		if (!actor)
// 			return false;
// 		return actor.testUserPermission(user, "OWNER");
// 	});
// 	if (updates.length !== requestedUpdates) {
// 		console.warn(`Some of the movement history updates requested by user '${game.users.get(this.socketdata.userId).name}' were not performed because the user lacks owner permissions for those tokens`);
// 	}
// 	updates = updates.map(update => {
// 		return {_id: update._id, flags: {dragRuler: update.dragRulerFlags}};
// 	});
// 	await combat.updateEmbeddedDocuments("Combatant", updates, {diff: false});
// }
// export function recalculate(tokens) {
// 	socket.executeForEveryone(_socketRecalculate, tokens ? tokens.map(token => token.id) : undefined);
// }
// function _socketRecalculate(data) {
//   if (game.user.isGM) {
//     switch (data.mode) {
//       case socketAction.UpdateToken:
//         {
//         findTokenById(data.riderId).update({
//           x: data.x,
//           y: data.y,
//           rotation: data.rotation,
//         });
//       }
//     }
//   }
// }
