import "dotenv/config";
import { REST, Routes } from "discord.js";
import client from "./client.js";

const commands = [
  {
    name: "hi",
    description: "Replies with Pong!",
  },
  {
    name: "hi1",
    description: "Replies with Pong!",
  },
];

const registerCommands = async () => {
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
  } catch (error) {
    console.error(error);
  }
};

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "hi") {
    await interaction.reply("Hey");
  } else if (interaction.commandName === "hi1") {
    await interaction.reply("Hey");
  }
});

export default registerCommands;
