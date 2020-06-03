const { Model } = require('objection');

const Room = require('./Room.js');

class User extends Model {
    static tableName = 'users';

    static relationMappings = {
        rooms: {
            relation: Model.HasManyRelation,
            modelClass: Room,
            join: {
                from: 'users.id',
                to: 'rooms.userId'
            }
        }
    }
}

module.exports = User;