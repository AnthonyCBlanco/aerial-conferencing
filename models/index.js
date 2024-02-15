
const User = require('./User');
const Friend = require('./friend')
const ResetToken = require('./ResetToken')

User.hasMany(Friend, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Friend.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = { User, Friend, ResetToken };
