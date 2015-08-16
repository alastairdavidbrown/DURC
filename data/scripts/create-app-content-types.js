//db = db.getSiblingDB('durc-db')

var bulk = db.contenttypes.initializeUnorderedBulkOp();

bulk.insert( { 	type: "home", 
			  	description: "Welcome to the Dundee United Reformed Church Website",
			 	layout: "head-content-image"});

bulk.insert( { 	type: "gallery", 
			  	description: "This is our gallery with pictures of the church",
			 	layout: "image-carousel" });

bulk.insert( { 	type: "event", 
			  	description: "Here's the events that happen at the church.",
			 	layout: "head-content-list" });

bulk.insert( { 	type: "community", 
			  	description: "We're engaged in many community activities and groups here's a few",
			 	layout: "head-content-list"});

bulk.insert( { 	type: "vision", 
			  	description: "Here's our vision for the future and the changes we've completed recently",
			 	layout: "head-content-list"});

bulk.insert( { 	type: "rent", 
			  	description: "Here's the rooms we have available for rent, use the contact page if you want to make a booking",
			 	layout: "head-content-image"});

bulk.execute();