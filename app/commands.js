import "dotenv/config";
import { REST, Routes } from "discord.js";
import { clearChannel } from "./utils.js";
import { botChanelID } from "./index.js";
import { PermissionsBitField } from "discord.js";
import client from "./client.js";

let comandsCounter = 0;

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

  if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    interaction.reply("Niestety nie posiadasz wymaganych uprawnień");
    return;
  }

  if (interaction.channelId !== process.env.BOOT_ROOM_ID) return;

  if (comandsCounter <= 1) {
    if (interaction.commandName === "clear") {
      await clearChannel(botChanelID);
      interaction.reply("Ostatnie 30 logów zostało usunięte");
    }

    comandsCounter++;
    setTimeout(() => {
      comandsCounter = 0;
    }, 1000 * 60);
  } else interaction.reply("Użyłeś za dużo poleceń w krótkim czasie");
});

export default registerCommands;
