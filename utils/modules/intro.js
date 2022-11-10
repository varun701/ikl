// eslint-disable-next-line no-unused-vars
import { InteractionCollector, InteractionType, AttachmentBuilder, userMention } from 'discord.js'
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

const _getFromDatabase = async (id) => {
  const intro = await Intro.findByPk(id)
  return intro ?? null
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
 * @param {*} profileRoles
 * @param {*} profileDetails
 * @param {ModalSubmitInteraction} modalSubmit
 * @returns {introObject}
 */
const getIntroObject = (profileRoles, profileDetails, selected, modalSubmit) => {
  const introObject = {}

  // * Profile Card
  introObject.userID = profileDetails.userID
  introObject.userTag = profileDetails.userTag
  introObject.userName = profileDetails.userName

  // ASL
  introObject.age = selected.age_value
  introObject.sex = profileRoles.genderRole
  const cityName = modalSubmit.fields.getTextInputValue('city_name')
  introObject.locationArray =
    cityName === ''
      ? [selected.location_value, profileRoles.locationRole]
      : [cityName, selected.location_value, profileRoles.locationRole]
  introObject.location = introObject.locationArray[0]
  introObject.region = selected.location_value
  introObject.quote = modalSubmit.fields.getTextInputValue('quote')

  // Styling
  introObject.theme = selected.theme_value
  introObject.color = profileDetails.color
  introObject.avatar = profileDetails.avatarURL

  // Details
  introObject.sexuality = profileRoles.sexualityRole
  introObject.dmStatus = profileRoles.dmStatusRole
  introObject.warriorStatus = profileRoles.warriorRole
  introObject.verificationStatus = getVerificationStatus(profileRoles.verificationRoles)

  // * Intro Details
  introObject.aboutMe = modalSubmit.fields.getTextInputValue('about_me')
  introObject.interests = modalSubmit.fields.getTextInputValue('interests')
  introObject.lookingFor = modalSubmit.fields.getTextInputValue('looking_for')

  // * Extra
  introObject.version = '1.0'
  return introObject
}

/**
 * Checks the required roles for profile creation
 * @param {*} profileRoles
 * @returns {[boolean, string[], boolean]} requirementCheck
 */
const checkRequiredRoles = (profileRoles) => {
  if (profileRoles.genderRole === null) return [false]
  const rolesNotFound = []
  if (profileRoles.ageRole === null) rolesNotFound.push('Age Role')
  if (profileRoles.sexualityRole === null) rolesNotFound.push('Sexuality Role')
  if (profileRoles.locationRole === null) rolesNotFound.push('Location Role')
  if (profileRoles.dmStatusRole === null) rolesNotFound.push('DM Preference Role')
  if (profileRoles.ifIntro === true) return [true, rolesNotFound, true]
  return [true, rolesNotFound, false]
}

/**
 * Generates Profile Roles Object for GuildMember
 * @param {GuildMember} member
 */
const getProfileRoles = (member) => {
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
        : typeof profileRoles[roleType] === Boolean
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
const getProfileDetails = (member) => {
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

  if (!requirementCheck[2]) {
    await newIntroCreation(buttonInteraction, profileRoles, profileDetails)
    return
  }

  // todo edit and update options
  await buttonInteraction.editReply(introAssets('not_available_yet'))
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
        time: 5 * 60 * 1000,
        max: 1,
      })

      collecter.on('end', async (modalCollected) => {
        if (modalCollected.size === 0) {
          await buttonInteraction.editReply(getAssets('timeout'))
          return
        }

        const modalSubmit = modalCollected.first()
        await modalSubmit.update(getAssets('success'))

        const introObject = getIntroObject(
          profileRoles,
          profileDetails,
          { age_value, theme_value, location_value },
          modalSubmit,
        )

        try {
          await profileCardGenerator(introObject, buttonInteraction.client)
        }
        catch (e) {
          bot.error('Inro not created.', e)
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

  // Create Embeds array for Profile Intro
  const embedsIntro = []
  if (introObject.lookingFor !== '') embedsIntro.push(assets.embed('Looking For', introObject.lookingFor))
  if (introObject.interests !== '') embedsIntro.push(assets.embed('Interests', introObject.interests))
  if (introObject.aboutMe !== '') embedsIntro.push(assets.embed('About Me', introObject.aboutMe))

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
  const channelIdIntro =
    introObject.verificationStatus !== 'Unverified'
      ? keyv.get('channel_intro_verified')
      : keyv.get('channel_intro_unverified')
  const channelIntro = await client.channels.fetch(channelIdIntro)
  if (channelIntro === null) throw new logger.Error('Intro channel was not fetched.')
  const messageIntro = await channelIntro.send({
    content: userMention(userID),
    embeds: embedsIntro,
    files: [profileCardUrl],
  })
  if (messageIntro === null) throw new logger.Error('Intro Message not sent.')
  const introUrl = messageIntro.url
  introObject.introUrl = introUrl

  await addToDatabase(introObject)
}
