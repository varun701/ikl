export const profilesModel = (sequelize, DataTypes) =>
  sequelize.define(
    'profiles',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      msgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      aboutMe: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lookingFor: {
        type: DataTypes.STRING,
      },
      quote: {
        type: DataTypes.STRING,
      },
      interests: {
        type: DataTypes.STRING,
      },
      theme: {
        type: DataTypes.JSON,
      },
    },
    {
      timestamps: false,
    },
  )
