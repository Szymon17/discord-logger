import client from "./client.js";

const clearChannel = async channelID => {
  const chanel = client.channels.cache.get(channelID);

  const fetched = await chanel.messages.fetch({ limit: 30 });

  chanel.bulkDelete(fetched);
};

const getUsername = user => {
  const username = user.globalName || user.username;
  return username;
};

const sendEmbed = (channelID, embed) => {
  client.channels.cache.get(channelID).send({ embeds: [embed] });
};

export { clearChannel, getUsername, sendEmbed };
