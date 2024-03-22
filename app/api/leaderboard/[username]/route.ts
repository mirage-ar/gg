// LEADERBOARD ROUTE
import prisma from "@/utils/prisma";
import { th } from "date-fns/locale";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = params;

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new Error("Leaderboard: User not found");
  }

  const leaderboard = await prisma.user.findMany({
    where: {
      points: {
        gt: 0,
      },
    },
    orderBy: {
      points: "desc",
    },
    take: 500,
  });

  const userRank = leaderboard.findIndex((player) => player.id.toString() === user.id) + 1;
  const userScore = leaderboard.find((player) => player.id.toString() === user.id)?.points;

  return Response.json({ leaderboard, userRank, userScore });
}
