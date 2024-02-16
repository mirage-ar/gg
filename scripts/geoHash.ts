// const base32: string = "0123456789bcdefghjkmnpqrstuvwxyz";

// function encodeGeoHash(latitude: number, longitude: number, precision: number = 12): string {
//   let latRange = { min: -90, max: 90 };
//   let lonRange = { min: -180, max: 180 };
//   let hash: string = "";
//   let hashVal: number = 0;
//   let bits: number = 0;
//   let even: boolean = true;

//   while (hash.length < precision) {
//     if (even) {
//       let mid = (lonRange.min + lonRange.max) / 2;
//       if (longitude > mid) {
//         hashVal = (hashVal << 1) + 1;
//         lonRange.min = mid;
//       } else {
//         hashVal = (hashVal << 1) + 0;
//         lonRange.max = mid;
//       }
//     } else {
//       let mid = (latRange.min + latRange.max) / 2;
//       if (latitude > mid) {
//         hashVal = (hashVal << 1) + 1;
//         latRange.min = mid;
//       } else {
//         hashVal = (hashVal << 1) + 0;
//         latRange.max = mid;
//       }
//     }

//     even = !even;

//     if (++bits == 5) {
//       hash += base32.charAt(hashVal);
//       bits = 0;
//       hashVal = 0;
//     }
//   }

//   return hash;
// }

// console.log(encodeGeoHash(42.35670347126499, -71.13744313849864));
