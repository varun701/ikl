// eslint-disable-next-line no-unused-vars
import { GuildMember } from 'discord.js'

/**
 * This function fetch details necessary for profile
 * @param {GuildMember} targetMember
 */

export async function profileDetails(targetMember) {
  const details = {}
  details.userId = targetMember.user.id
  details.userTag = targetMember.user.tag
  details.userId = targetMember.user.id
  details.pfp = targetMember.displayAvatarURL()
  details.color = targetMember.displayHexColor
  details.verification_status = verificationLevel(targetMember)

  const list = ['gender', 'sexuality', 'dm_status', 'level_status']
  for (const type of list) {
    const obj = targetMember.client.keyv.get(`OBJ_ROLES_${type.toUpperCase()}`)
    const roleId = fromObj(obj, targetMember._roles)
    details[type] = obj[roleId]
    if (roleId === 'none') details[type] = 'human'
  }

  details.ifProfile = targetMember._roles.includes(targetMember.client.keyv.get('ROLE_PROFILE'))
  const channelId = targetMember.client.keyv.get(`CHANNEL_PROFILES_${details.gender.toUpperCase()}`)
  details.channel = await targetMember.client.channels.fetch(channelId)
  return details
}

function verificationLevel(targetMember) {
  if (targetMember._roles.includes(targetMember.client.keyv.get('ROLE_VERIFIED'))) {
    return 'Verified Member'
  }
  if (targetMember._roles.includes(targetMember.client.keyv.get('ROLE_VERIFIED_PLUS'))) {
    return 'Verified Plus'
  }
  if (targetMember._roles.includes(targetMember.client.keyv.get('ROLE_COUPLE'))) {
    return 'Verified, Couple'
  }
  return 'Unverified Member'
}

function fromObj(obj, roles) {
  const keys = Object.keys(obj)
  let memberRole
  for (const role of roles) {
    if (keys.includes(role)) {
      memberRole = role
      break
    }
  }
  if (!memberRole) memberRole = 'none'
  return memberRole
}
