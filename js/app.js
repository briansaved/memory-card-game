// Shuffle function from http://stackoverflow.com/a/2450976

const deck = document.querySelector('.deck'); //the deck parent
let card = document.getElementsByClassName('card'); //the Cards
let cards = ['anchor', 'anchor', 'bicycle', 'bicycle', 'bolt', 'bolt', 'bomb', 'bomb', 'cube', 'cube', 'diamond', 'diamond', 'leaf', 'leaf', 'paper-plane-o', 'paper-plane-o'];
let moves = document.querySelector('.moves');
let rating = document.getElementsByClassName('.fa-star');
let stars = [...rating];
let cardCount = cards.length / 2;
let openedCards = [];
let match = 0;
let movesCount = 0;
let firstClick = false;
let cardPair = [];


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

play();

let clicksListener = e => {
    if (e.target.classList.contains('card') && !e.target.classList.contains('show', 'open')) {
        e.target.classList.add('show', 'open');
        movesCount++;
        moves.innerHTML = movesCount;
        let currentCard = e.target;
        let icons = currentCard.firstElementChild.classList[1];
        openedCards.push(icons);
        cardPair.push(currentCard);

        if (openedCards.length === 2) {
            deck.removeEventListener('click', clicksListener);

            if (openedCards[0] === openedCards[1]) {
                match++;
                console.log('it\'s a match');
                openedCards = [];
                cardPair.forEach(c => {
                    c.classList.add('match');
                    c.classList.remove('open', 'show');
                });
                cardPair = [];

                if (cardCount === match) {
                    setTimeout(_ => {
                        alert(`Game Complete
               Click 'ok' to Play again`);
                        openedCards = [];
                        cardPair = [];
                        play();
                    }, 500);
                }
            } else {
                setTimeout(_ => {
                    cardPair.forEach(c => {
                        c.classList.remove('open', 'show');
                    });
                    openedCards = [];
                    cardPair = [];
                }, 500);
            }
            setTimeout(_ => {
                deck.addEventListener('click', clicksListener);
            }, 600);
        }
    } else {
        undefined;
    }
}

deck.addEventListener('click', clicksListener);
document.querySelector('.restart').addEventListener('click', _ => {
    play();
});
/*
    * set up the event listener
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