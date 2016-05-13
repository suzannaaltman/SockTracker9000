var pg = require('pg');

var connectionString;

if (process.env.DATABASE_URL){
 pg.defaults.ssl = true;
 console.log('environment var');
 connectionString = process.env.DATABASE_URL;
} else {
 console.log('local var');
 connectionString = 'postgres://localhost:5432/socktracker';
}

var initializeDB = function(){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
      process.exit(1);
    } else {
      //create initial schema
      var userList = 'CREATE TABLE IF NOT EXISTS userList (id SERIAL PRIMARY KEY, email varchar(100) NOT NULL UNIQUE, password varchar(100) NOT NULL);';
      var sockList = 'CREATE TABLE IF NOT EXISTS sockList (' +
      'id serial PRIMARY KEY,' +
      'brand varchar(50) NOT NULL,' +
      'style varchar(50) NOT NULL,' +
      'description varchar(100),' +
      'purchase_date date NOT NULL,' +
      'purchase_price numeric,' +
      'retired boolean DEFAULT false,' +
      'date_retired date,' +
      'times_worn int DEFAULT 0,' +
      'price_per_wear numeric,' +
      'user_id INT REFERENCES userList(id));';
      var query = client.query(userList + sockList);

      query.on('end', function(){
        console.log('Successfully created schemas or ensured schemas exists');
        done();
      });

      query.on('error', function(){
        console.log('Error creating schema');
        process.exit(1);
      });
    }
  });
}

module.exports.connectionString = connectionString;
module.exports.initializeDB = initializeDB;
