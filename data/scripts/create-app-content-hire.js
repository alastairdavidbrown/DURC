//db = db.getSiblingDB('durc-db')

var bulk = db.content.initializeUnorderedBulkOp();

bulk.insert( { 	type: "hire", 
			  	heading: "Hiring the Premises", 
			  	content: "We have various rooms for hire",
			 	image: "/images/Locations/SideRoom-JuniorChurch.jpg"} );

bulk.execute();