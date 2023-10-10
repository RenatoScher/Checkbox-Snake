let plr = {
    headCoordinate: [4, 7],
    bodyCoordinates: [],
    direction: 1,
    move: 0,
};

let modifiers = {

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
const customize = document.getElementById('customize');
let degrade = [[0, 0, 0], [0, 0, 255]];
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
    getBox(plr.headCoordinate).style.accentColor = "rgb(" + degrade[0][0] + ", " + degrade[0][1]+ ", " + degrade[0][2] + ")";

    let percentX = (degrade[1][0] - degrade[0][0]) / plr.bodyCoordinates.length;
    let percentY = (degrade[1][1] - degrade[0][1]) / plr.bodyCoordinates.length;
    let percentZ = (degrade[1][2] - degrade[0][2]) / plr.bodyCoordinates.length;

    for (let i = 0; i < plr.bodyCoordinates.length; i++) {
        getBox(plr.bodyCoordinates[i]).style.accentColor = "rgb(" + (degrade[0][0] + percentX * (i + 1)).toString() + ", " + (degrade[0][1] + percentY * (i + 1)).toString() + ", " + (degrade[0][2] + percentZ * (i + 1)).toString() + ")";
        getBox(plr.bodyCoordinates[i]).checked = true;

        console.log("rgb(" + (degrade[0][0] + percentX * (i + 1)) + ", " + (degrade[0][1] + percentY * (i + 1)) + ", " + (degrade[0][2] + percentZ * (i + 1)) + ")");
    }
}


function updateColors() {
    degrade[0][0] = parseInt(customize.querySelectorAll('input')[0].value);
    degrade[0][1] = parseInt(customize.querySelectorAll('input')[1].value);
    degrade[0][2] = parseInt(customize.querySelectorAll('input')[2].value);
    degrade[1][0] = parseInt(customize.querySelectorAll('input')[3].value);
    degrade[1][1] = parseInt(customize.querySelectorAll('input')[4].value);
    degrade[1][2] = parseInt(customize.querySelectorAll('input')[5].value);

    for (const e in degrade) {
        for (const e2 in degrade[e]) {
            if (isNaN(degrade[e][e2])) {
                degrade[e][e2] = 0;
            }
        }
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

    getBox(plr.headCoordinate).removeAttribute('id');
    getBox(plr.headCoordinate).removeAttribute('style');

    let oldHeadCd = [];
    oldHeadCd[0] = plr.headCoordinate[0];
    oldHeadCd[1] = plr.headCoordinate[1];

    plr.headCoordinate[plr.direction] += plr.move;

    plr.bodyCoordinates.unshift(oldHeadCd);

    if (getBox(plr.headCoordinate).id != "apple") {
        let popped = plr.bodyCoordinates.pop();
        getBox(popped).checked = false;
        getBox(popped).removeAttribute('id');
        getBox(popped).removeAttribute('style');
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

    customize.removeAttribute('style');

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

        customize.removeAttribute('style');

    } else {

        clearInterval(deathInterval);
        deathInterval = null;

        stats.getElementsByTagName('p')[0].innerText = "Tamanho da Minhoca: " + (plr.bodyCoordinates.length + 1);
        totalTime = 0;


        for (i of board.children) {
            i.checked = false;
            i.removeAttribute('id');
            i.removeAttribute('style');
        }

        const plrInputs = stats.getElementsByTagName("input");
        plr = {
            size: 3,
            headCoordinate: [Number(plrInputs[0].value), Number(plrInputs[1].value)],
            bodyCoordinates: [],
            direction: 0,
            move: 1,
        };

        getBox([12, 7]).id = "apple";
        getBox([12, 7]).checked = true;

        for (let i = 0; i < Number(plrInputs[2].value - 1); i++) {
            let head = [];
            head[0] = plr.headCoordinate[0];
            head[1] = plr.headCoordinate[1];

            if (head[0] - 1 >= 0) {
                plr.bodyCoordinates.push([head[0] - 1, head[1]])
            } else if (head[1] + 1 < tableSize) {
                plr.bodyCoordinates.push([head[0], head[1] + 1])
            } else if (head[1] + 1 > tableSize) {
                plr.bodyCoordinates.push([head[0], head[1] + 1])
            }
        }


        customize.style.display = 'none';


        updateColors();
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
        customize.style.display = "none";
    } else {
        gamePaused = true;
        pauseButton.innerText = "Retomar";
        customize.removeAttribute('style');
    }
}

drawPlr();
startButton.addEventListener('click', startButtonPressed);
pauseButton.addEventListener('click', pauseButtonPressed);