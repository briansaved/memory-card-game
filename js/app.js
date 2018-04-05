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
    let firstClick = false;
    let cardPair = [];


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
    }

    //Calling the Function to Play the Game

    play();


    //The Listening Function that determines what happens to the Cards
    //During the Game and what happens on Clicks

    let clicksListener = e => {
        if (e.target.classList.contains('card') && !e.target.classList.contains('show', 'open')) {
            e.target.classList.add('show', 'open'); //If card not open, add class to reveal it
            movesCount++; //Count each move/click, wrong or right.
            moves.innerHTML = movesCount;
            score(movesCount); //Call the score function to listen for rating
            let currentCard = e.target; //The card is what is clicked
            let icons = currentCard.firstElementChild.classList[1]; //The icon is inside card
            openedCards.push(icons); //Temporary Array fro storing 2 icons to compare
            cardPair.push(currentCard); //Temporary Array for storing 2 cards to compare

            if (openedCards.length === 2) { //Condition of comparison to begin
                deck.removeEventListener('click', clicksListener); //Disable clicking during comparison

                if (openedCards[0] === openedCards[1]) { //Condition for matching icons
                    match++; //Match increament to keep track of game progress
                    openedCards = []; //Clear the Temporary Array to allow more matches
                    cardPair.forEach(c => { //Going through the cards to add classes to keep them open
                        c.classList.add('match');
                        c.classList.remove('open', 'show');
                    });
                    cardPair = []; //Clear the temporary Cards Array to allow game to continue

                    if (cardCount === match) { //Condition for All cards matched/Game completed
                        setTimeout(_ => { //Delay to allow the last Card to show
                            alert(`Game Complete
                               Click 'ok' to Play again`);
                            openedCards = []; //Clear Arrays for next Game
                            cardPair = [];
                            play(); //Populate new Game after pressing Okay on alert message
                            scoreReset(); //Reset the Star Rating
                        }, 500); //dELAY Value of 1/2 a second
                    }
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

    let score = times => {
        if (times === 25) { //After 24 Moves The rating reduces by 1 Star
            stars[2].classList.remove('fa-star');
            stars[2].classList.add('fa-star-o');
        }

        if (times === 33) { //After 32 Moves The Rating reduces by a further star
            stars[1].classList.remove('fa-star');
            stars[1].classList.add('fa-star-o');
        }
    }


    //function that resets the Rating stars on new Game Play

    let scoreReset = _ => {
        stars[1].classList.add('fa-star');
        stars[1].classList.remove('fa-star-o');
        stars[2].classList.add('fa-star');
        stars[2].classList.remove('fa-star-o');
    }


    //Adding the event Listener to the Deck Itself

    deck.addEventListener('click', clicksListener);


    //Adding an Event listener to the restart button to be able to restart the Game

    document.querySelector('.restart').addEventListener('click', _ => {
        play();
        scoreReset();
    });

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