module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    amount: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    paymentdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.User);
    Payment.belongsTo(models.ClientSubscription);
  };
  return Payment;
};
