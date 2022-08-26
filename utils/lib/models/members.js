export default (sequelize, dataTypes) =>
  sequelize.define(
    'members',
    {
      id: {
        type: dataTypes.STRING,
        primaryKey: true,
      },
      gender: {
        type: dataTypes.CHAR(1),
        allowNull: false,
      },
      sexuality: {
        type: dataTypes.CHAR(1),
        allowNull: false,
      },
      dm: {
        type: dataTypes.CHAR(1),
        allowNull: false,
      },
      verified: {
        type: dataTypes.CHAR(1),
        allowNull: false,
      },
      intro: {
        type: dataTypes.CHAR(1),
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
