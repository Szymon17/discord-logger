const clearChannel = async (channelID, client) => {
  const chanel = client.channels.cache.get(channelID);

  const fetched = await chanel.messages.fetch({ limit: 100 });

  chanel.bulkDelete(fetched);
};

const getUsername = user => {
  const username = user.globalName || user.username;
  return username;
};

export { clearChannel, getUsername };
