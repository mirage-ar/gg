// USER POINT DATA
import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  const boxes = await prisma.box.findMany({
    where: {
      collectorId: userId,
    },
  });

  const userPoints = boxes.reduce((acc: any, box: any) => acc + box.points, 0);

  //   const user = await prisma.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //   });

  return Response.json({ points: userPoints, boxes: boxes.length });
}
