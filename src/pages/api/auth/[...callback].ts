import type { APIRoute } from "astro";
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import * as authRepo from '@/auth/repo'

const catResponse = (status: ResponseInit["status"]) => new Response(
    JSON.stringify({ cat: `https://http.cat/${status}` }),
    { status }
);

export const GET: APIRoute = async ({ params, url }) => {
    const { callback } = params;

    if (callback === 'reg-opts') {
        const aid = url.searchParams.get('aid');

        if (!aid) return catResponse(400);
        // const authUser = await getAuthUser(aid);

        // const excludedCredentials = await getUserAuthenticators(authUser.uid);

        const options = await generateRegistrationOptions({
            rpName: 'Astro Web AuthN API Demo',
            rpID: import.meta.env.AUTH_SECURE_SOURCE,
            userID: aid,
            userName: aid,
            attestationType: 'none',
            // excludeCredentials
        });

        await authRepo.setTmpNonce(aid, options.challenge);

        return new Response(JSON.stringify(options));
    }

    return catResponse(200);
}

export const POST: APIRoute = async ({ params, request }) => {
    const { callback } = params;

    if (callback === 'verify-reg') {
        const { attResp, aid } = await request.json();

        if (!attResp || !aid) return catResponse(401);
        // const authUser = await getAuthUser(aid);

        let verification;
        try {
            verification = await verifyRegistrationResponse({
                response: attResp,
                expectedChallenge: 'authUser.challenge',
                expectedOrigin: `https://${import.meta.env.AUTH_SECURE_SOURCE}`,
                expectedRPID: import.meta.env.AUTH_SECURE_SOURCE
            })
        } catch (error) {
            return catResponse(400);
        }

        const { verified, registrationInfo } = verification;

        if (!verified) return catResponse(401);

        // Also removes tmpChallenge
        // await saveNewUserAuthenticator(authUser, {
        //     credentialID: registrationInfo?.credentialID,
        //     credentialPublicKey: registrationInfo?.credentialPublicKey,
        //     counter: registrationInfo?.counter,
        //     credentialDeviceType: registrationInfo?.credentialDeviceType,
        //     credentialBackedUp: registrationInfo?.credentialBackedUp,
        //     transports: attResp.response.transports,
        // });

        return new Response(JSON.stringify({ verified }));
    }

    return catResponse(200);
};