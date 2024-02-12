
const User = require('./User');
const Friend = require('./friend')

User.hasMany(Friend, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Friend.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = { User, Friend };
