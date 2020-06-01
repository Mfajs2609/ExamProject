
exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
        table.increments('id');
        table.string('username').unique().notNullable();
        table.string('password').notNullable();
        table.string('email').notNullable();

        table.timestamp('created_at').defaultTo(knex.fn.now());
    })

    .createTable('discussions', table => {
        table.increments('id');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('users');
};
