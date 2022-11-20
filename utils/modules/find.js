import { getProfileRoles, checkRequiredRoles } from '../modules.js'
import { introAssets, findAssets } from '../assets.js'
// eslint-disable-next-line no-unused-vars
import { ButtonInteraction } from 'discord.js'
import { Intro } from '../core/database.js'

/**
 * @param {ButtonInteraction} buttonInteraction
 */
export async function findModule(buttonInteraction) {
  await buttonInteraction.deferReply({ ephemeral: true })
  const member = buttonInteraction.member
  if (member === null) {
    throw new bot.Error('Invalid Guild Member Object')
  }

  const profileRoles = getProfileRoles(member)
  const requirementCheck = checkRequiredRoles(profileRoles)
  if (!requirementCheck[0]) return buttonInteraction.editReply(introAssets('no_gender_role', true))
  if (requirementCheck[1].length !== 0) {
    return buttonInteraction.editReply(
      introAssets('roles_not_found', { roles: `\`${requirementCheck[1].join('`  `')}\`` }),
    )
  }

  if (profileRoles.intro === false) {
    await buttonInteraction.editReply(findAssets('not_available'))
    return
  }
  if (profileRoles.tagRoles.length === 0) {
    await buttonInteraction.editReply(findAssets('no_tags'))
    return
  }

  await buttonInteraction.editReply({
    embeds: [findAssets('interface_embed')],
    components: [findAssets('tags')],
  })

  const message = await buttonInteraction.fetchReply()
  const collector = message.createMessageComponentCollector({
    time: 13 * 60 * 1000,
  })

  // Find by tag Interface
  let members, user_id, user_name, link, card
  let disabled = true
  const messageObj = () => {
    return {
      embeds: [findAssets('member_embed', { user_id, user_name, total: members.size })],
      components: [findAssets('buttons', { link, disabled })],
      files: [card],
    }
  }

  collector.on('collect', async (collected) => {
    if (collected.customId === 'tags') {
      const guild = collected.guild
      const tagId = collected.values[0]
      const role = await guild.roles.fetch(tagId)
      members = role.members
      if (members === undefined) members = guild.members.cache
    }
    const fetchedMember = members.random()
    user_id = fetchedMember.id
    user_name = fetchedMember.displayName
    const intro = await Intro.findByPk(user_id)
    if (intro === null) {
      disabled = true
      link = keyv.get('url_guide')
      card = keyv.get('url_no_intro_card')
    }
    else {
      disabled = false
      link = intro.get('introUrl')
      card = intro.get('profileCardUrl')
    }
    collected.update(messageObj())
  })
}
