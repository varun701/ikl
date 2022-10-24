import {
  // eslint-disable-next-line no-unused-vars
  SelectMenuInteraction,
  ComponentType,
  InteractionCollector,
  InteractionType,
} from 'discord.js'

/**
 * Callback of select menu collector
 * @callback callbackSelectMenuManager
 * @param {string} err
 * @param {SelectMenuInteraction} selectMenuInteraction
 */

/**
 * This function collects the select menu interaction
 * @param {Message} message
 * @param {callbackSelectMenuManager} cb callback function
 */

export async function selectMenuCollector(message, cb) {
  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.SelectMenu,
    time: 30000,
    max: 1,
  })

  collector.on('end', async (collected) => {
    if (collected.size === 0) {
      await cb('TIMEOUT')
      return
    }

    collected.map(async (i) => {
      await cb(null, i)
    })
  })
}

/**
 * Callback of modal submit collector
 * @callback callbackModalManager
 * @param {string} err
 * @param {ModalSubmitInteraction} modalSubmitInteraction
 */

/**
 * This function collects the modal submit interaction
 * @param {Message} message
 * @param {callbackModalManager} cb
 */

export async function modalCollector(message, cb) {
  const collecter = new InteractionCollector(message.client, {
    message,
    interactionType: InteractionType.ModalSubmit,
    time: 5 * 60 * 1000,
    max: 1,
  })

  collecter.on('end', async (collected) => {
    if (collected.size === 0) {
      await cb('TIMEOUT')
      return
    }

    collected.map(async (m) => {
      await cb(null, m)
    })
  })
}
