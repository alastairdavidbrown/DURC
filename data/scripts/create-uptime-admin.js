db = db.getSiblingDB('admin')
db.dropUser('uptimeAdmin')
db.createUser(
  {
    user: "uptimeAdmin",
    pwd: "password",
    roles: [ 
		{ role: "userAdminAnyDatabase", db: "admin" },
		{ role: "root", db: "admin" }
		]
  }
)


