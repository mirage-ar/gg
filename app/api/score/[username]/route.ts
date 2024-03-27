// USER SCORE DATA
import prisma from "@/utils/prisma";
import { ScoreData } from "@/types";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = params;

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
    cacheStrategy: {
      ttl: 1,
    }
  });

  if (!user) {
    throw new Error("Score: User not found");
  }

  const boxes = await prisma.box.findMany({
    where: {
      collectorId: user.id,
    },
    cacheStrategy: {
      ttl: 1,
    }
  });

  // using points from user object so we can reduce if needed
  const pointsData: ScoreData = { points: user.points, boxes: boxes.length };

  return Response.json(pointsData);
}
