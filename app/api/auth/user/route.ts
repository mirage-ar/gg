import prisma from "@/utils/prisma";
import { User } from "@privy-io/react-auth";

export async function POST(request: Request) {
  const { user }: { user: User } = await request.json();

  if (!user.twitter?.username) {
    return Response.json({ success: false });
  }

  const result = await prisma.user.upsert({
    where: { username: user.twitter?.username },
    update: {
      image: user.twitter?.profilePictureUrl?.replace("_normal", "") || "",
    },
    create: {
      twitterId: user.twitter?.subject,
      username: user.twitter?.username,
      image: user.twitter?.profilePictureUrl?.replace("_normal", "") || "",
    },
  });

  if (!result) {
    return Response.json({ success: false });
  }

  return Response.json({ success: true });
}
