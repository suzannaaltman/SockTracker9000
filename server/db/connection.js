var pg = require('pg');

var connectionString = 'postgres://localhost:5432/socktracker';

var initializeDB = function(){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
      process.exit(1);
    } else {
      //create initial schema
      var sockList = 'CREATE TABLE IF NOT EXISTS sockList (' +
      'id serial PRIMARY KEY,' +
      'brand varchar(50) NOT NULL,' +
      'style varchar(50) NOT NULL,' +
      'description varchar(100), NULL' +
      'purchase_date date NOT NULL,' +
      'purchase_price numeric,' +
      'retired boolean DEFAULT false,' +
      'times_worn int DEFAULT 0);';
      var query = client.query(sockList);

      query.on('end', function(){
        console.log('Successfully created schema or ensured schema exists');
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
