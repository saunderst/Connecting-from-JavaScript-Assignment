const {Client} = require("pg");
const settings = require("./settings"); // settings.json
const arg = process.argv.slice(2);

const client = new Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

console.log(arg);
client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  client.query("SELECT * from famous_people where first_name like $1 or last_name like $1", [`%${arg[0]}%`], (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    let rows = result.rows;
    console.log(`Found ${rows.length} person(s) with name containing '${arg[0]}':`);
    for (let i = 0; i < rows.length; ++i) {
      let bday = rows[i].birthdate;
      console.log(`- ${i+1}: ${rows[i].first_name} ${rows[i].last_name}, born ${bday.getFullYear()}-${bday.getMonth()+1}-${bday.getDate()}`);
    }
    client.end();
  });
});