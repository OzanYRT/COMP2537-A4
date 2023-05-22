let firstCard = undefined;
let secondCard = undefined;
let clicks = 0;
let pokemonData = [];
let totalPairs = 0;
let matches = 0;
let pairsLeft = 0;
let time = 0;
let timerInterval = null;


const updateTime = () => {
    time++;
    $("#timer").text(time);
    if (time >= 60) { // Stop the game after 60 seconds
        clearInterval(timerInterval);
        alert("Time's up! Game over.");
    }
};


// Fetch Pokémon data
// Fetch Pokémon data
const getPokemonData = async (numCards) => {
    try {
        pokemonData = [];
        for (let i = 0; i < numCards; i++) {
            const randomId = Math.floor(Math.random() * 151) + 1; 
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const pokeData = await res.json();
            const pokemon = {
                name: pokeData.name,
                url: pokeData.url,
                imageFront: pokeData.sprites.other["official-artwork"].front_default,
                imageBack: pokeData.sprites.other["official-artwork"].front_default
            };
            
            pokemonData.push(pokemon);
        }

        pokemonData = [...pokemonData, ...pokemonData];
        pokemonData.sort(() => Math.random() - 0.5);
        totalPairs = numCards;
        matches = 0;
        pairsLeft = numCards;
        $("#total").text(totalPairs);
        $("#matches").text(matches);
        $("#left").text(pairsLeft);
        renderCards();
        time = 0; // Reset the time
        $("#timer").text(time);
        timerInterval = setInterval(updateTime, 1000); // Update the time every second
    } catch (error) {
        console.error('Error:', error);
    }
};


// Render cards
const renderCards = () => {
    const gameGrid = $('#game_grid');
    pokemonData.forEach((pokemon, index) => {
        const card = $('<div>').addClass('card');
        const frontFace = $('<img>').addClass('front_face').attr('src', pokemon.imageFront).attr('id', `card${index}`);
        const backFace = $('<img>').addClass('back_face').attr('src', 'back.webp'); 
        card.append(backFace, frontFace); 
        gameGrid.append(card);
    });
    setup();
};


const setup = () => {
    $(".card").on("click", function () {
        if ($(this).hasClass("flip") || $(this).hasClass("matched") || $(".flip").length == 2) {
            return;
        }
        $(this).addClass("flip");
        clicks++;
        $("#clicks").text(clicks);

        if (!firstCard) {
            firstCard = $(this);
        } else {
            secondCard = $(this);
            if ($(firstCard).find(".front_face").attr('src') == $(secondCard).find(".front_face").attr('src')) {
                $(firstCard).addClass("matched").removeClass("flip");
                $(secondCard).addClass("matched").removeClass("flip");
                $(firstCard).off("click");
                $(secondCard).off("click");
                firstCard = undefined;
                secondCard = undefined;
                matches++;
                pairsLeft--;
                $("#matches").text(matches);
                $("#left").text(pairsLeft);
                if ($(".card:not(.matched)").length == 0) {
                    clearInterval(timerInterval);
                    setTimeout(() => {
                        alert("Congratulations! You have won the game! Time taken: " + time + " seconds");
                    }, 1000);
                }
            } else {
                setTimeout(() => {
                    $(firstCard).removeClass("flip");
                    $(secondCard).removeClass("flip");
                    firstCard = undefined;
                    secondCard = undefined;
                }, 1000);
            }
        }
    });
};

$(document).ready(function() {
  // On page load, set the theme from localStorage or default to light
  const theme = localStorage.getItem('theme') || 'light';
  $("body").toggleClass("dark-mode", theme === 'dark');

  $("#powerup").click(function() {
    // Flip all the cards
    $(".card:not(.matched)").addClass("flip");

    // After 2 seconds, flip them back
    setTimeout(function() {
        $(".card:not(.matched)").removeClass("flip");
    }, 2000);

    // Disable the power-up button after use
    $(this).prop("disabled", true);
});

  $("#option1").click(function() {
    $('#game_grid').empty();
    getPokemonData(2); // 2 pairs of cards for easy mode
  });

  $("#option2").click(function() {
    $('#game_grid').empty();
    getPokemonData(3); // 3 pairs of cards for medium mode
  });

  $("#option3").click(function() {
    $('#game_grid').empty();
    getPokemonData(4); // 4 pairs of cards for hard mode
  });

  $("#start").click(function() {
    $(this).hide();
    $("#info").show();
    $("#game_grid").show();
    $("#themes").show();
  });

  $("a").click(function() {
    $("#start").show();
    $("#info").hide();
    $("#game_grid").hide();
    $("#themes").hide();
  });

  // When the theme buttons are clicked, save the theme in localStorage
  $("#dark").click(function() {
    $("body").addClass("dark-mode");
    localStorage.setItem('theme', 'dark');
    });
    
    $("#light").click(function() {
    $("body").removeClass("dark-mode");
    localStorage.setItem('theme', 'light');
    });
    
    });
