import { SESClient } from "@aws-sdk/client-ses";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const REGION = process.env.AWS_REGION;

if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY) {
  throw new Error("AWS_ACCESS_KEY or AWS_SECRET_KEY is not defined in the environment variables.");
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