/*
id: USER_ID
gender:
  1: male
  2: female
  3: ngbt
  0: not assigned

sexuality:
  1: straight
  2: bisexual
  3: pansexual
  4: homosexual
  0: not assigned

dm:
  1: open to dm
  2: closed dm
  3: ask to dm
  0: not assigned

verified:
  1: verified
  2: verified plus
  0: not verified

profile:
  1: has profile
  0: no profile

kinks:
  1: kinks added
  0: not added

isMember:
  1: current member
  0: old member
*/

export default (sequelize, dataTypes) =>
  sequelize.define(
    'members',
    {
      id: {
        type: dataTypes.STRING,
        primaryKey: true,
      },
      gender: {
        type: dataTypes.INTEGER(1),
        allowNull: false,
      },
      sexuality: {
        type: dataTypes.INTEGER(1),
        allowNull: false,
      },
      dm: {
        type: dataTypes.INTEGER(1),
        allowNull: false,
      },
      verified: {
        type: dataTypes.INTEGER(1),
        allowNull: false,
      },
      profile: {
        type: dataTypes.INTEGER(1),
        allowNull: false,
      },
      kinks: {
        type: dataTypes.INTEGER(1),
        allowNull: false,
      },
      isMember: {
        type: dataTypes.BOOLEAN,
        default: true,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    },
  )
