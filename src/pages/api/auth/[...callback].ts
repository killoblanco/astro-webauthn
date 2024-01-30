import type { APIRoute } from "astro";
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';

const catResponse = (status: ResponseInit["status"]) => new Response(
    JSON.stringify({ cat: `https://http.cat/${status}` }),
    { status }
);

const rpID = 'k32xf1qx-4321.use2.devtunnels.ms';

export const GET: APIRoute = async ({ params, locals, url }) => {
    const { callback } = params;

    if (callback === 'reg-opts') {
        const aid = url.searchParams.get('aid');

        if (!aid) return catResponse(400);
        // const authUser = await getAuthUser(aid);

        // const excludedCredentials = await getUserAuthenticators(authUser.uid);

        const options = await generateRegistrationOptions({
            rpName: 'Astro Web AuthN API Demo',
            rpID,
            userID: aid,
            userName: aid,
            attestationType: 'none',
            // excludeCredentials
        });

        console.log({
            type: typeof options.challenge,
            challenge: options.challenge
        })

        // await setTmpChallenge(aid, options.challenge);

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
                expectedOrigin: `https://${rpID}`,
                expectedRPID: rpID
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