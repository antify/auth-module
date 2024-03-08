import type {H3Event} from "h3";
import {isAuthorizedHandler, isLoggedInHandler} from "../../../src/runtime/server/handlers";
import {PermissionId} from "~/server/permissions";
import {getContext} from "#database-module";

export default defineEventHandler(async (event: H3Event) => {
	const {provider, tenantId} = getContext(event);

	await isLoggedInHandler(event);
	await isAuthorizedHandler(event, PermissionId.CAN_READ_SECRET_DATA, provider, tenantId);

	return {
		default: "Secret data!",
	};
});
