import {
  ActionRowBuilder,
  ChannelType,
  Events,
  Interaction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";

import config from "../config";
import {
  canEscalate,
  isModerator
} from "../utils/permissions";

import {
  createActionButtons,
  showEscalationModal
} from "../commands/escalate";

import { createEscalationEmbed } from "../utils/embeds";

export default {
  name: Events.InteractionCreate,

  async execute(interaction: Interaction) {

    if (interaction.isChatInputCommand()) {

      if (interaction.commandName === "escalate") {

        if (!interaction.member || !canEscalate(interaction.member as any)) {
          return interaction.reply({
            content: "You cannot escalate.",
            ephemeral: true
          });
        }

        const messageId =
          interaction.options.getString("messageid", true);

        await showEscalationModal(interaction, messageId);
      }
    }

    if (interaction.isMessageContextMenuCommand()) {

      if (!interaction.member || !canEscalate(interaction.member as any)) {
        return interaction.reply({
          content: "You cannot escalate.",
          ephemeral: true
        });
      }

      await showEscalationModal(
        interaction,
        interaction.targetMessage.id
      );
    }

    if (interaction.isModalSubmit()) {

      if (!interaction.customId.startsWith("escalate_modal_")) return;

      const messageId =
        interaction.customId.replace("escalate_modal_", "");

      const reason =
        interaction.fields.getTextInputValue("reason");

      const channel = interaction.channel;

      if (!channel || channel.type !== ChannelType.GuildText) {
        return;
      }

      const message = await channel.messages.fetch(messageId);

      const escalationChannel =
        await interaction.guild?.channels.fetch(
          config.escalationChannelId
        );

      if (!escalationChannel?.isTextBased()) return;

      const escalationMessage =
        await escalationChannel.send({
          embeds: [
            createEscalationEmbed(
              message,
              interaction.user.tag,
              reason
            )
          ],
          components: [
            createActionButtons(message.id)
          ]
        });

      await interaction.reply({
        content: `Escalated: ${escalationMessage.url}`,
        ephemeral: true
      });
    }

    if (interaction.isButton()) {

      if (!interaction.member || !isModerator(interaction.member as any)) {
        return interaction.reply({
          content: "Moderator only.",
          ephemeral: true
        });
      }

      const accepted =
        interaction.customId.startsWith("accept_");

      const denied =
        interaction.customId.startsWith("deny_");

      if (!accepted && !denied) return;

      const modal = new ModalBuilder()
        .setCustomId(
          `${accepted ? "accept" : "deny"}_modal`
        )
        .setTitle(
          accepted ? "Accept Escalation" : "Deny Escalation"
        );

      const reason = new TextInputBuilder()
        .setCustomId("action_reason")
        .setLabel("Reason")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>()
          .addComponents(reason)
      );

      await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit()) {

      if (
        !interaction.customId.includes("_modal") ||
        interaction.customId.startsWith("escalate_")
      ) return;

      const accepted =
        interaction.customId.startsWith("accept");

      const reason =
        interaction.fields.getTextInputValue("action_reason");

      const logsChannel =
        await interaction.guild?.channels.fetch(
          config.logsChannelId
        );

      if (!logsChannel?.isTextBased()) return;

      await logsChannel.send({
        embeds: [
          {
            title: accepted
              ? "✅ Escalation Accepted"
              : "❌ Escalation Denied",

            description: reason,

            color: accepted
              ? 0x57F287
              : 0xED4245,

            footer: {
              text: `Handled by ${interaction.user.tag}`
            },

            timestamp: new Date().toISOString()
          }
        ]
      });

      await interaction.reply({
        content: accepted
          ? "Escalation accepted."
          : "Escalation denied.",
        ephemeral: true
      });
    }
  }
};
