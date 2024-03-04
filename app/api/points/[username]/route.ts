// USER POINT DATA
import prisma from "@/utils/prisma";
import { PointstData } from "@/types";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = params;

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!user) {
    return Response.json({ points: 0, boxes: 0 });
  }

  const boxes = await prisma.box.findMany({
    where: {
      collectorId: user.id,
    },
  });

  const userPoints = boxes.reduce((acc: any, box: any) => acc + box.points, 0);

  const pointsData: PointstData = { points: userPoints, boxes: boxes.length };

  return Response.json(pointsData);
}
