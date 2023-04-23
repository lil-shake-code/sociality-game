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
window_set_size(browser_width,browser_height+20)
camera_set_view_size(view_camera[0] , browser_width , 9*browser_width/16)
camera_set_view_pos(view_camera[0], x - browser_width/2 , y -browser_height/2)