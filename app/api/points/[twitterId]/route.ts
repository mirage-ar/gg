// USER POINT DATA
import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { twitterId: string } }) {
  const { twitterId } = params;

  const user = await prisma.user.findFirst({
    where: {
      twitterId: twitterId,
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

  //   const user = await prisma.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //   });

  return Response.json({ points: userPoints, boxes: boxes.length });
}
