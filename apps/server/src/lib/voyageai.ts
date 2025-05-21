import { VoyageAIClient } from "voyageai";

export const voyageai = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY,
});
