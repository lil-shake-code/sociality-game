switch(async_load[?"type"]){
	case network_type_non_blocking_connect:
		//code that executes when we have connected
		//tell the server to create a player for us
		
		
		var Buffer = buffer_create(1, buffer_grow ,1);
		var data = ds_map_create();
		data[? "eventName"] = "create_me"
		data[?"name"] = global.username
	
		buffer_write(Buffer , buffer_text  , json_encode(data));
		network_send_raw(socket , Buffer , buffer_tell(Buffer));
		ds_map_destroy(data);
		break;
		
		
		
	case network_type_data:
		var buffer_raw = async_load[? "buffer"];
		var buffer_processed = buffer_read(buffer_raw , buffer_text);
		//show_message("buffer processed is "+buffer_processed)
		var realData = json_parse(buffer_processed)
		var eventName = realData.eventName;
		
		switch(eventName){
			case "created_you":
				//DO SOMETHING
				global.clientId = real(realData.clientId)
				show_message("Welcome to the Server! Your client id is saved as : "+string(global.clientId))
				break;	
				
				case "global_state_update":
				var found = false;
				with(oOtherPlayer){
					if(clientId == realData.clientId){
						found = true;
						if(realData.y > y ){
							sprite_index = sBatW
							
						}
						if(realData.y < y ){
							sprite_index = sBatS
							
						}
						if(realData.x < x ){
							sprite_index = sBatA
						
						}
						if(realData.x > x ){
							sprite_index = sBatD
							
						}
						x = lerp(x , realData.x , 0.5)
						y = lerp(y , realData.y , 0.5)
						
					}
				}
				//if not found this player create
				if(!found){
					var new_enemy = instance_create_layer(realData.x,realData.y,"Instances",oOtherPlayer)
					new_enemy.clientId = realData.clientId;
					new_enemy.enemy_username = realData.username
				}
				break;
		}	
		break;
		
		

}