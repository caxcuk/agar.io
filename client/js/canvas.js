const socket = io();


let players = [];

let currentId = -1;

let player1;
socket.on('coordinates', (coord) =>
{
    if (players[coord.id] && players[coord.id].id == currentId) {
        let speed = moveToMouse(players[coord.id].x, players[coord.id].y);
        players[coord.id].x += speed.x * players[coord.id].speed;
        players[coord.id].y += speed.y * players[coord.id].speed;
    }
});


let eats = [];

function preload()
{
}

function setup()
{
    console.log("Настройка");
    socket.on('connect', () =>
    {
        console.log('Connected to server');

        socket.emit('message', 'Hello World!');

    });

    socket.emit('getId');

    socket.on('getId', data =>
    {
        if (currentId == -1)
        {
            currentId = data;
            console.log("id: ", currentId);
        }
    });

    socket.emit('updatePlayers');

    socket.on('updatePlayers', (newPlayers) =>
    {
        players = newPlayers;
    })

    socket.on('changeEat', (eat) =>
    {
        eats = eat;
    })
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    fill(51);
    background(0, 200, 0);
    console.log(currentId);
    console.log("массив", players[currentId]);
}

console.log("aa");


function draw()
{
    socket.emit('updatePlayers');
    background(0, 200, 0);
    if (currentId != -1 && players[currentId])
    {
        translate(windowWidth / 2 - players[currentId].x, windowHeight / 2 - players[currentId].y);
    }

    socket.emit('changeEat');

    for (let eat of eats)
    {
        fill(eat.color);
        circle(eat.x, eat.y, eat.size);
    }

    for (let player of players)
    {
        if (player.id != currentId)
        {
            fill(200, 0, 0);
            circle(player.x, player.y, player.size);
        }
    }

    if (currentId != -1 && players[currentId])
    {
        fill(200, 0, 0);
        circle(players[currentId].x, players[currentId].y, players[currentId].size);
    }

    fill(51);
    rect(300, 300, 50);

    fill(34, 139, 34, 150);
    ellipse(30, 30, 50, 50);

    fill(139, 69, 19);
    ellipse(30, 30, 20, 20);

    if (currentId != -1 && players[currentId])
    {
        socket.emit('coordinates', {x: players[currentId].x, y: players[currentId].y, size: players[currentId].size, id: players[currentId].id});
        socket.emit('checkEat', {id: currentId,x: players[currentId].x, y: players[currentId].y, size: players[currentId].size});
    }
}

socket.on('checkEat', (rez) =>
{
    if (rez.rez && currentId == rez.id)
    {
        players[currentId].size += 10;
        socket.emit('updateOneElement', {id: currentId,size: players[currentId].size});
    }
});

socket.on('changeEat', (newEats) =>
{
    eats = newEats;
});

function printXY(x, y)
{
    setTimeout(() => console.log(x + " " + y), 2000);
}

function moveToMouse(x, y)
{
    let angle = atan2(mouseY - windowHeight / 2, mouseX - windowWidth / 2);
    let speedX = cos(angle);
    let speedY = sin(angle);
    return {x: speedX, y: speedY, angle: angle};
}

function random(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




