// LEADERBOARD ROUTE
import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

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

  const userRank = leaderboard.findIndex((player) => player.id.toString() === userId) + 1;

  return Response.json({ leaderboard, userRank });
}
