import {
  ActionRowBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  SelectMenuBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'

// eslint-disable-next-line no-unused-vars
import { ChatInputCommandInteraction } from 'discord.js'

import {
  modalCollector,
  profileDetails,
  profileGenerate,
  selectMenuCollectorr,
} from '../utils/functions.js'

const data = {
  name: 'profile',
}

const zoneSelectMenuRow = new ActionRowBuilder()
const stateSelectMenuRows = {}
const profileModal = new ModalBuilder()
const editSelectMenuRow = new ActionRowBuilder()
const editModals = {}

async function preExecute() {
  // zones, options
  const zoneOptions = []
  for (const zoneArr of bot.keyv.zones) {
    zoneOptions.push({
      label: `${zoneArr[1]} of India`,
      value: zoneArr[0],
    })
  }

  // zones, select menu
  const zoneSelectMenu = new SelectMenuBuilder()
    .setCustomId('zone_selector')
    .setMaxValues(1)
    .addOptions(zoneOptions)

  zoneSelectMenuRow.addComponents(zoneSelectMenu)

  // states
  for (const zone in bot.keyv.states) {
    const stateSelectMenuRow = new ActionRowBuilder()

    // options
    const stateOptions = []
    for (const state of bot.keyv.states[zone]) {
      stateOptions.push({
        label: state,
        value: state,
      })
    }

    // select menu
    const stateSelectMenu = new SelectMenuBuilder()
      .setCustomId(`state_selector${zone}`)
      .setMaxValues(1)
      .addOptions(stateOptions)

    stateSelectMenuRow.addComponents(stateSelectMenu)

    stateSelectMenuRows[zone] = stateSelectMenuRow
  }

  const cityNameActionRow = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId('cityName')
      .setLabel('City name')
      .setStyle(TextInputStyle.Short)
      .setMinLength(3)
      .setMaxLength(15)
      .setPlaceholder('Enter your city name.')
      .setRequired(false),
  )

  const quoteActionRow = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId('quote')
      .setLabel('Quote')
      .setStyle(TextInputStyle.Short)
      .setMaxLength(20)
      .setPlaceholder('quote/nickname/profession or something')
      .setRequired(true),
  )

  const aboutMeActionRow = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId('aboutMe')
      .setLabel('About Me')
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(20)
      .setMaxLength(700)
      .setPlaceholder('Write something about yourself.')
      .setRequired(true),
  )

  const lookingForActionRow = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId('lookingFor')
      .setLabel('Looking for')
      .setStyle(TextInputStyle.Short)
      .setMaxLength(20)
      .setRequired(true),
  )

  const interestsActionRow = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId('interests')
      .setLabel('Interests')
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(100)
      .setRequired(true),
  )

  const nameActionRow = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId('name')
      .setLabel('Name')
      .setStyle(TextInputStyle.Short)
      .setMaxLength(12)
      .setRequired(true),
  )

  const ageActionRow = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId('age')
      .setLabel('Age')
      .setStyle(TextInputStyle.Short)
      .setMaxLength(2)
      .setRequired(true),
  )

  profileModal
    .setCustomId('profileModal')
    .setTitle('Profile')
    .addComponents(
      cityNameActionRow,
      quoteActionRow,
      lookingForActionRow,
      interestsActionRow,
      aboutMeActionRow,
    )

  editSelectMenuRow.addComponents(
    new SelectMenuBuilder()
      .setCustomId('profileEdit')
      .setMaxValues(1)
      .setOptions([
        {
          label: 'Name',
          value: 'nameEdit',
        },
        {
          label: 'Age',
          value: 'ageEdit',
        },
        {
          label: 'Location',
          value: 'locationEdit',
        },
        {
          label: 'Intro',
          value: 'introEdit',
        },
      ]),
  )

  editModals.nameEdit = new ModalBuilder({
    custom_id: 'nameEditModal',
    title: 'Profile Edit',
    components: [nameActionRow],
  })

  editModals.ageEdit = new ModalBuilder({
    custom_id: 'ageEditModal',
    title: 'Profile Edit',
    components: [ageActionRow],
  })

  cityNameActionRow.components[0].setRequired(true)
  editModals.locationEdit = new ModalBuilder({
    custom_id: 'locationEditModal',
    title: 'Profile Edit',
    components: [cityNameActionRow],
  })

  editModals.introEdit = new ModalBuilder({
    custom_id: 'introEdit',
    title: 'Profile Edit',
    components: [interestsActionRow, quoteActionRow, lookingForActionRow, aboutMeActionRow],
  })
}

/**
 * @param {ChatInputCommandInteraction} interaction
 */

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true })
  const subCommand = interaction.options.getSubcommand()
  const executeFn =
    subCommand === 'create'
      ? executeCreate
      : subCommand === 'edit'
        ? executeEdit
        : subCommand === 'delete'
          ? executeDelete
          : 'none'

  if (subCommand !== 'create' || executeFn === 'none') {
    await interaction.editReply({
      content: 'This command is not available yet.',
    })
    return
  }

  const member = await interaction.guild.members.fetch(interaction.user)
  const dataObj = await profileDetails(member)

  if (dataObj.ifProfile) {
    await interaction.editReply({
      content: 'You have already created profile.',
    })
    return
  }

  if (
    dataObj.sexuality === 'human' ||
    dataObj.dm_status === 'human' ||
    dataObj.gender === 'human'
  ) {
    await interaction.editReply({
      content: 'Your profile does not have necessary roles. e.g. sexuality/dm status role.',
    })
    return
  }
  await executeFn(interaction, dataObj)
}

