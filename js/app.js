// Document.Ready Waits till DOM content is Loaded before running scripts
document.addEventListener('DOMContentLoaded', _ => {


    //Initial Declarations of the deck, the Cards and other variables
    const deck = document.querySelector('.deck');
    let card = document.getElementsByClassName('card');
    let cards = ['anchor', 'anchor', 'bicycle', 'bicycle', 'bolt', 'bolt', 'bomb', 'bomb', 'cube', 'cube', 'diamond', 'diamond', 'leaf', 'leaf', 'paper-plane-o', 'paper-plane-o'];
    let moves = document.querySelector('.moves');
    let rating = document.getElementsByClassName('fa-star');
    let stars = [...rating];
    let cardCount = cards.length / 2;
    let openedCards = [];
    let match = 0;
    let movesCount = 0;
    let cardPair = [];
    let seconds = 0;
    let minutes = 0;
    let timer = document.querySelector('.timer');
    let currentTime;
    let timerStarted = false;
    let modal = document.querySelector('.modal');
    let message = document.querySelector('.modal-text');
    let button = document.getElementById('ok');
    let close = document.querySelector('.x');



    // Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


    //The function that will create the game to play
    let play = _ => {

        let newPlay = shuffle(cards);
        deck.innerHTML = '';
        match = 0;
        movesCount = 0;
        moves.textContent = '0';


        for (let i = 0; i < newPlay.length; i++) {
            let cardContainer = document.createElement('li');
            cardContainer.classList.add('card');
            let icon = document.createElement('i');
            icon.classList.add('fa', 'fa-' + newPlay[i]);
            cardContainer.appendChild(icon);
            deck.appendChild(cardContainer);

        }
        timer.innerHTML = `0:00 s`
    }


    //Calling the Function to Play the Game
    play();


    //The Listening Function that determines what happens to the Cards
    //During the Game and what happens on Clicks
    let clicksListener = e => { //  prevented bug where Open Cards were being clicked and flipping(VVV /*open show*/)
        if (e.target.classList.contains('card') && !e.target.classList.contains('match') &&
            !e.target.classList.contains('show', 'open')) { //prevent double clicking or changing open & matched card
            e.target.classList.add('show', 'open'); //If card not open, add class to reveal it

            movesCount++; //Count each move/click, wrong or right.
            moves.innerHTML = Math.floor(movesCount / 2); //each card pair = a move.prevent 1.5 by using math.floor
            myTime(); //Starts the timer
            score(movesCount); //Call the score function to listen for rating

            let currentCard = e.target; //The card is what is clicked
            let icons = currentCard.firstElementChild.classList[1]; //The icon is inside card

            openedCards.push(icons); //Temporary Array for storing 2 icons to compare
            cardPair.push(currentCard); //Temporary Array for storing 2 cards to compare

            if (openedCards.length === 2) { //Condition of comparison to begin
                deck.removeEventListener('click', clicksListener); //Disable clicking during comparison

                if (openedCards[0] === openedCards[1]) { //Condition for matching icons
                    setTimeout(_ => {
                        match++; //Match increament to keep track of game progress
                        openedCards = []; //Clear the Temporary Array to allow more matches
                        cardPair.forEach(c => { //Going through the cards to add classes to keep them open
                            c.classList.add('match');
                            c.classList.remove('open', 'show');
                        });
                        cardPair = []; //Clear the temporary Cards Array to allow game to continue

                        if (cardCount === match) { //Condition for All cards matched/Game completed
                            setTimeout(_ => { //Delay to allow the last Card to show
                                message.innerHTML = (`Game Completed in ${(movesCount / 2)} moves after ${minutes}min : ${((seconds < 10) ? "0"+seconds : seconds )}secs
with a star rating of ${rating.length} ${((rating.length===1) ? "star." : "stars. ")}
Play again?`);
                                modal.classList.add('modal-show');
                                play(); //Populate new Game after pressing Okay on Modal
                                scoreReset(); //Reset the Star Rating
                                stopTime(); // Stop timer
                            }, 500); //dELAY Value of 1/2 a second
                        }
                    }, 300);
                } else { //Conditon if Cards do not match
                    setTimeout(_ => {
                        cardPair.forEach(c => {
                            c.classList.remove('open', 'show'); //remove added Classes for cards to close
                        });
                        openedCards = []; //empty temp Arrays to allow for new Matches
                        cardPair = [];
                    }, 500); //Delay Value for Cards to close
                }
                setTimeout(_ => { //Restore Event Listener that was removed During Verification
                    deck.addEventListener('click', clicksListener);
                }, 600);
            }
        } else {
            undefined; //When an Open card is clicked, Nothing Happens
        }
    }


    //Star Rating Function that removes stars. Receives 1 argument(movesCount)
    // Remember, 'times' is the number of click, so / 2 to get move pairs.
    let score = times => {
        if (times === 41) { //After 20 Moves The rating reduces by 1 Star
            stars[2].classList.remove('fa-star');
            stars[2].classList.add('fa-star-o');
        }

        if (times === 61) { //After 30 Moves The Rating reduces by a further star
            stars[1].classList.remove('fa-star');
            stars[1].classList.add('fa-star-o');
        }
    }


    //function that resets the Rating stars on new Game Play
    let scoreReset = _ => {
        stars[1].classList.add('fa-star'); //resets the stars
        stars[1].classList.remove('fa-star-o');
        stars[2].classList.add('fa-star');
        stars[2].classList.remove('fa-star-o');

        openedCards = []; //empty temp Arrays on reset
        cardPair = [];
        stopTime(); //stop the timer
    }


    //Function That displays Time
    let time = _ => {
        seconds++;
        if (seconds < 10) {
            timer.innerHTML = `${minutes}:0${seconds} s`;

        } else if (seconds === 60) {
            seconds = 0;
            minutes++;
            timer.innerHTML = `${minutes}:00 s`;

        } else {
            timer.innerHTML = `${minutes}:${seconds} s`;
        }
    }


    //Function That stops the timer
    let stopTime = _ => {
        clearInterval(currentTime); //Variable for setInterval
        minutes = 0; //Resets the time values
        seconds = 0;
        timer.innerHTML = `0:00 s`; //To avoid displaying old time
        timerStarted = false; // prepare for new timer

    }


    //Time Funtion definition
    let myTime = _ => {
        if (timerStarted) return; //Checks if timer is running, if running wont start a new timer id

        currentTime = setInterval(time, 1000); //if no timer is running, will start the timer
        timerStarted = true; //sets true to stop multiple timers from running
    }


    //Adding the event Listener to the Deck Itself
    deck.addEventListener('click', clicksListener);


    //Adding an Event listener to the restart button to be able to restart the Game
    document.querySelector('.restart').addEventListener('click', _ => {
        play();
        scoreReset();
        stopTime();
    });


    //Close Modal on Clicking x or button or outside messagebox
    window.onclick = e => {
        ((e.target === modal) || (e.target === close) || (e.target === button)) ? modal.classList.remove('modal-show'): undefined;
    }

}); //Close Document.Ready

/* set up the event listener
    for a card.If a card is clicked:
        *
        -display the card 's symbol (put this functionality in another function that you call from this one) *
        -add the card to a * list * of "open"
    cards(put this functionality in another
            function that you call from this one) *
        -
        if the list already has another card, check to see
    if the two cards match
        *
        +
        if the cards do match, lock the cards in the open position(put this functionality in another
            function that you call from this one) *
        +
        if the
    cards do not match, remove the cards from the list and hide the card 's symbol (put this functionality in another function that you call from this one) *
        +increment the move counter and display it on the page(put this functionality in another
            function that you call from this one) *
        +
        if all
    cards have matched, display a message with the final score(put this functionality in another
        function that you call from this one)*/