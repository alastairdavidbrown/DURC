//db = db.getSiblingDB('durc-db')

var bulk = db.content.initializeUnorderedBulkOp();

bulk.insert( { 	type: "rent", 
			  	heading: "Hiring the Premises", 
			  	content: "The church was formed on October 9th 1883 and was originally called “Dundee Independent Chapel”. It moved into it’s present building on Dundee Lane in 1885. The building was also used as a weekday school until the building of Hazelhurst School in 1901. After the first world war, when Rev. F. Robinson was Minister the church received a bequest and stained glass windows were purchased along with a new organ and Pulpit. During the depression in the 1930s the church was in financial difficulties but these were overcome by means of the Christmas Gift Days and other efforts. With the outbreak of the second world war many members volunteered or were called up, witness our War Memorial. During this time, the work of the church was carried on by those remaining at home, and afterwards everyone began working to make Dundee the centre of spiritual and social life in the community. A flourishing Dramatic society was formed and church members still have happy memories of productions and parts played. There was a Young Wives' Club which became the Ladies Fellowship. Throughout the years Sunday School (Junior Worship) has continued and is still in operation.",
			 	image: "/images/HomePageSmall/FrontApproach-Small.jpg"} );

bulk.execute();