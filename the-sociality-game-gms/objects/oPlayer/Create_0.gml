image_xscale = 3
image_yscale = image_xscale
oClient.socket = network_create_socket(network_socket_wss)
oClient.connect = network_connect_raw_async( oClient.socket, "the-sociality-game.uk.r.appspot.com" , "8081")
