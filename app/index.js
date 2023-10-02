import "dotenv/config";
import { AuditLogEvent, EmbedBuilder, Events } from "discord.js";
import { getUsername, sendEmbed } from "./utils.js";
import registerCommands from "./commands.js";
import client from "./client.js";
import logs from "discord-logs";

logs(client);

export const botChanelID = "1158001565764943903";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  registerCommands();
});

client.on("messageCreate", message => {
  if (message.author.bot || message.channelId !== botChanelID) return;

  const username = getUsername(message.author);

  message.reply(username + " nie spam");
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

    sendEmbed(botChanelID, embed);
  });
});

client.on("guildMemberRoleAdd", (member, role) => {
  const nickname = member.nickname || getUsername(member.user);

  const embed = new EmbedBuilder()
    .setTitle("Dodano rolę")
    .setColor("Green")
    .setDescription(nickname + " został dodany do grupy " + role.name);

  sendEmbed(botChanelID, embed);
});

client.on("guildMemberRoleRemove", (member, role) => {
  const nickname = member.nickname || getUsername(member.user);

  const embed = new EmbedBuilder()
    .setTitle("Usunięto rolę")
    .setColor("Red")
    .setDescription(nickname + " został usunięty z grupy " + role.name);

  sendEmbed(botChanelID, embed);
});

client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
  const username = getUsername(member.user);

  const nickBeforeChange = oldNickname || username;
  const changedNickname = newNickname || username;

  const embed = new EmbedBuilder()
    .setTitle("Zmieniono pseudionim")
    .setColor("Orange")
    .setDescription(nickBeforeChange + " zmienił pseudonim na: " + changedNickname);

  sendEmbed(botChanelID, embed);
});

client.on("rolePositionUpdate", (role, oldPosition, newPosition) => {
  const description =
    oldPosition > newPosition
      ? "Ważność roli: '" + role.name + "' spadła z wartości: " + oldPosition + " do " + newPosition
      : "Ważność roli: '" + role.name + "' wzrosła z wartości: " + oldPosition + " do " + newPosition;

  const color = oldPosition > newPosition ? "Red" : "Green";

  const embed = new EmbedBuilder().setTitle("Zmieniono ważność roli").setColor(color).setDescription(description);

  sendEmbed(botChanelID, embed);
});

client.on("voiceChannelSwitch", async (member, oldChannel, newChannel) => {
  const username = getUsername(member.user);

  const embed = new EmbedBuilder()
    .setTitle("Zmiana kanału")
    .setColor("Blue")
    .setDescription(username + " przeszedł z " + oldChannel.name + " na " + newChannel.name);

  sendEmbed(botChanelID, embed);
});

client.login(process.env.TOKEN);
