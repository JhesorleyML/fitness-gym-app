module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  //association
  User.associate = (models) => {
    User.hasMany(models.Payment);
    User.hasMany(models.Expense);
  };
  return User;
};
