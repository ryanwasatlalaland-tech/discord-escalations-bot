import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";

export const slashData = new SlashCommandBuilder()
  .setName("escalate")
  .setDescription("Escalate a message")
  .addStringOption(option =>
    option
      .setName("messageid")
      .setDescription("Message ID")
      .setRequired(true)
  );

export const contextData = new ContextMenuCommandBuilder()
  .setName("Escalate")
  .setType(ApplicationCommandType.Message);

export async function showEscalationModal(
  interaction: ChatInputCommandInteraction | any,
  messageId: string
) {
  const modal = new ModalBuilder()
    .setCustomId(`escalate_modal_${messageId}`)
    .setTitle("Escalate Message");

  const reasonInput = new TextInputBuilder()
    .setCustomId("reason")
    .setLabel("Reason")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>()
      .addComponents(reasonInput)
  );

  await interaction.showModal(modal);
}

export function createActionButtons(messageId: string) {
  return new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`accept_${messageId}`)
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId(`deny_${messageId}`)
        .setLabel("Deny")
        .setStyle(ButtonStyle.Danger)
    );
}
