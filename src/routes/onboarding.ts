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
        }
        reply.code(response.status).send(response.data);
    } catch (err) {
        console.log(err);
        reply.code(500).send({ error: err });
    }
};

export { getProfileSetting };
