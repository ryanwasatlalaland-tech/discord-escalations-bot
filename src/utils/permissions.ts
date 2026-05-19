import { GuildMember } from "discord.js";
import config from "../config";

export function isModerator(member: GuildMember) {
  return member.roles.cache.some(role =>
    config.moderatorRoles.includes(role.id)
  );
}

export function canEscalate(member: GuildMember) {
  return member.roles.cache.some(role =>
    config.escalatorRoles.includes(role.id)
  ) || isModerator(member);
}
