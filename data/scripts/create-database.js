db = connect("localhost:27017/durc-db");
db.createUser({ user: "durc-app",
  pwd: "durc-app",
  roles: []})

