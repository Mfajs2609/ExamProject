const { Model } = require('objection');

const User = require('./User.js');

class Room extends Model {
    static tableName = 'rooms';
    
    static relationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: 'rooms.userId',
                to: 'users.id'
            }
        }
    }
}

module.exports = Room;