/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {Object} dataObj
 */

async function executeCreate(interaction, dataObj) {
  dataObj.userName = interaction.options.getString('name', true)
  dataObj.age = interaction.options.getNumber('age', true)

  // select menu, zones
  const message = await interaction.editReply({
    content: 'Select zone',
    components: [zoneSelectMenuRow],
  })

  await selectMenuCollectorr(message, async (err, zonesInteraction) => {
    if (err) {
      await interaction.editReply({
        content: 'You did not select zone. Command canceled.',
        components: [],
      })
      return
    }
    await zonesInteraction.deferReply({ ephemeral: true })
    const zoneSelected = zonesInteraction.values[0]
    await interaction.editReply({
      content: `Zone selected: ${zoneSelected}`,
      components: [],
    })

    // select menu, states
    const message2 = await zonesInteraction.editReply({
      content: 'Select state',
      components: [stateSelectMenuRows[zoneSelected]],
    })

    await selectMenuCollectorr(message2, async (err, statesInteraction) => {
      if (err) {
        await zonesInteraction.editReply({
          content: 'You did not select state. Command canceled.',
          components: [],
        })
        return
      }
      await statesInteraction.showModal(profileModal)
      const stateSelected = statesInteraction.values[0]

      await zonesInteraction.editReply({
        content: `State selected: ${stateSelected}`,
        components: [],
      })

      // modal
      await modalCollector(message2, async (err, modalSubmit) => {
        if (err) {
          await interaction.editReply({
            content: 'You did not submit form. Command canceled.',
          })
          await zonesInteraction.editReply({
            content: 'You did not submit form. Command canceled.',
          })
          return
        }
        await modalSubmit.reply({
          content: 'Submitted. Your profile will be uploaded soon.',
          ephemeral: true,
        })

        // assign values
        const cityName = modalSubmit.fields.getTextInputValue('cityName')
        dataObj.location = cityName === '' ? stateSelected : `${cityName}, ${stateSelected}`
        dataObj.userQuote = modalSubmit.fields.getTextInputValue('quote')
        dataObj.intro = {}
        dataObj.intro.aboutMe = modalSubmit.fields.getTextInputValue('aboutMe')
        dataObj.intro.lookingFor = modalSubmit.fields.getTextInputValue('lookingFor')
        dataObj.intro.interests = modalSubmit.fields.getTextInputValue('interests')
        dataObj.intro.locationWhole = `${cityName} | ${stateSelected} | ${zoneSelected}`

        await profileGenerate(dataObj)
        const member = await interaction.guild.members.fetch(interaction.user)
        await member.roles.add(interaction.client.keyv.get('ROLE_PROFILE'))
      })
    })
  })
}

/**
 * @param {ChatInputCommandInteraction} interaction
 */

async function executeEdit(interaction) {
  await interaction.deferReply({ ephemeral: true })

  const message = await interaction.editReply({
    content: 'Select what you want to edit.',
    components: [editSelectMenuRow],
  })

  await selectMenuCollectorr(message, async (err, editInteraction) => {
    if (err) {
      await interaction.editReply({
        content: 'You did not choose any. Command canceled.',
        components: [],
      })
      return
    }
    const selected = editInteraction.values[0]
    const modal = editModals[selected]
    await editInteraction.showModal(modal)

    await interaction.editReply({
      content: `Edit option selected: ${selected}`,
      components: [],
    })

    await modalCollector(message, async (err, modalSubmit) => {
      if (err) {
        await interaction.editReply({
          content: 'Command canceled.',
        })
        return
      }
      const edited = {}
      if (selected === 'nameEdit') {
        edited.name = modalSubmit.fields.getTextInputValue('name')
      }
      else if (selected === 'ageEdit') {
        edited.age = modalSubmit.fields.getTextInputValue('age')
      }
      else {
        edited.aboutMe = modalSubmit.fields.getTextInputValue('aboutMe')

        edited.lookingFor = modalSubmit.fields.getTextInputValue('lookingFor')
        edited.interests = modalSubmit.fields.getTextInputValue('interests')
        edited.quote = modalSubmit.fields.getTextInputValue('quote')
      }
      await modalSubmit.reply({
        content: 'Submitted. Your profile will be editted soon.',
        ephemeral: true,
      })

      // todo: edit profile from input
    })
  })
}

/**
 * @param {ChatInputCommandInteraction} interaction
 */

async function executeDelete(_interaction) {
  return
}

const builder = new SlashCommandBuilder()
  .setName('profile')
  .setDescription('Set up your profile')
  .addSubcommand((subCommand) =>
    subCommand
      .setName('create')
      .setDescription('Create your IKL profile')
      .addStringOption((option) =>
        option.setName('name').setDescription('Your name/nickname').setRequired(true),
      )
      .addNumberOption((option) =>
        option.setName('age').setDescription('Your age').setRequired(true),
      ),
  )
  .addSubcommand((subCommand) => subCommand.setName('edit').setDescription('Edit your profile'))
  .addSubcommand((subCommand) => subCommand.setName('delete').setDescription('Delete your profile'))
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel)

export default {
  data,
  execute,
  builder,
  preExecute,
}
