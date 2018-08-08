var inquirer = require("inquirer");
var Word = require("./Word");
var words = require("./words");


function Game() {

  var self = this;

  this.play = function() {
    this.guessesLeft = 15;
    this.nextWord();
  };

  this.nextWord = function() {

    var randomWord = words[Math.floor(Math.random() * words.length)];

    this.currentWord = new Word(randomWord);

    console.log("\n" + this.currentWord + "\n");

    this.makeGuess();
  };


  this.makeGuess = function() {

    this.promptLetter().then(function() {

      if (self.guessesLeft < 1) {
        console.log(
          "You ran out of guesses \"" + self.currentWord.getSolution() + "\"\n"
        );
        self.askToPlayAgain();

        
      }
      else if (self.currentWord.guessedCorrectly()) {
        console.log("Correct!! Here is another...");
        self.guessesLeft = 10;
        self.nextWord();

      }
      else {
        self.makeGuess();
      }
    });
  };

  // Asks the user if they want to play again after running out of guessesLeft
  this.askToPlayAgain = function() {
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "choice",
          message: "Do you want to try again?"
        }
      ])
      .then(function(val) {
        // If the user says yes to another game, play again, otherwise quit the game
        if (val.choice) {
          self.play();
        }
        else {
          self.quit();
        }
      });
  };

  // Prompts the user for a letter
  this.promptLetter = function() {
    return inquirer
      .prompt([
        {
          type: "input",
          name: "choice",
          message: "Please use your keyboard to guess a letter...",
          validate: function(val) {
            return /[a-z1-9]/gi.test(val);
          }
        }
      ])
      .then(function(val) {
        // If the user's guess is in the current word, log that they chose correctly
        var didGuessCorrectly = self.currentWord.guessLetter(val.choice);
        if (didGuessCorrectly) {
          console.log("\nCORRECT!!!\n");

          // Otherwise decrement `guessesLeft`, and let the user know how many guesses they have left
        }
        else {
          self.guessesLeft--;
          console.log("\nINCORRECT!!!\n");
          console.log(self.guessesLeft + " guesses remaining!!!\n");
        }
      });
  };

  this.quit = function() {
    console.log("\nThanks For Playing!");
    // stops the program
    process.exit(0);
  };
}

module.exports = Game;
