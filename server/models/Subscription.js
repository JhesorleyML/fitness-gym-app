module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define("Subscription", {
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Subscription.associate = (models) => {
    Subscription.hasMany(models.ClientSubscription);
  };
  return Subscription;
};
