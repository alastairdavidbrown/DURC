//db = db.getSiblingDB('durc-db')

var bulk = db.contenttypes.initializeUnorderedBulkOp();

bulk.insert( { 	type: "home", 
			  	description: "Welcome to the Dundee United Reformed Church Website",
			 	layout: "HeadContentImage"});

bulk.insert( { 	type: "gallery", 
			  	description: "This is our gallery with pictures of the church",
			 	layout: "ImageCarousel" });

bulk.insert( { 	type: "event", 
			  	description: "Here's the events that happen at the church.",
			 	layout: "HeadContent" });

bulk.insert( { 	type: "community", 
			  	description: "We're engaged in many community activities and groups here's a few",
			 	layout: "HeadContent"});

bulk.insert( { 	type: "vision", 
			  	description: "Here's our vision for the future and the changes we've completed recently",
			 	layout: "HeadContent"});


bulk.execute();