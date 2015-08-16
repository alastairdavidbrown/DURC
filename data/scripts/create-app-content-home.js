//db = db.getSiblingDB('durc-db')

var bulk = db.content.initializeUnorderedBulkOp();

bulk.insert( { 	type: "home", 
			  	heading: "1883 - 1971 Our Origins", 
			  	content: "The church was formed on October 9th 1883 and was originally called “Dundee Independent Chapel”. It moved into it’s present building on Dundee Lane in 1885. The building was also used as a weekday school until the building of Hazelhurst School in 1901. After the first world war, when Rev. F. Robinson was Minister the church received a bequest and stained glass windows were purchased along with a new organ and Pulpit. During the depression in the 1930s the church was in financial difficulties but these were overcome by means of the Christmas Gift Days and other efforts. With the outbreak of the second world war many members volunteered or were called up, witness our War Memorial. During this time, the work of the church was carried on by those remaining at home, and afterwards everyone began working to make Dundee the centre of spiritual and social life in the community. A flourishing Dramatic society was formed and church members still have happy memories of productions and parts played. There was a Young Wives' Club which became the Ladies Fellowship. Throughout the years Sunday School (Junior Worship) has continued and is still in operation.",
			 	image: "/images/HomePageSmall/FrontApproach-Small.jpg"} );

bulk.insert( { 	type: "home", 
			  	heading: "1971 - 2000 Unification", 
			  	content: "By 1971, after much discussion, Dundee Lane Congregational Church and St. Andrew’s Presbyterian Church joined together to form one church which in 1972 became Dundee United Reformed Church.In 2000 with the closure of Park URC, Ramsbottom, there was an influx of members who were welcomed to Dundee. They brought their stained glass doors and large wooden cross to enhance Dundee and to help the Park-ites feel at home.For many years Dundee has been part of a Pastorate with Greenmount URC, this has meant that we share a Minister and come together for special events. We share a preaching team who come alternate Sundays when the Minister is not available.",
			 	image: "/images/HomePageSmall/TheAltar-Small.jpg"} );

bulk.insert( { 	type: "home", 
			  	heading: "Today", 
			  	content: "Our present Minister Rev. Andrew Lonsdale has been with us since2010 and he has brought a vision of how we can make ourselves more part of Ramsbottom 2015. We are working on improving our building to make it an asset to the members and the wider community. As people of God we are trying to be more outward looking. For many years we have held a regular Fair Trade stall after morning service, in conjunction with the Fair Trade shop “Justicia” in Bolton and have now become a Fair Trade Church. We have close links to Churches Together in Ramsbottom with our Church Secretary Stuart Lees being the Chairman/Secretary of CTR. Over the years we have responded generously in support of Charities and world disasters and a regular fund raiser has become our annual Macmillan Coffee morning, last year raising over £1000.",
		   		image: "/images/HomePageSmall/FairTrade-Small.jpg"} );


bulk.execute();