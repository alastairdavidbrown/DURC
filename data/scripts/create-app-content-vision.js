//db = db.getSiblingDB('durc-db')

var bulk = db.content.initializeUnorderedBulkOp();
bulk.insert( { 	type: "vision", 
			  	heading: "Service", 
			  	content: "Creation of a new, less structured, service three or four times a year, half waybetween ACE (Alternative Café Experience) and our normal service. Organised by a new team."});

bulk.insert( { 	type: "vision", 
			  	heading: "Seating", 
			  	content: "A change in the arrangement of the chairs."});

bulk.insert( { 	type: "vision", 
			  	heading: "Coffee Mornings", 
			  	content: "To be held throughout the year supporting local charities."});

bulk.insert( { 	type: "vision", 
			  	heading: "Afternoon Demonstrations", 
			  	content: "To be held throughout the year supporting local charities."});

bulk.insert( { 	type: "vision", 
			  	heading: "The Digital Era", 
			  	content: "Build our very own Web Presence"});

bulk.insert( { 	type: "vision", 
			  	heading: "Roof Repairs", 
			  	content: "To Renew and make all repairs necessary to ensure that the roof is fully weather tight. This was completed and we have no problems now."});

bulk.insert( { 	type: "vision", 
			  	heading: "More Space", 
			  	content: "Build a part window partition at the back of the church creating an Anti-room with doors into the main body of the church therefore acting as an overflow or as a separate room. This could then be a gathering room and with access to the kitchen could be a coffee lounge area."});

bulk.insert( { 	type: "vision", 
			  	heading: "Stage", 
			  	content: "Reduce the size of the stage"});

bulk.insert( { 	type: "vision", 
			  	heading: "Kitchen Refurb", 
			  	content: "Redecorate the kitchen and make a doorway through to the Toilet Area and Side Rooms."});

bulk.insert( { 	type: "vision", 
			  	heading: "Wheelchair Access", 
			  	content: "Design a new sloping path across the garden entering from the top end of Dundee Lane. Still retaining the existing pathway."});

bulk.insert( { 	type: "vision", 
			  	heading: "Renewable Energy", 
			  	content: "Build a solar farm to generate income!"});

bulk.execute();
			  
			  













