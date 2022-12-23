import { FastifyPluginAsync } from "fastify";
import { getProfileSetting } from "./onboarding";
import { Type } from "@sinclair/typebox";

const routes: FastifyPluginAsync = async (server) => {
    server.route({
        method: "GET",
        url: "/systemsetting/profile",
        schema: {},
        preHandler: server["axios"],
        handler: getProfileSetting,
    });
};
export default routes;
