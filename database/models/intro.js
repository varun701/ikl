import { DataTypes } from 'sequelize'
export const introModel = (sequelize) =>
  sequelize.define(
    'intro',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      profileCardUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      introUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    },
  )
