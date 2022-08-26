import Sequelize from 'sequelize'
import sequelize from '@lib/sequelize.js'

export const membersDB = (await import('@lib/models/members.js')).default(sequelize, Sequelize.DataTypes)

export default {
  membersDB,
}
