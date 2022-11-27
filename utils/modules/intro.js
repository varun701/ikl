// eslint-disable-next-line no-unused-vars
import { InteractionCollector, InteractionType, AttachmentBuilder, userMention, EmbedBuilder } from 'discord.js'
// eslint-disable-next-line no-unused-vars
import { Client, ButtonInteraction, ModalSubmitInteraction, GuildMember } from 'discord.js'
import _ from 'lodash'
import { assets, getAssets, introAssets } from '../assets.js'
import { Intro } from '../core/database.js'
import { profileCardGenerator } from './profileCardGenerator.js'

const addToDatabase = async (introObject) => {
  await Intro.upsert({
    id: introObject.userID,
    data: introObject,
    profileCardUrl: introObject.profileCardUrl,
    introUrl: introObject.introUrl,
    region: introObject.region,
  })
}

const addIntroRole = async (client, id) => {
  const guild = await client.guilds.fetch(keyv.get('guild_main'))
  if (guild === null || guild === undefined) return
  const member = await guild.members.fetch(id)
  if (member === null || member === undefined) return
  await member.roles.add(keyv.get('role_intro'))
}

/**
 * @param {string[]} verificationRoles
 * @returns {string} verificationStatus
 */
const getVerificationStatus = (verificationRoles) => {
  if (verificationRoles.length === 0) return 'Unverified'
  if (verificationRoles.length === 1) return 'Verified'
  if (verificationRoles.length === 3) return 'Verified Plus︱Couple'
  if (verificationRoles.includes('Verified +')) return 'Verified Plus'
  else return 'Verified︱Couple'
}

/**
 * Create Profile Data Object for Profile Creation/Change
 * @param {introObject | {}} introObject
 * @param {{}} profileRoles
 * @param {{}} profileDetails
 * @param {{}} modal
 * @returns {introObject}
 */
export const getIntroObject = (introObject, profileRoles, profileDetails, selected, modal) => {
  // * Profile Card
  introObject.userID = profileDetails.userID
  introObject.userTag = profileDetails.userTag
  introObject.userName = profileDetails.userName

  // ASL
  introObject.age = selected.age_value ?? introObject.age
  introObject.sex = profileRoles.genderRole ?? introObject.sex
  introObject.zone = profileRoles.locationRole ?? introObject.zone ?? 'Abroad'
  introObject.region = selected.location_value ?? introObject.region
  introObject.cityName = modal.cityName ?? introObject.cityName ?? ''
  introObject.location = introObject.cityName === '' ? introObject.region : introObject.cityName
  introObject.quote = modal.quote ?? introObject.quote
  if ('locationArray' in introObject) delete introObject.locationArray

  // Styling
  introObject.theme = selected.theme_value ?? introObject.theme
  introObject.color = profileDetails.color
  introObject.avatar = profileDetails.avatarURL

  // Details
  introObject.sexuality = profileRoles.sexualityRole ?? introObject.sexuality
  introObject.dmStatus = profileRoles.dmStatusRole ?? introObject.dmStatus
  introObject.warriorStatus = profileRoles.warriorRole ?? introObject.warriorStatus ?? 'human'
  introObject.verificationStatus = getVerificationStatus(profileRoles.verificationRoles)

  // * Intro Details
  introObject.aboutMe = modal.aboutMe ?? introObject.aboutMe
  introObject.interests = modal.interests ?? introObject.interests
  introObject.lookingFor = modal.lookingFor ?? introObject.lookingFor

  // * Extra
  introObject.version = '1.1'
  return introObject
}

/**
 * Checks the required roles for profile creation
 * @param {*} profileRoles
 * @returns {[boolean, string[]]} requirementCheck
 */
export const checkRequiredRoles = (profileRoles) => {
  if (profileRoles.genderRole === null) return [false]
  const rolesNotFound = []
  if (profileRoles.ageRole === null) rolesNotFound.push('Age Role')
  if (profileRoles.sexualityRole === null) rolesNotFound.push('Sexuality Role')
  if (profileRoles.locationRole === null) rolesNotFound.push('Location Role')
  if (profileRoles.dmStatusRole === null) rolesNotFound.push('DM Preference Role')
  return [true, rolesNotFound]
}

/**
 * Generates Profile Roles Object for GuildMember
 * @param {GuildMember} member
 */
