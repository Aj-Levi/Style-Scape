import { getUploadAuthParams } from "@imagekit/next/server";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY as string;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY as string;

export async function GET() {
  try {
    const { token, expire, signature } = getUploadAuthParams({
      privateKey,
      publicKey,
    });

    return Response.json({ token, expire, signature, publicKey });
  } catch (err) {
    return Response.json("error while authenticating imagekit cred", {
      status: 500,
    });
  }
}
