import { auth } from "@clerk/nextjs/server";

const authOptions = { treatPendingAsSignedOut: false } as const;

export async function getAuthenticatedUserId() {
  const { userId } = await auth(authOptions);
  return userId;
}
