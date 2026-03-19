module.exports = (sequelize, DataTypes) => {
  const ClientInfo = sequelize.define("ClientInfo", {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middlename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    contactno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isMember: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
  ClientInfo.associate = (models) => {
    ClientInfo.hasMany(models.ClientSubscription);
    ClientInfo.hasMany(models.ClientInOutLogs);
    ClientInfo.hasOne(models.EmergencyContact);
  };
  return ClientInfo;
};
