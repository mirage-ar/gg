import prisma from "@/utils/prisma";

import { GAME_API } from "@/utils/constants";

// TODO: might need to move this to gg.zip
export async function POST(request: Request) {
  const data = await request.json();
  const { username, image, twitterId } = data;

  try {
    // const prismaUser = await prisma.user.findUnique({
    //   where: {
    //     twitterId
    //   },
    // });

    // if (!prismaUser || prismaUser.wallet === null) {
    //     // console.error("USER API: User not found or no wallet");
    //     return Response.json({ success: false, message: "User not found" });
    // }

    // console.log("prismaUser", prismaUser);

    // CREATE GAME USER
    // const response = await fetch(`${GAME_API}/user`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     data: {
    //       id: twitterId,
    //       username: username,
    //       image: image,
    //       wallet: prismaUser?.wallet,
    //     },
    //   }),
    // });

    // Fetch additional user details (e.g., wallet information)
    const result = {
      id: "123",
      username: "celia",
      image: "https://pbs.twimg.com/profile_images/1564446865927593984/2dKVOZk7_400x400.jpg",
      wallet: "8EDurUnRAKw5MEDiJtVeYBZS7h7kEVzvYwZpgUeuZAMd",
    };
    // if (result.success === false) {
    //   return Response.json({ success: false, message: "Could not create user" });
    // }

    return Response.json({ success: true, message: "User created" });
  } catch (error) {
    return Response.json({ success: false, message: "Could not create user" });
  }
}
