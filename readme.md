Lobby + server for a game of pong (or anything really)

1 On connection to the server, a client is registered in a lobby
2 On connection to the server, a client receives the number of players currently online
3 On game join, a client can specify an adversary id and be paired with him
4 On game join, a client gets put at the bottom of the queque
5 On game init, both clients get notified that the game is ready
6 On confirmation from both players, the server starts the game
7 On game start, the server remove the two players from the queue if present
8 On disconnection from the server, a client is removed from the lobby
9 On disconnection from the server, a client is removed from the queue if present
10 On resources available (ahah this is going to be fun), the server pair the first 2 players in the queque and goes to game init
