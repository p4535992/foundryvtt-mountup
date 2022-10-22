import CONSTANTS from "./constants";
import API from "./api";
import { debug } from "./lib/lib";

export let mountUpSocket;

export function registerSocket() {
	debug("Registered mountUpSocket");
	if (mountUpSocket) {
		return mountUpSocket;
	}
	//@ts-ignore
	mountUpSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

	return mountUpSocket;
}