export const getProfileRoles = (member) => {
  const roleIDs = Array.from(member._roles)
  const rolesObj = keyv.get('rolesObject')
  const profileRoles = {
    tagRoles: [],
    kinkRoles: [],
    intro: false,
    ageRole: null, // req
    genderRole: null, // req
    warriorRole: null,
    locationRole: null, // req
    sexualityRole: null, // req
    dmStatusRole: null, // req
    verificationRoles: [],
  }

  roleIDs.map((roleID) => {
    const roleType = _.findKey(rolesObj, roleID)
    if (roleType !== undefined) {
      Array.isArray(profileRoles[roleType])
        ? profileRoles[roleType].push(rolesObj[roleType][roleID])
        : typeof profileRoles[roleType] === 'boolean'
          ? (profileRoles[roleType] = true)
          : (profileRoles[roleType] = rolesObj[roleType][roleID])
    }
  })

  return profileRoles
}

/**
 * Generate Profile Details Object for Guildember
 * @param {GuildMember} member
 */
export const getProfileDetails = (member) => {
  return {
    userID: member.id,
    avatarURL: member.displayAvatarURL(),
    userName: member.displayName,
    userTag: member.user.tag,
    color: member.displayHexColor,
  }
}

/**
 * Profile Intro Handler
 * Responds to `Intro` ButtonInteraction
 * @param {ButtonInteraction} buttonInteraction
 */
export async function introHandler(buttonInteraction) {
  await buttonInteraction.deferReply({ ephemeral: true })
  const member = buttonInteraction.member
  if (member === null) {
    throw new bot.Error('Invalid Guild Member Object')
  }

  const profileRoles = getProfileRoles(member)
  const profileDetails = getProfileDetails(member)

  const requirementCheck = checkRequiredRoles(profileRoles)
  if (!requirementCheck[0]) return buttonInteraction.editReply(introAssets('no_gender_role', true))
  if (requirementCheck[1].length !== 0) {
    return buttonInteraction.editReply(
      introAssets('roles_not_found', { roles: `\`${requirementCheck[1].join('`  `')}\`` }),
    )
  }

  if (profileRoles.intro === false) {
    await newIntroCreation(buttonInteraction, profileRoles, profileDetails)
    return
  }

  await buttonInteraction.editReply(introAssets('intro_actions_menu'))
  const message = await buttonInteraction.fetchReply()

  const collector = message.createMessageComponentCollector({
    time: 30 * 1000,
  })

  collector.on('collect', async (collected) => {
    const selected = {},
      modal = {}
    if (collected.customId === 'intro_update') {
      await buttonInteraction.editReply(introAssets('success_update'))
    }
    if (collected.customId === 'intro_edit') {
      // todo: edit options, and fetch new value
    }
    const intro_fetched = await Intro.findByPk(profileDetails.userID)
    const introObject_fetched = intro_fetched.get('data')
    const introObject = getIntroObject(introObject_fetched, profileRoles, profileDetails, selected, modal)
    try {
      await profileCardGenerator(introObject, buttonInteraction.client)
    }
    catch (e) {
      bot.error('Intro not created.', e)
    }
  })
}

/**
 *
 * @param {ButtonInteraction} buttonInteraction
 * @param {*} profileRoles
 */
