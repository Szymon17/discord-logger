import "dotenv/config";
import { REST, Routes } from "discord.js";
import { clearChannel } from "./utils.js";
import { botChanelID } from "./index.js";
import client from "./client.js";

const commands = [
  {
    name: "clear",
    description: "clear 100 logs messages",
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
  console.log(interaction);
  if (interaction.commandName === "clear") {
    // await clearChannel(botChanelID);
    await interaction.reply("widzę");
  }
});

export default registerCommands;
