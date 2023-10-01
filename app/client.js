import { Client, GatewayIntentBits, Partials } from "discord.js";

const client = new Client({
  intents: [...Object.keys(GatewayIntentBits)],
  partials: [...Object.keys(Partials)],
});

export default client;
