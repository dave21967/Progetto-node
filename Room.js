class Room {
    constructor() {
        this.players = {};
        this.mode = '';
    }

    addPlayer(p) {
        this.players[p.id] = p;
    }

    removePlayer(p) {
        delete this.players[p.id];
    }

    broadcast(event) {
        for(var key in this.players) {
            this.players[key].send(JSON.stringify(event));
        }
    }
}

module.exports = {
    Room,
}