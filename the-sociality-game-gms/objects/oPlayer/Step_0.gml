if(keyboard_check(vk_up) or keyboard_check(ord("W")) ){
	sprite_index = sBatW
	y-=3
}
if(keyboard_check(vk_down) or keyboard_check(ord("S"))){
	sprite_index = sBatS
	y+=3
}
if(keyboard_check(vk_left) or keyboard_check(ord("A")) ){
	sprite_index = sBatA
	x-=3
}
if(keyboard_check(vk_right) or keyboard_check(ord("D"))){
	sprite_index = sBatD
	x+=3
}
//Bat moving out of room
if(x>2000){
	x-= 10;
}
if(x<0){
	x+= 10;
}
if(y>2000){
	y-= 10;
}
if(y<0){
	y+= 10;
}

//Camera and resizing
window_set_size(browser_width,browser_height+20)
camera_set_view_size(view_camera[0] , browser_width , 9*browser_width/16)

camera_set_view_pos(view_camera[0], x - browser_width/2 , y -browser_height/2)
var xPos = x - browser_width/2 
var yPos = y - browser_height/2 
if(x - browser_width/2 <0)  xPos = 0;
if(y - browser_height/2 <0)  yPos = 0;
camera_set_view_pos(view_camera[0], xPos ,  yPos)


//Multiplayer stuff
var Buffer = buffer_create(1, buffer_grow ,1);
var data = ds_map_create();
data[? "eventName"] = "state_update"
data[? "clientId"] = global.clientId
data[?"x"] = x
data[?"y"] = y	
buffer_write(Buffer , buffer_text  , json_encode(data));
network_send_raw(oClient.socket , Buffer , buffer_tell(Buffer));
ds_map_destroy(data);
