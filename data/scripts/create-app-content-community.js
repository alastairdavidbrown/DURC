db = db.getSiblingDB('durc-db')

var bulk = db.content.initializeUnorderedBulkOp();
bulk.insert( { 	type: "community", 
			  	heading: "Justicia", 
			  	content: "a fair trade shop in Bolton who supply us with goods to sell from our monthly Pop-Up shop after our Sunday Morning service. At Christmas we take our shop to the Christmas Fayre at Greenmount. It is not a fund raising effort but aimed at helping the shop to keep going and raise awareness. One of our members is on the Board of Justicia."} );

bulk.insert( { 	type: "community", 
			  	heading: "Churches Together in Ramsbottom", 
			  	content: "We have representation on the organising Committee and members of the congregation participate in the events during the year see the CTR website." } );
			  
bulk.insert( { 	type: "community", 
			  	heading: "Greenmount URC", 
			  	content: "This is the larger church in our Pastorate and we are invited to their events and special services. They are happy for us to join in with their choir on occasions and they come to join with us on occasions too." } );
			  

bulk.insert( { 	type: "community", 
			  	heading: "North Western Synod", 
			  	content: "As part of the United Reformed Church we keep in touch with what is going on at Synod and representatives attend the meetings." } );

bulk.insert( { 	type: "community", 
			  	heading: "The National Porch Scheme", 
			  	content: "This is run by a group of Bury and Radcliffe churches and we participate by donating food and groceries that are needed to be distributed to people facing a financial crisis in our North Manchester area." } );

bulk.insert( { 	type: "community", 
			  	heading: "St. Paul’s C.E. Salford", 
			  	content: "This is an area of deprivation where the Priest-in-charge Fr. Wyatt works very hard to meet the physical and spiritual needs of his parish we contribute toys at Christmas and other items when called upon through out the year." } );


bulk.execute();