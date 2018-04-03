const settings = require("./settings"); // settings.json
const arg = process.argv.slice(2);
var moment = require('moment');

var knex = require('knex')({
  client: 'pg',
  connection: {
    user     : settings.user,
    password : settings.password,
    database : settings.database,
    host     : settings.hostname
  }
});

knex.select('*')
.from('famous_people')
.where('first_name', 'like', `%${arg[0]}%`)
.orWhere('last_name', 'like', `%${arg[0]}%`)
.then(rows => {
  console.log(`Found ${rows.length} person(s) with name containing '${arg[0]}':`);
  for (let i = 0; i < rows.length; ++i) {
    let bday = rows[i].birthdate;
    console.log(`- ${i+1}: ${rows[i].first_name} ${rows[i].last_name}, born ${moment(bday).format('YYYY-MM-DD')}`);
  }
})
.catch(function(error) {
  console.error(error)
})
.then(() => {
  process.exit();
});