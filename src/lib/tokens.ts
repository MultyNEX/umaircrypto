import { SignJWT, jwtVerify } from "jose";

export interface SubmissionPayload {
  refId: string;
  name: string;
  email: string;
  tier: string;
  amount: string;
  network: string;
}

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
};

export async function createActionToken(
  payload: SubmissionPayload
): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(getSecret());
}

export async function verifyActionToken(
  token: string
): Promise<SubmissionPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as SubmissionPayload;
}
