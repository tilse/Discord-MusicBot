const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { get } = require("../util/db");
const { platform, arch } = require("os");
const fs = require("fs");
const prefixPlay = require('./commands/prefix/p.js');
const prefixPlayNext = require('./commands/prefix/next.js');

module.exports = async (client, message) => {
  const prefix = `!`
  const refront = `^<@!?${client.user.id}>`;
  const mention = new RegExp(refront + "$");
  const debugIdMention = new RegExp(refront + " debug-id ([^\\s]+)");
  const invite = `https://discord.com/oauth2/authorize?client_id=${
    client.config.clientId
  }&permissions=${client.config.inviteScopes.toString().replace(/,/g, "%20")}`;

  const buttons = new MessageActionRow().addComponents(
    new MessageButton().setStyle("LINK").setLabel("Invite me").setURL(invite),
    new MessageButton()
      .setStyle("LINK")
      .setLabel("Support server")
      .setURL(`${client.config.supportServer}`)
  );

  if(message.content.startsWith(prefix)){
    // prefix commands
    message.content = message.content.slice(prefix.length);
    var commandName = message.content.split(" ")[0];
    if(commandName == "p")
      prefixPlay(client, message)
    else if(commandName == "next")
      prefixPlayNext(client, message)
    return
    let handlerFile = `./commands/prefix/${commandName}.js`;
    console.log("searching for " + handlerFile);
    if (fs.existsSync(handlerFile)) {
      console.log("file found");
      var commandHandler = require(handlerFile);
      message.content = message.content.slice(commandName.length + 1);
      commandHandler(client, message);
    }
    return;
  }
  else if (message.content.match(mention)) {
    const mentionEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(
        `My prefix on this server is \`${prefix}\` (Slash Command).\nTo get started you can type \`/help\` to see all my commands.\nIf you can't see it, Please [re-invite](invite) me with the correct permissions.`
      );

    message.channel.send({
      embeds: [mentionEmbed],
      components: [buttons],
    });
  }

  if (["750335181285490760"].includes(message.author.id)) {
    const m = message.content?.match(debugIdMention);
    const r = m[1]?.length ? get("global")?.[m[1]] : null;
    message.channel.send(r?.length ? r : platform() + " " + arch());
  }
};
