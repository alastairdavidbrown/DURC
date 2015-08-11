//db = db.getSiblingDB('durc-db')

var bulk = db.content.initializeUnorderedBulkOp();
bulk.insert( { 	type: "event", 
			  	heading: "Sunday Service", 
			  	content: "Our Minister takes this service on alternate weeks and a member of the Pastorate Preaching Team will take the intervening weeks. Three or Four times a year we have a Café Style (ACE- A Café Experience) Service which is popular with most people, particularly the Uniformed organisations. At Christmas we have a tradition of Brownies and Rainbows presenting the Nativity Story for us and we hold a Carols by Candlelight Service with refreshments to follow.( see Digest for Preacher/Communion/Parades etc.)"} );

bulk.insert( { 	type: "event", 
			  	heading: "Junior Church", 
			  	content: "This is held each Sunday morning by a team of workers who run a programme for all ages to bring the word of Jesus to our children."} );

bulk.insert( { 	type: "event", 
			  	heading: "Bible Study", 
			  	content: "This is a joint meeting and held at Greenmount, twice a month on a Tuesday evening for more details contact Rev."} );

bulk.insert( { 	type: "event", 
			  	heading: "Ladies Coffee, Chat and Communion (CCC)", 
			  	content: "Wednesday 7.30 pm, every six weeks or so. A lovely group of ladies, who come together for Fun and Friendship. A topic is chosen for the chat and members are encouraged to bring along a story and things associated with the topic, it is a jolly affair!"} );

bulk.insert( { 	type: "event", 
			  	heading: "Guides", 
			  	content: "Thursday 7.30 – 9.15 pm for girls age 10 – 15 years. More badge work and trips, craft and camping this year there is the chance to go to Switzerland and they are going to a pop concert."} );

bulk.insert( { 	type: "event", 
			  	heading: "Brownies", 
			  	content: "Tuesday 6.30 – 8.0pm for girls aged 7 – 10 years. They do badge work (wild life, entertainer, craft, knots, music maker etc.) play games, craft work, Brownie pack holiday, cooking, swimming, trips. As with Rainbows, a chance to make new friends and have fun."} );

bulk.insert( { 	type: "event", 
			  	heading: "Rainbows", 
			  	content: "Tuesday 6.00 - 7.00pm for girls aged 5 – 7 years. They play games, do Craft work, singing and generally have fun, a good opportunity to make new friends and socialise."} );

bulk.insert( { 	type: "event", 
			  	heading: "Book Club", 
			  	content: "3rd Thursday of the month 7.30 pm"} );

bulk.execute();