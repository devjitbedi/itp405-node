let express = require('express');
let knex = require('knex');

let app = express();

app.get('/api/genres', function(request, response) {
  let connection = knex({
    client: 'sqlite3',
    connection: {
      filename: 'chinook.db'
    }
  });

  connection.select().from('genres').then((genres) => {
    response.json(genres);
  });
});

app.get('/api/artists', function(request, response) {

  let filter = request.query.filter;

  let connection = knex({
    client: 'sqlite3',
    connection: {
      filename: 'chinook.db'
    }
  });

  if (filter) {

  connection
  .select()
  .from('artists')
  .where('Name', "like", '%' + filter + '%')
  .then((artists) => {

  	if (artists.length != 0) {
    
    var reformattedArtists = artists.map(obj =>{ 
   var rObj = {};
   rObj["id"] = obj.ArtistId;
   rObj["name"] = obj.Name;
   return rObj;
	});
   
    console.log(request.query);
    response.json(reformattedArtists);

	} else {
        response.status(404).json({
          error: `Artist with ${filter} not found`
        });
      }

  });

}

else {

	connection
  .select()
  .from('artists')
  .then((artists) => {

  	if (artists) {
    
    var reformattedArtists = artists.map(obj =>{ 
   var rObj = {};
   rObj["id"] = obj.ArtistId;
   rObj["name"] = obj.Name;
   return rObj;
	});
   
    console.log(request.query);
    response.json(reformattedArtists);

	}

  });

}

});




app.get('/api/genres/:id', function(request, response) {
  let id = request.params.id;

  let connection = knex({
    client: 'sqlite3',
    connection: {
      filename: 'chinook.db'

    }
  });

  connection
    .select()
    .from('genres')
    .where('GenreId', id)
    .first()
    .then((genre) => {
      if (genre) {
        response.json(genre);
      } else {
        response.status(404).json({
          error: `Genre ${id} not found`
        });
      }
    });
});


  

app.listen(process.env.PORT || 8000);

