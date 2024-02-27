// USER POINT DATA
import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = params;

  // TODO: update to check whitelist via username
  const userExists = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (userExists) {
    return Response.json({ userExists: true });
  } else {
    return Response.json({ userExists: false });
  }
}
