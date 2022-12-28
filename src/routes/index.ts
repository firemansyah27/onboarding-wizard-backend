import { FastifyPluginAsync } from "fastify";
import { getProfileSetting, login } from "./onboarding";

const routes: FastifyPluginAsync = async (server) => {
    server.route({
        method: "GET",
        url: "/systemsetting/profile",
        schema: {},
        preHandler: server["axios"],
        handler: getProfileSetting,
    });

    server.route({
        method: "POST",
        url: "/login",
        schema: {},
        preHandler: server["axios"],
        handler: login,
    });
};
export default routes;
