import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { StreamClient } from '@stream-io/node-sdk';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

export const POST = async (req: NextRequest) => {
    try {
        const token = await getToken({ req });

        if (!token || !token.sub) {
            return new NextResponse("User is not authenticated", { status: 401 });
        }

        if (!STREAM_API_KEY || !STREAM_API_SECRET) {
            return new NextResponse("Stream API keys are missing", { status: 500 });
        }

        const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

        const expirationTime = Math.floor(Date.now() / 1000) + 3600;
        const issuedAt = Math.floor(Date.now() / 1000) - 60;

        const userToken = streamClient.createToken(token.sub, expirationTime, issuedAt);
        // console.log("API Key:", STREAM_API_KEY);
        // console.log("API Secret:", STREAM_API_SECRET);
        // console.log("Generated Token:", userToken);


        return new NextResponse(userToken, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
