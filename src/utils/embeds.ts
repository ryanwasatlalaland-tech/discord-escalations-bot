import {
  Colors,
  EmbedBuilder,
  Message
} from "discord.js";

export function createEscalationEmbed(
  message: Message,
  escalatorTag: string,
  reason: string
) {
  const repliedMessage =
    message.reference?.messageId
      ? "Reply detected"
      : "No reply";

  return new EmbedBuilder()
    .setColor(Colors.Orange)
    .setAuthor({
      name: `${message.author.tag}`,
      iconURL: message.author.displayAvatarURL()
    })
    .setThumbnail(message.author.displayAvatarURL())
    .setTitle("🚨 New Escalation")
    .addFields(
      {
        name: "User",
        value: `${message.author} (${message.author.id})`
      },
      {
        name: "Escalated By",
        value: escalatorTag
      },
      {
        name: "Channel",
        value: `${message.channel}`
      },
      {
        name: "Reply Context",
        value: repliedMessage
      },
      {
        name: "Message Link",
        value: `[Jump To Message](${message.url})`
      },
      {
        name: "Reason",
        value: reason
      },
      {
        name: "Message",
        value: message.content || "No text content"
      }
    )
    .setFooter({
      text: `Message ID: ${message.id}`
    })
    .setTimestamp(message.createdAt);
}
