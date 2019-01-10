const Clarifai = require ('clarifai');

const app = new Clarifai.App({
 apiKey: '52f45cd6ff5440f0936d468b07d64f5a'
});

const handleApiCall = (req,res) => {
	app.models
	  .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	  .then(data => {
	  	res.json(data);
	  })
	  .catch(err => res.status(400).json('unable to work with API'))
}


const handleImage = (req,res, db) => {
	const { id } = req.body;
	// let found = false;
	// database.users.forEach(user => {
	// 	if(user.id === id){
	// 		found = true;
	// 		user.entries++;
	// 		return res.jsonp(user.entries);
	// 	}
	// })
	// if(!found) {
	// 	res.status(400).json('not found');
	// } 
	db('users').where('id','=', id)
	.increment('entries',1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json("unable to get entries"))
}

module.exports = {
	handleImage:handleImage,
	handleApiCall
}