import type { APIRoute } from "astro";
import { generateRegistrationOptions } from '@simplewebauthn/server';

const catResponse = (status: ResponseInit["status"]) => new Response(
    JSON.stringify({ cat: `https://http.cat/${status}` }),
    { status }
);

export const GET: APIRoute = async ({ params, locals, url }) => {
    const { callback } = params;

    if (callback === 'reg-opts') {
        const aid = url.searchParams.get('aid');

        if (!aid) return catResponse(400);

        const options = await generateRegistrationOptions({
            rpName: 'Astro Web AuthN API Demo',
            rpID: 'k32xf1qx-4321.use2.devtunnels.ms',
            userID: aid,
            userName: aid,
            attestationType: 'none'
        });

        return new Response(JSON.stringify(options));
    }

    return catResponse(200);
}

export const POST: APIRoute = async ({ params, request }) => {
    const { callback } = params;

    if (callback === 'verify-reg') {
        const { attResp, aid } = await request.json();

        if (!attResp || !aid) return catResponse(401);

        console.log({ attResp, aid })
    }

    return catResponse(200);
};