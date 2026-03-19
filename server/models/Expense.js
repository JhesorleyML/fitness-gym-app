module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define("Expense", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Expense.associate = (models) => {
    Expense.belongsTo(models.User);
  };

  return Expense;
};
