db = db.getSiblingDB('durc-db')
db.createUser({ user: 'durc',
  pwd: 'durc',
  roles: [ { role: "readWrite", db: "durc-db" } ]
  //roles: [ { role: "readWrite", db: "newdb" } ]
})

