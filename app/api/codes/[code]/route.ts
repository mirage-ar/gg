// CHECK ACCESS CODE
import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { code: string } }) {
  const code = params.code.toLowerCase();

  const codeExists = await prisma.code.findUnique({
    where: { code, claimed: false },
  });

  if (!codeExists) {
    return Response.json({ authorized: false });
  }

  await prisma.code.update({
    where: { code },
    data: {
      claimed: true,
    },
  });

  return Response.json({ authorized: true });
}
