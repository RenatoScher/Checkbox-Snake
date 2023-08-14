let plr = {
    headCoordinate: [4, 7],
    bodyCoordinates: [
        [3, 7],
        [2, 7],
    ],
    direction: 1,
    move: 0,
};

let gameStarted = false;
let gamePaused = false;
let totalTime = 0;
const tableSize = 17; //17
const tickDelay = 100; //100
const board = document.getElementsByTagName("main")[0];
const startButton = document.getElementById("startIteraction");
const pauseButton = document.getElementById("pauseIteraction");
const stats = document.getElementById("stats");
console.log(board);

for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
        
        let checkBox =document.createElement("input");
        checkBox.type = "checkbox"
        checkBox.onclick = () => {
            return false;
        }
        board.appendChild(checkBox);

        if (i == 7 && j == 12) {
            checkBox.id = "apple"
            checkBox.checked = true;
        }
        
    }
}

let hasMoved = true;

document.addEventListener('keydown', function (e) {
    if (hasMoved == false) {return;}


    if (e.key == "w" || e.key == "ArrowUp") {
        if (plr.direction == 1) {return;}
        hasMoved = false;
        plr.move = -1;
        plr.direction = 1;

    } else if (e.key == "s" || e.key == "ArrowDown") {
        if (plr.direction == 1) {return;}
        hasMoved = false;
        plr.move = 1;
        plr.direction = 1;

    } else if (e.key == "a" || e.key == "ArrowLeft") {
        if (plr.direction == 0) {return;}
        hasMoved = false;
        plr.move = -1;
        plr.direction = 0;

    } else if (e.key == "d" || e.key == "ArrowRight") {
        if (plr.direction == 0) {return;}
        hasMoved = false;
        plr.move = 1;
        plr.direction = 0;
    }
})

function Tick() {
    if (gamePaused) {return;}

    move();
    drawPlr();

    totalTime += tickDelay / 1000;

    let minutes = Math.floor((Math.floor(totalTime/60) / 100 - Math.floor(Math.floor(totalTime/60) / 100)) * 10).toString() + ((Math.floor(totalTime/60) / 10 - Math.floor(Math.floor(totalTime/60) / 10)) * 10).toString();
    let seconds = (Math.floor((totalTime/100 - Math.floor(totalTime/100))*10) % 6).toString() + (Math.floor((totalTime/10 - Math.floor(totalTime/10))*10)).toString();
    let ms = Math.floor((totalTime - Math.floor(totalTime))*10).toString();

    stats.getElementsByTagName('p')[1].innerText = "Tempo percorrido: " + minutes + ":" + seconds + "." + ms;
    stats.getElementsByTagName('p')[2].innerText = "HC: [" + plr.headCoordinate + "]";
}

function getBox(Cd) {
    return board.children[(Cd[0]) + (Cd[1] * tableSize)];
}


function drawPlr() {
    getBox(plr.headCoordinate).checked = true;
    getBox(plr.headCoordinate).id = "head";

    for (let i = 0; i < plr.bodyCoordinates.length; i++) {
        getBox(plr.bodyCoordinates[i]).checked = true;
    }
}


function move() {
    if (!gameStarted || plr.move == 0) {
        return;
    }

    if (plr.headCoordinate[plr.direction] + plr.move < 0 || plr.headCoordinate[plr.direction] + plr.move >= tableSize) {
        death();
        return;
    }

    let tocomsono = []; tocomsono[0] = plr.headCoordinate[0];tocomsono[1] = plr.headCoordinate[1];
    tocomsono[plr.direction] += plr.move;
    if (getBox(tocomsono).checked == true && getBox(tocomsono).id != "apple") {death(); return;}

    getBox(plr.headCoordinate).id = null;

    let oldHeadCd = [];
    oldHeadCd[0] = plr.headCoordinate[0];
    oldHeadCd[1] = plr.headCoordinate[1];

    plr.headCoordinate[plr.direction] += plr.move;

    plr.bodyCoordinates.unshift(oldHeadCd);

    if (getBox(plr.headCoordinate).id != "apple") {
        let popped = plr.bodyCoordinates.pop();
        getBox(popped).checked = false;
        getBox(popped).id = null;
    } else {
        spawnApple();
    }

    hasMoved = true
}


function spawnApple() {
    stats.getElementsByTagName('p')[0].innerText = "Tamanho da Minhoca: " + (plr.bodyCoordinates.length + 1);

    let randomCd;

    while (true) {
        let randomX = Math.floor((Math.random() * tableSize));
        let randomY = Math.floor((Math.random() * tableSize));

        randomCd = [randomX, randomY];

        if (getBox(randomCd).checked == true) {continue;}

        break;
    }
    

    getBox(randomCd).checked = true;
    getBox(randomCd).id = "apple";

}


let deathInterval;
function death() {
    if (!gameStarted) {
        return;
    }
    gameStarted = false;
    clearInterval(interval);
    interval = null;

    let blink = false;

    if (!deathInterval) {
        deathInterval = setInterval(() => {
            for (const i of plr.bodyCoordinates) {
                getBox(i).checked = blink;
            }
            getBox(plr.headCoordinate).checked = blink;

            if (blink) {blink = false;} else {blink = true;}
        }, 600);
    }
}


let interval;
function startButtonPressed() {
    if (gameStarted) {
        gameStarted = false;
        startButton.innerText = "Começar";
        console.log("stop");
        clearInterval(interval);
        interval = null;

    } else {

        clearInterval(deathInterval);
        deathInterval = null;

        stats.getElementsByTagName('p')[0].innerText = "Tamanho da Minhoca: " + (plr.bodyCoordinates.length + 1);
        totalTime = 0;


        for (i of board.children) {
            i.checked = false;
            i.id = "";
        }
        plr = {
            size: 3,
            headCoordinate: [4, 7],
            bodyCoordinates: [
                [3, 7],
                [2, 7],
            ],
            direction: 0,
            move: 1,
        };

        getBox([12, 7]).id = "apple";
        getBox([12, 7]).checked = true;
        drawPlr();


        console.log("start");
        gameStarted = true;
        gamePaused = false;
        startButton.innerText = "Parar";
        pauseButton.innerText = "Pausar";
        if (!interval) {
            interval = setInterval(Tick, tickDelay);
        }

    }
}


function pauseButtonPressed() {
    if (gamePaused) {
        gamePaused = false;
        pauseButton.innerText = "Pausar";
    } else {
        gamePaused = true;
        pauseButton.innerText = "Retomar";
    }
}

drawPlr();
startButton.addEventListener('click', startButtonPressed);
pauseButton.addEventListener('click', pauseButtonPressed);