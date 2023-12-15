import "dotenv/config";
import { AuditLogEvent, EmbedBuilder, Events } from "discord.js";
import { getUsername, sendEmbed } from "./utils.js";
import registerCommands from "./commands.js";
import client from "./client.js";
import logs from "discord-logs";

logs(client);

export const botChanelID = process.env.BOOT_ROOM_ID;

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
    .setDescription("Dodano grupę " + role.name + " dla: " + nickname);

  sendEmbed(botChanelID, embed);
});

client.on("guildMemberRoleRemove", (member, role) => {
  const nickname = member.nickname || getUsername(member.user);

  const embed = new EmbedBuilder()
    .setTitle("Usunięto rolę")
    .setColor("Red")
    .setDescription("Usunięto grupę " + role.name + " dla: " + nickname);

  sendEmbed(botChanelID, embed);
});

client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
  const username = getUsername(member.user);

  const nickBeforeChange = oldNickname || username;
  const changedNickname = newNickname || username;

  const embed = new EmbedBuilder()
    .setTitle("Zmieniono pseudonim")
    .setColor("Orange")
    .setDescription(nickBeforeChange + " zmienił/a pseudonim na: " + changedNickname);

  sendEmbed(botChanelID, embed);
});

client.on("voiceChannelJoin", (member, channel) => {
  const username = member.nickname || getUsername(member.user);

  const embed = new EmbedBuilder()
    .setTitle("Połączono z serwerem")
    .setColor("DarkGreen")
    .setDescription("Użytkownik " + username + " dołączył na kanał " + channel.name);

  sendEmbed(botChanelID, embed);
});

client.on("voiceChannelLeave", (member, channel) => {
  const username = member.nickname || getUsername(member.user);

  const embed = new EmbedBuilder()
    .setTitle("Rozłączno z serwerem")
    .setColor("DarkRed")
    .setDescription("Użytkownik " + username + " opuścił kanał " + channel.name);

  sendEmbed(botChanelID, embed);
});

// client.on("voiceChannelSwitch", async (member, oldChannel, newChannel) => {
//   const username = getUsername(member.user);

//   const embed = new EmbedBuilder()
//     .setTitle("Zmiana kanału")
//     .setColor("Blue")
//     .setDescription("Użytkownik " + username + " przeszedł z " + oldChannel.name + " na " + newChannel.name);

//   sendEmbed(botChanelID, embed);
// });

client.on(Events.ChannelUpdate, channel => {
  const embed = new EmbedBuilder().setDescription("Zmieniono ustawienia kanału " + channel.name).setColor("Orange");

  sendEmbed(botChanelID, embed);
});

client.on(Events.ChannelCreate, channel => {
  const embed = new EmbedBuilder().setDescription("Utworzono kanał " + channel.name).setColor("Green");

  sendEmbed(botChanelID, embed);
});

client.on(Events.ChannelDelete, channel => {
  const embed = new EmbedBuilder().setDescription("Usunięto kanał " + channel.name).setColor("DarkRed");

  sendEmbed(botChanelID, embed);
});

client.on(Events.GuildBanAdd, member => {
  member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd }).then(audit => {
    const action = audit.entries.first();

    const executor = getUsername(action.executor);
    const user = getUsername(member.user);

    const embed = new EmbedBuilder()
      .setTitle("Zablokowano")
      .setColor("DarkRed")
      .addFields({ name: "Wykonawca", value: executor }, { name: "Użytkownik", value: user });

    sendEmbed(botChanelID, embed);
  });
});

client.on(Events.GuildBanRemove, member => {
  member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove }).then(audit => {
    const action = audit.entries.first();

    const executor = getUsername(action.executor);
    const user = getUsername(member.user);

    const embed = new EmbedBuilder()
      .setTitle("Usunięto blokadę")
      .setColor("DarkAqua")
      .addFields({ name: "Wykonawca", value: executor }, { name: "Użytkownik", value: user });

    sendEmbed(botChanelID, embed);
  });
});

client.on(Events.GuildMemberRemove, member => {
  member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }).then(audit => {
    const action = audit.entries.first();

    const executor = getUsername(action.executor);
    const user = getUsername(member.user);

    const embed = new EmbedBuilder()
      .setTitle("Wyrzucono")
      .setColor("DarkRed")
      .setDescription("Użytkownik " + user + " został wyrzycony z serwera przez " + executor);

    sendEmbed(botChanelID, embed);
  });
});

client.on("voiceStreamingStart", (member, chanel) => {
  const username = member.nickname || getUsername(member.user);

  const embed = new EmbedBuilder()
    .setTitle("Start transmisji na żywo")
    .setColor("Aqua")
    .setDescription("Użytkownik " + username + " rozpoczął transmisję na kanale " + chanel.name);

  sendEmbed(botChanelID, embed);
});

client.on("voiceStreamingStop", (member, chanel) => {
  const username = member.nickname || getUsername(member.user);

  const embed = new EmbedBuilder()
    .setTitle("Koniec transmisji na żywo")
    .setColor("DarkPurple")
    .setDescription("Użytkownik " + username + " zakończył transmisję na kanale " + chanel.name);

  sendEmbed(botChanelID, embed);
});

client.login(process.env.TOKEN);
