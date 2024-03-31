// GET BOXES
import { calculateDistance } from "@/utils";
import prisma from "@/utils/prisma";
import airdrop from "@/utils/airdrop";

export async function POST(request: Request) {
  const { userId, geoHash, latitude, longitude } = await request.json();

  // check airdrop
  const noAirdropExists =
    (await prisma.user.count({
      where: {
        id: userId,
        airdrop: false,
      },
    })) > 0;

  if (noAirdropExists) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        airdrop: true,
      },
    });

    let boxCount = 20;
    let min = 500;
    let max = 5000;
    let radius = 1000;

    await airdrop(latitude, longitude, boxCount, min, max, radius);

    boxCount = 20;
    min = 50;
    max = 500;
    radius = 100;

    await airdrop(latitude, longitude, boxCount, min, max, radius);

    boxCount = 4;
    min = 25;
    max = 50;
    radius = 5;

    await airdrop(latitude, longitude, boxCount, min, max, radius);
  }

  // get all boxes within a certain area
  const boxes = await prisma.box.findMany({
    cacheStrategy: {
      ttl: 1,
    },
  });
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
    cacheStrategy: {
      ttl: 1,
    },
  });

  for (const box of collectableBoxes) {
    const distance = calculateDistance(latitude, longitude, box.latitude, box.longitude);

    if (distance <= 6) {
      // ANTI SPOOFING
      const lastCollected = await prisma.box.findFirst({
        where: {
          collectorId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const lastCollectedGeoHash = lastCollected ? lastCollected.geoHash : geoHash;
      const lastCollectedGeohashPrefix = lastCollectedGeoHash.substring(0, 2);
      const geohashPrefix = geoHash.substring(0, 2);
      if (lastCollectedGeohashPrefix !== geohashPrefix) {
        // user is potentially cheating

        return Response.json({
          collect: null,
          boxes: geoJSON,
        });
      }

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
