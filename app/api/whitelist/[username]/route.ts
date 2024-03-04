// USER POINT DATA
import prisma from "@/utils/prisma";
import whitelist from "./whitelist.json";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = params;

  // ignore case
  const userExists = whitelist.includes(username.toLowerCase());

  if (userExists) {
    return Response.json({ userExists: true });
  } else {
    return Response.json({ userExists: false });
  }
}
