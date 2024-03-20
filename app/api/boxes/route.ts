// GET BOXES
import { calculateDistance } from "@/utils";
import prisma from "@/utils/prisma";
import airdrop from "@/utils/airdrop";

export async function POST(request: Request) {
  const { userId, geoHash, latitude, longitude } = await request.json();

  // check airdrop
  const noAirdrop = await prisma.user.findFirst({
    where: {
      id: userId,
      airdrop: false,
    },
  });

  if (noAirdrop) {
    const boxCount = 20;
    const min = 100;
    const max = 10_000;
    const radius = 1000;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        airdrop: true,
      },
    });

    await airdrop(latitude, longitude, boxCount, min, max, radius);
  }

  // get all boxes within a certain area
  const boxes = await prisma.box.findMany();
  const features = boxes.map((box) => {
    return {
      type: "Feature",
      properties: {
        id: box.id,
        boxType: box.collectorId ? "opened" : "closed",
      },
      geometry: {
        type: "Point",
        coordinates: [box.longitude, box.latitude],
      },
    };
  });

  const geoJSON = {
    type: "FeatureCollection",
    features,
  };

  // substring length calculates area of geohash to search for boxes
  const geohashPrefix = geoHash.substring(0, 7);

  const collectableBoxes = await prisma.box.findMany({
    where: {
      geoHash: {
        startsWith: geohashPrefix,
      },
      collectorId: null,
    },
  });

  for (const box of collectableBoxes) {
    const distance = calculateDistance(latitude, longitude, box.latitude, box.longitude);

    if (distance <= 6) {
      const collected = await prisma.box.update({
        where: {
          id: box.id,
        },
        data: {
          collectorId: userId,
        },
      });

      if (collected) {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            points: {
              increment: collected.points,
            },
            boxes: {
              increment: 1,
            },
          },
        });

        geoJSON.features.filter((feature) => {
          if (feature.properties.id === box.id) {
            feature.properties.boxType = "opened";
          }
        });

        return Response.json({
          collect: collected,
          boxes: geoJSON,
        });
      }
    }
  }

  return Response.json({
    collect: null,
    boxes: geoJSON,
  });
}
