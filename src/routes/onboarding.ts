import { FastifyRequestType, FastifyReplyType } from "fastify/types/type-provider";
import { isResponseSuccess } from "utils";

const getProfileSetting = async (request: FastifyRequestType, reply: any) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `${request?.headers?.authorization}`,
        };
        const config = {
            headers,
        };

        let data = {};
        let response = false;
        response = await request.axios.core.get("/systemsetting/profile", config);
        if (isResponseSuccess(response && response.status)) {
            data["profile_setting"] = response.data;
            const params = {
                columns: ["use_accounting"],
            };
            response = await request.axios.onboarding.post("/wizard/get-setup", params, config);
            if (isResponseSuccess(response.status)) {
                data["accounting_setting"] = response.data;
                reply.code(response.status).send(data);
            }
        } else {
            const data = {
                status: response.data.error.status,
                message: response.data.error.message,
            };
            reply.code(response.status).send(data);
        }
    } catch (err) {
        const status = err.response?.data?.statusCode ? err.response?.data?.statusCode : 500;
        const data = err?.response?.data ? err.response.data : { message: "Internal Server Error" };
        reply.code(status).send(data);
    }
};

const login = async (request: FastifyRequestType, reply: any) => {
    try {
        const headers = {
            "Content-Type": "application/json",
        };
        const config = {
            headers,
        };

        let response = false;
        response = await request.axios.core.post("/login", request.body, config);
        if (isResponseSuccess(response && response.status)) {
            reply.cookie("jwtToken", response.data.token).code(response.status).send(response.data);
        } else {
            const data = {
                status: response.data.error.status,
                message: response.data.error.message,
            };
            reply.code(response.status).send(data);
        }
    } catch (err) {
        const status = err.response?.data?.statusCode ? err.response?.data?.statusCode : 500;
        const data = err?.response?.data ? err.response.data : { message: "Internal Server Error" };
        reply.code(status).send(data);
    }
};

export { login, getProfileSetting };
