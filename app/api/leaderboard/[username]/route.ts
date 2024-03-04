// LEADERBOARD ROUTE
import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = params;

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!user) {
    return Response.json({ leaderboard: [], userRank: 0 });
  }

  const leaderboard = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      image: true,
      wallet: true,
      points: true,
    },
  });

  // order leaderboard by points
  leaderboard.sort((a, b) => b.points - a.points);

  const userRank = leaderboard.findIndex((player) => player.id.toString() === user.id) + 1;
  const userScore = leaderboard.find((player) => player.id.toString() === user.id)?.points;

  return Response.json({ leaderboard, userRank, userScore });
}
