module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define("Attendance", {
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.ClientInfo);
  };

  return Attendance;
};
