//example of reading data from server
		var buffer_raw = async_load[? "buffer"];
		var buffer_processed = buffer_read(buffer_raw , buffer_text);
		var realData = json_decode(buffer_processed);
		var eventName = realData[?"eventName"];
		
		switch(eventName){
			case "created_you":
				global.clientId = real(realData[?"id"]);
				break;
		
		
		}