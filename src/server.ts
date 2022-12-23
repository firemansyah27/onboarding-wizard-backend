import fastify from "fastify";
import config from "./plugins/config.js";
import proxy from "@fastify/http-proxy";
import cors from "@fastify/cors";
import fastifyAxios from "lib/fastify-axios.js";
import routes from "routes/index.js";

const server = fastify({
    ajv: {
        customOptions: {
            removeAdditional: "all",
            coerceTypes: true,
            useDefaults: true,
        },
    },
    logger: {
        level: process.env.LOG_LEVEL,
    },
});

await server.register(config);

await server
    //CORS
    .register(cors, {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    });

await server.register(proxy, {
    upstream: `${process.env.URL_CORE}` as string,
    prefix: "/core", // optional
    http2: false, // optional
});

await server.register(proxy, {
    upstream: `${process.env.URL_ONBOARDING}` as string,
    prefix: "/onboarding", // optional
    http2: false, // optional
});

await server.register(fastifyAxios, {
    clients: {
        core: {
            baseURL: `${process.env.URL_CORE}`,
        },
        onboarding: {
            baseURL: `${process.env.URL_ONBOARDING}`,
        },
    },
});

await server.register(routes);
await server.ready();

export default server;
