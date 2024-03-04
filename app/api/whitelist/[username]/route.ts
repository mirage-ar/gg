// USER POINT DATA
import prisma from "@/utils/prisma";
import whitelist from "./whitelist.json";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = params;

  const userExists = whitelist.includes(username);

  if (userExists) {
    return Response.json({ userExists: true });
  } else {
    return Response.json({ userExists: false });
  }
}
