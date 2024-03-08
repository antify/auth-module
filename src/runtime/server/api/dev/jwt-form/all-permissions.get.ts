export default defineEventHandler(async (event) => {
	// TODO:: On dev mode only!!
	return useRuntimeConfig().authModule.permissions;
});
