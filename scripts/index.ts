const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

// function returns random number with min and max
function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

const base32: string = "0123456789bcdefghjkmnpqrstuvwxyz";

function encodeGeoHash(latitude: number, longitude: number, precision: number = 12): string {
  let latRange = { min: -90, max: 90 };
  let lonRange = { min: -180, max: 180 };
  let hash: string = "";
  let hashVal: number = 0;
  let bits: number = 0;
  let even: boolean = true;

  while (hash.length < precision) {
    if (even) {
      let mid = (lonRange.min + lonRange.max) / 2;
      if (longitude > mid) {
        hashVal = (hashVal << 1) + 1;
        lonRange.min = mid;
      } else {
        hashVal = (hashVal << 1) + 0;
        lonRange.max = mid;
      }
    } else {
      let mid = (latRange.min + latRange.max) / 2;
      if (latitude > mid) {
        hashVal = (hashVal << 1) + 1;
        latRange.min = mid;
      } else {
        hashVal = (hashVal << 1) + 0;
        latRange.max = mid;
      }
    }

    even = !even;

    if (++bits == 5) {
      hash += base32.charAt(hashVal);
      bits = 0;
      hashVal = 0;
    }
  }

  return hash;
}

async function main() {
  let runs = [];
  for (let i = 0; i < 20; i++) {
    runs.push(i);
  }

  for (const run of runs) {
    const latitude = `42.356${rand(1000000, 9999999)}`;
    const longitude = `-71.137${rand(1000000, 9999999)}`;

    const box = await prisma.box.create({
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        geoHash: encodeGeoHash(parseFloat(latitude), parseFloat(longitude)),
        collectorId: null,
        points: rand(20, 2000),
      },
    });

    console.log(box);
  }
}

main();
