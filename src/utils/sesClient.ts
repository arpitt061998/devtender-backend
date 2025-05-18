import { SESClient } from "@aws-sdk/client-ses";

const REGION = process.env.AWS_REGION;

if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY || !process.env.AWS_REGION) {
  throw new Error("AWS_ACCESS_KEY, AWS_SECRET_KEY, or AWS_REGION is not defined in the environment variables.");
}

// for v3
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// for v2
/*
const sesClient = new SESClient({
  region: REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
*/

export { sesClient };