async function newIntroCreation(buttonInteraction, profileRoles, profileDetails) {
  let age_value = 'none',
    location_value = 'none',
    theme_value = 'none'
  let age_disabled = false,
    location_disabled = true,
    theme_disabled = true
  let age_style = 1,
    location_style = 2,
    theme_style = 2
  let confirm_disabled = true,
    confirm_style = 2,
    confirmed = false

  // New Intro Creation Interface
  const messageObj = () => {
    return {
      embeds: [introAssets('intro_menu_embed', { age_value, location_value, theme_value })],
      components: [
        introAssets(`age_${profileRoles.ageRole}`, { age_disabled }),
        introAssets(`location_${profileRoles.locationRole}`, { location_disabled }),
        introAssets('theme', { theme_disabled }),
        introAssets('buttons', { confirm_disabled, age_style, location_style, theme_style, confirm_style }),
      ],
    }
  }

  await buttonInteraction.editReply(messageObj())
  const message = await buttonInteraction.fetchReply()

  const collector = message.createMessageComponentCollector({
    time: 120 * 1000,
  })

  collector.on('collect', async (collected) => {
    if (collected.customId === 'age') {
      age_value = collected.values[0]
      age_disabled = true
      age_style = 3
      location_disabled = false
      location_style = 1
    }
    if (collected.customId === 'location') {
      location_value = collected.values[0]
      location_disabled = true
      location_style = 3
      theme_disabled = false
      theme_style = 1
    }
    if (collected.customId === 'theme') {
      theme_value = collected.values[0]
      theme_disabled = true
      theme_style = 3
      confirm_disabled = false
      confirm_style = 3
    }
    if (collected.customId === 'cancel_button') {
      await collected.update(getAssets('canceled'))
      return
    }

    if (collected.customId === 'confirm_button') {
      confirmed = true
      await collected.showModal(assets.introModal_json())
      await buttonInteraction.editReply(getAssets('waiting'))
      const collecter = new InteractionCollector(message.client, {
        message,
        interactionType: InteractionType.ModalSubmit,
        time: 14 * 60 * 1000,
        max: 1,
      })

      collecter.on('end', async (modalCollected) => {
        if (modalCollected.size === 0) {
          await buttonInteraction.editReply(getAssets('timeout'))
          return
        }

        const modalSubmit = modalCollected.first()
        await modalSubmit.update(introAssets('success'))

        const introObject = getIntroObject(
          {},
          profileRoles,
          profileDetails,
          { age_value, theme_value, location_value },
          {
            quote: modalSubmit.fields.getTextInputValue('quote'),
            aboutMe: modalSubmit.fields.getTextInputValue('about_me'),
            cityName: modalSubmit.fields.getTextInputValue('city_name'),
            interests: modalSubmit.fields.getTextInputValue('interests'),
            lookingFor: modalSubmit.fields.getTextInputValue('looking_for'),
          },
        )

        try {
          await profileCardGenerator(introObject, buttonInteraction.client)
        }
        catch (e) {
          bot.error('Intro not created.', e)
        }
      })
      return
    }

    await collected.update(messageObj())
  })

  collector.on('end', async (_collection) => {
    if (!confirmed) {
      await buttonInteraction.editReply(getAssets('timeout'))
    }
  })
}

/**
 * Sends Intro
 * @param {Client} client
 * @param {{}} introObject
 * @param {Buffer} profileCardBuff
 */
export async function introSender(client, introObject, profileCardBuff) {
  const { userID, userTag } = introObject
  const profileCard = new AttachmentBuilder(profileCardBuff) // Get profile card buff
  const embedBuild = (title, description) => new EmbedBuilder({ title, description, color: 3092790 })

  // Create Embeds array for Profile Intro
  const embedsIntro = []
  if (introObject.lookingFor !== '') embedsIntro.push(embedBuild('Looking For', introObject.lookingFor))
  if (introObject.interests !== '') embedsIntro.push(embedBuild('Interests', introObject.interests))
  if (introObject.aboutMe !== '') embedsIntro.push(embedBuild('About Me', introObject.aboutMe))

  // Intro Archive
  const channelIdArchive = keyv.get('channel_intro_archive')
  const channelArchive = await client.channels.fetch(channelIdArchive)
  if (channelArchive === null) throw new logger.Error('Archive channel was not fetched.')
  const archivedIntro = await channelArchive.send({
    content: introAssets('intro_archive_content', { userID, userTag }),
    files: [profileCard],
  })
  if (archivedIntro === null) throw new logger.Error('Archive Intro not sent.')
  // Profile URL
  const profileCardUrl = archivedIntro.attachments.first().url
  introObject.profileCardUrl = profileCardUrl

  // Intro
  let messageIntro = null
  const channelIdIntro =
    introObject.verificationStatus !== 'Unverified'
      ? keyv.get('channel_intro_verified')
      : keyv.get('channel_intro_unverified')
  const intro = {
    content: userMention(userID),
    embeds: embedsIntro,
    files: [profileCardUrl],
  }

  // If there is intro
  if ('introUrl' in introObject) {
    const introUrlArray = introObject['introUrl'].split('/')
    const channel = await client.channels.fetch(introUrlArray[introUrlArray.length - 2])
    if (channel === null) throw new Error('Intro Channel was not fetched (Intro Edit).')
    let message
    try {
      message = await channel.messages.fetch(introUrlArray[introUrlArray.length - 1])
    }
    catch (e) {
      logger.error('Message not fetched')
    }
    if (message !== null && message !== undefined) {
      if (channelIdIntro === introUrlArray[introUrlArray.length - 2]) {
        messageIntro = await message.edit(intro)
      }
      else {
        await message.delete()
      }
    }
  }

  if (messageIntro === null) {
    const channelIntro = await client.channels.fetch(channelIdIntro)
    if (channelIntro === null) throw new logger.Error('Intro Channel was not fetched.')
    messageIntro = await channelIntro.send(intro)
  }
  if (messageIntro === null) throw new logger.Error('Intro Message not sent.')
  const introUrl = messageIntro.url
  introObject.introUrl = introUrl

  await addToDatabase(introObject)
  await addIntroRole(client, introObject.userID)
}
