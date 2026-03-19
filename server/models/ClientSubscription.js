module.exports = (sequelize, DataTypes) => {
  const ClientSubscription = sequelize.define("ClientSubscription", {
    datestart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateend: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
  ClientSubscription.associate = (models) => {
    ClientSubscription.hasMany(models.Payment);
    ClientSubscription.belongsTo(models.ClientInfo);
    ClientSubscription.belongsTo(models.Subscription);
  };

  return ClientSubscription;
};
