'use strict';
const bucketEl = document.getElementById('bucket');     //get bucket element
const nextNumEl = document.getElementById('next-num');  //get next-num element
const modalMsg = document.getElementById('modal-msg');  //popup msg element
const isMoblie = (window.innerWidth <= 720);            // bolean for mobile or desktop 
const bucketH = isMoblie ? 90 : 120;                    // set bucket width and height to mobile or desktop
const bucketW = isMoblie ? 90 : 120;
let bucketY = window.innerHeight - bucketH;             //set bucket for screen bottom
let bucketX = bucketEl.style.left;                      //var for bucket place
let nextNum = 1;                                        //next number counter
let anim = 0;                                                                //var for animation holder
const arr = new Array(11);                                                  //array for nums
let random = Math.trunc(Math.random() * (window.innerWidth - 100)) + 70;    //random for falling x 
let dropFrame = Math.trunc(Math.random() * 80) + 50;                         //random for droping number frame drop
let dropNum = (Math.trunc(Math.random() * 10) + 1);              //random for droping number value
let dropDy = (Math.trunc(Math.random() * 2) + 3);                                                     //random for droping speed


const modalClass = document.querySelector('.modal');                         //msg modal class
const newGameButton = document.getElementById('new-game-btn');               //new game btn element   

bucketEl.style.top = `${bucketY}px`;                                        //set bucket Y to window size- 120px;

/*This function resets values and starts new game*/
const newGame = function () {
    nextNum = 1;
    nextNumEl.textContent = nextNum;
    for (let i = 1; i < 11; i++) {
        arr[i].y = 0;
        arr[i].elem.classList.add('hidden');
    }
    modalClass.classList.add('hidden');
    game();
};
/*Display game over popup with msg missed or wrong number catch*/
const gameOver = function (msg) {
    cancelAnimationFrame(anim);
    modalMsg.textContent = msg;
    modalClass.style.backgroundColor = 'red';
    modalClass.classList.remove('hidden');
};
/*Display game won popup*/
const gameWon = function () {
    cancelAnimationFrame(anim);
    modalMsg.textContent = `You Won 🥳🥳`;
    modalClass.style.backgroundColor = 'lime';
    modalClass.classList.remove('hidden');
};
/* constructor for fallingNums */
class fallingNum {
    constructor(x, y, val, dy) {
        this.x = x;
        this.y = y;
        this.val = val;
        this.dy = dy;
        this.elem = document.getElementById(`num${val}`);
    }
    /* This func sets number and its fall starting position */
    draw() {
        if (this.elem.classList.contains('hidden')) {
            this.elem.classList.remove('hidden');
            random = Math.trunc(Math.random() * (window.innerWidth - 100)) + 70;
            dropDy = (Math.trunc(Math.random() * 2) + 3);
            this.dy = dropDy;                           //random drop value
            this.x = random;                            //random position
            this.elem.style.top = `20px`;               //starts 20px below top
            this.elem.style.left = `${this.x}px`;
        }
    }
    /*this function reduce number Y and check for collision with bucket*/
    update() {
        if (!this.elem.classList.contains('hidden')) {
            this.y += this.dy;
            this.elem.style.top = `${this.y}px`;
            if (this.y >= (bucketY - (bucketH / 4))) {
                if (this.val === nextNum) {
                    if (this.x > (bucketX - (bucketW / 2)) && this.x < (bucketX + (bucketW / 2))) {
                        this.elem.classList.add('hidden');
                        this.y = 0;
                        nextNum++;
                        if (nextNum === 11)
                            gameWon();
                        nextNumEl.textContent = nextNum;
                    }
                    else
                        gameOver(`Game Over: missed number.`);
                }
                else {
                    if (this.x < (bucketX - (bucketW / 2)) || this.x > (bucketX + (bucketW / 2))) {
                        this.y = 0;
                        this.elem.classList.add('hidden');
                    }
                    else
                        gameOver(`Game Over: wrong number catched.`);
                }
            }
        }
    }
}



/* fill arr with numbers and their elements, fills only 1-10 and only 1 time each*/
for (let i = 1; i < 11; i++) {
    arr[i] = new fallingNum(0, 0, i, 3);
    arr[i].elem.style.position = 'absolute';
}

/*game animation*/
function game() {
    anim = requestAnimationFrame(game);
    for (let i = 1; i < 11; i++)
        arr[i].update();
    if (anim === dropFrame) {
        arr[dropNum].draw();
        dropFrame += Math.trunc(Math.random() * 35) + 20;
        dropNum = (Math.trunc(Math.random() * 10) + 1);
    }
}
/*Event listeners*/
window.addEventListener('touchmove', function (e) {                 //Event listener for touch
    let x = e.touches[0].clientX;
    if (x < (window.innerWidth - 45)) {
        bucketEl.style.left = `${x}px`;
        bucketX = x;
    }
});
document.addEventListener('mousemove', function (e) {               //Event listener for mouse
    bucketEl.style.left = `${e.pageX}px`;
    bucketX = e.pageX;
});
newGameButton.addEventListener('click', function (e) {              //Event listener for New Game button
    modalClass.classList.add('hidden');
    newGame();
})
/*main starts here*/
nextNumEl.textContent = 1;                                          //Set next number display 1
game();