//db = db.getSiblingDB('durc-db')

var bulk = db.content.initializeUnorderedBulkOp();

bulk.insert( { 	type: "hire", 
			  	heading: "Hiring the Premises", 
			  	content: " As you will see from the photos we have some good accommodation which is available to hire for a variety of events, parties, meetings, weddings, funerals, exhibitions, conferences. The following booking fees apply: Hall including Kitchen £30; Large side room including Kitchen £20.  Lettings are for 2 hours initially then plus 1-hour sessions, The cost is from entering to leaving the  premises, a £20 deposit is charged along with the booking fee, both payable up front. The deposit will be returned, a week  later, if everything is left in an orderly manner.  All hirers should leave the building as they find it, an indemnity certificate must be signed. A small charge will be made if the churches cutlery and crockery are used. The Fire Regulation sheet must be read and signed. Use the contact page if you want to make a booking",
			 	image: "/images/Locations/SideRoom-JuniorChurch.jpg"} );

bulk.execute();