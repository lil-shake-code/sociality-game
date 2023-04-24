window_set_size(browser_width,browser_height)
var bh = display_get_gui_height()
var bw = display_get_gui_width()
var sc = 0.1*bw/1300

draw_set_color(c_white)
draw_roundrect(bw*0.35,bh*0.1,bw*0.65,bh*0.5,false)

draw_set_font(fGame);
draw_set_halign(fa_center)
draw_set_valign(fa_center)
draw_set_color(c_black)
draw_text_transformed(bw*0.5, bh*0.2 , "The Sociality Game" ,3*sc,3*sc,0)

draw_text_transformed(bw*0.5, bh*0.3 , "Enter to PLAY" ,3*sc,3*sc,0)
draw_sprite_ext(sBatS ,floor((0.008)*current_time) mod 4,bw*0.5, bh*0.4 ,20*sc,20*sc , 0,c_white ,1 )
if(keyboard_check_pressed(vk_enter)){
	global.username = get_string("Enter your name","")
	room_goto(rGame)
}
