let path = require("path");
let http = require("http");
//const {generateEat,Eat,random} = require("../client/js/eats.js");
let express = require("express");
let socketIo = require("socket.io");

let publicPath = path.join(__dirname, '../');
let port = process.env.PORT || 2000;
let app = express();
let server = http.createServer(app);
let io = socketIo(server);
app.use(express.static(publicPath));

server.listen(port, function ()
{
    console.log("server started on" + port);
})

let players = [];

/*let Player = function (startX, startY)
{
    return {
        id: -1,
        size: 50,
        x: startX,
        y: startY,
        speed: 1,
        changePosition()
        {
            socket.emit('coordinates', {x: this.x, y: this.y, size: this.size,id: this.id});
        }
    };
};*/

class Player
{
    constructor(id, x, y, size, speed)
    {
        this.id = id;
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
    }

    changePosition()
    {
        socket.emit('coordinates', {x: this.x, y: this.y, size: this.size, id: this.id});
    }

}

function generateEat(amountOfEat)
{
    let arrOfEats = [];
    for (let i = 0; i < amountOfEat; i++)
    {
        arrOfEats.push(new Eat());
        console.log(arrOfEats[i].color);
    }
    return arrOfEats;
}

class Eat
{
    constructor()
    {
        this.x = random(-1000, 1000);
        this.y = random(-1000, 1000);
        this.color = random(1, 255);
        this.size = 10;
    }
}

function random(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkEat(arrOfEat, player)
{
    for (let i = 0; i < arrOfEat.length; i++)
    {
        if (Math.abs(arrOfEat[i].x - player.x) < player.size / 2 && Math.abs(arrOfEat[i].y - player.y) < player.size / 2)
        {
            //player.size += 10;
            eats.splice(i, 1);
            return true;
        }
    }
    return false;
}

let eats = generateEat(100);
/*let newEats = [];
for (let i = 0;i < eats.length;i++)
{
    newEats.push({x: eats[i].x, y: eats[i].y, color: eats[i].color});
}*/
let playersCounter = 0;
io.on('connection', function (socket)
{
    console.log("user connected");

    socket.on("message", function (data)
    {
        console.log(data);
    })
    socket.on('coordinates', (data) =>
    {
        //console.log(`Сервер отпрпвил координаты {${data.x},${data.y}}`);
        if(players[data.id])
        {
            players[data.id].x = data.x;
            players[data.id].y = data.y;
            io.emit('coordinates', data)
        }

    })

    socket.on('test', function (socket)
    {
        io.emit('test', 'server otvet');
        console.log("test");
    })

    socket.on('changeEat', () =>
    {
        io.emit('changeEat', eats);
    })

    socket.on('checkEat', (coord) =>
    {
        io.emit('checkEat', {rez:checkEat(eats, coord),id: coord.id});
    })

    io.emit('getEat', eats);

    socket.on('getId', () =>
    {
        players.push(new Player(playersCounter, 0, 0, 50, 5));
        io.emit('getId', playersCounter++);
    });

    socket.on('updatePlayers', () =>
    {
        io.emit('updatePlayers', players);
    });

    socket.on('updateOneElement', (data) =>
    {
        players[data.id].size = data.size;
    })
})


