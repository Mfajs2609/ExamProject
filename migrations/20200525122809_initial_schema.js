
exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
        table.increments('id');
        table.string('username').unique().notNullable();
        table.string('password').notNullable();
        table.string('email').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
    })
    .createTable('rooms', table => {
        table.increments('roomId');
        table.string('topic').notNullable();
        table.string('description').notNullable();
        table.integer('userId').unsigned().notNullable();
        table.foreign('userId').references('users.id');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('rooms')
    .dropTableIfExists('users');
};
