Lobby + server for a game of pong (or anything really)


Sockets.io cheat sheet so far
- socket.emit: send message to socket only.
- socket.broadcast.emit: broadcast to all clients+channels except socket
- io.emit: broadcast to all clients+channels
- .to(identifier): restrict any message/broadcast to a room or client. Alias of .in(identifier)?
- .of(identifier): restrict any message/broadcast to a namespace
- socket.join(identifier), socket.leave(identifier): joins/leave the socket to a room. Can be done server side only. Clients join a room with their name on connection.
- Namespace: can't be joined or leaved, is the endpoint path on which the socket connects
- any emit has the structure ('eventType', message). message can be a string or object. (unsure - kv pairs tested). if socket.send still work, it default to 'message' eventType.



1 On connection to the server, a client is registered in a lobby
2 On connection to the server, a client receives the number of players currently online
4 On game join, a client gets put at the bottom of the queque
5 On game init, both clients get notified that the game is ready
6 On confirmation from both players, the server starts the game
7 On game start, the server remove the two players from the queue if present
8 On disconnection from the server, a client is removed from the lobby
9 On disconnection from the server, a client is removed from the queue if present
10 On resources available (ahah this is going to be fun), the server pair the first 2 players in the queque and goes to game init

11 On connection to server, a client old connection should be mantained if one is present
12 On game join, a client will keep is queque position if already in it.
13 On queue exit, a client is removed from the queue
14 On game join, a client can specify an custom game name instead of entering the queue
