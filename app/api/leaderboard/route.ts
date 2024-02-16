// LEADERBOARD ROUTE
import prisma from "@/utils/prisma";

export async function GET(request: Request) {
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

  return Response.json(leaderboard);
}
