import "dotenv/config";
import { AuditLogEvent, EmbedBuilder, Events } from "discord.js";
import { getUsername } from "./utils.js";
import registerCommands from "./commands.js";
import client from "./client.js";
import logs from "discord-logs";

logs(client);

const botChanelID = "1158001565764943903";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  registerCommands();
});

client.on("messageCreate", message => {
  if (message.author.bot || message.channelId !== botChanelID) return;

  const username = getUsername(message.author);

  message.reply(username + " nie spam");
});

client.on("voiceChannelSwitch", async (member, oldChannel, newChannel) => {
  const username = getUsername(member.user);

  const embed = new EmbedBuilder()
    .setTitle("Zmiana kanału")
    .setColor("Blue")
    .setDescription(username + " przeszedł z " + oldChannel.name + " na " + newChannel.name);

  client.channels.cache.get(botChanelID).send({ embeds: [embed] });
});

client.on(Events.MessageDelete, message => {
  if (message.author.bot) return;

  message.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete }).then(audit => {
    const action = audit.entries.first();

    const executorName = getUsername(action.executor);
    const targetName = getUsername(message.author);

    const embed = new EmbedBuilder()
      .setTitle("Usunięto wiadomość")
      .setColor("Red")
      .setDescription(executorName + " usunął wiadomość użytkownika " + targetName)
      .addFields({ name: "Treść:", value: message.content });

    client.channels.cache.get(botChanelID).send({ embeds: [embed] });
  });
});

client.login(process.env.TOKEN);
