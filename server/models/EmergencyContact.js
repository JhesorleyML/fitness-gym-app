module.exports = (sequelize, DataTypes) => {
  const EmergencyContact = sequelize.define("EmergencyContact", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  EmergencyContact.associate = (models) => {
    EmergencyContact.belongsTo(models.ClientInfo);
  };
  return EmergencyContact;
};
