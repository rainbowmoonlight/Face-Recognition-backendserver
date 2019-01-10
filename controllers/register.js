

const handleRegister = (req,res,db,bcrypt)=>{
	const {email, name, password} = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission')
	}
	const hash = bcrypt.hashSync(password);

	//bcrypt.compareSync("bacon", hash); // true
	//bcrypt.compareSync("veggies", hash); // false
	// bcrypt.hash(password, null, null, function(err, hash) {
 //    // Store hash in your password DB.
 //    	console.log(hash);
	// });
	// database.users.push({			
	// 	id:'125',
	// 	name: name,
	// 	email: email,
	// 	entries:0,
	// 	joined: new Date()
	// })
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					}).then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		
		//res.json(database.users[database.users.length-1])
		.catch(err => res.status(400).json('unable to register'))
}

module.exports = {
	handleRegister: handleRegister
}