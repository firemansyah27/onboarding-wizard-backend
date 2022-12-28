import fastify from "fastify";
import config from "./plugins/config.js";
import proxy from "@fastify/http-proxy";
import cors from "@fastify/cors";
import fastifyAxios from "lib/fastify-axios.js";
import routes from "routes/index.js";
import cookie from "@fastify/cookie";
import { parseCookie } from "utils/cookie.js";

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
    .register(cookie, {
        secret: `${process.env.API_SECRET}`,
        hook: "onRequest",
        parseOptions: {},
    });

await server
    //CORS
    .register(cors, {
        origin: ["http://localhost:3000"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    });

await server.register(proxy, {
    upstream: `${process.env.URL_CORE}` as string,
    prefix: "/core", // optional
    http2: false, // optional
    replyOptions: {
        rewriteRequestHeaders: (originalReq, headers) => {
            const newHeaders = { ...headers };
            if (headers?.cookie) {
                const cookies = parseCookie(headers?.cookie);
                if (cookies?.jwtToken) {
                    newHeaders.authorization = `Bearer ${cookies.jwtToken}`;
                }
            }
            return newHeaders;
        },
    },
});

await server.register(proxy, {
    upstream: `${process.env.URL_ONBOARDING}` as string,
    prefix: "/onboarding", // optional
    http2: false, // optional
    replyOptions: {
        rewriteRequestHeaders: (originalReq, headers) => {
            const newHeaders = { ...headers };
            if (headers?.cookie) {
                const cookies = parseCookie(headers?.cookie);
                if (cookies?.jwtToken) {
                    newHeaders.authorization = `Bearer ${cookies.jwtToken}`;
                }
            }
            return newHeaders;
        },
    },
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
