module.exports = (sequelize, DataTypes) => {
  const ClientInOutLogs = sequelize.define("ClientInOutLogs", {
    inlog: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    outlog: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    datelog: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  ClientInOutLogs.associate = (models) => {
    ClientInOutLogs.belongsTo(models.ClientInfo);
  };
  return ClientInOutLogs;
};
