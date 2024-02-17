// GET BOXES
import { calculateDistance } from "@/utils";
import prisma from "@/utils/prisma";

export async function POST(request: Request) {
  const { userId, geoHash, latitude, longitude } = await request.json();

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
    if (distance <= 8) {
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
