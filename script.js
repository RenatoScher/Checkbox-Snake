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
const tableSize = 17; //17
const tick = 140;
const board = document.getElementsByTagName("main")[0];
const button = document.getElementById("iteraction");
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

document.addEventListener('keyup', function (e) {
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
    drawPlr();
}


function spawnApple() {
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
function buttonPressed() {
    if (gameStarted) {
        gameStarted = false;
        console.log("stop");
        clearInterval(interval);
        interval = null;

    } else {

        clearInterval(deathInterval);
        deathInterval = null;

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
        if (!interval) {
            interval = setInterval(function () {
                move()
            }, tick);
        }

    }
}

drawPlr();
button.addEventListener('click', buttonPressed);