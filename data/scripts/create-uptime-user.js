db = db.getSiblingDB('uptime')
db.createUser({ user: 'uptime-user',
  pwd: 'uptime-password',
  	roles: [ 
			{ role: "dbOwner", db: "uptime" }, 
		  	{ role: "dbOwner", db: "admin" },
			{ role: "root", db: "admin" } ]
})
