$(document).ready(function () {

    // triviaGame is the object which contains everything needed for the game
    var triviaGame = {
        QUESTION_TIMEOUT: 30,         // seconds
        TIME_BTW_QUESTIONS: 7,        // seconds
        questions: [],                // array of question - will be init'ed at start of the game
        currentQuestionIndex: 0,      // index of current round's question
        correctAnswers: 0,            // tally of correct answers
        incorrectAnswers: 0,          // tally of incorrect answers
        noAnswer: 0,                  // tally of no answer (out of time)
        intervalId: null,             // interval handle for the countdown timer for each question
        time: 0,                      // keeps # of secs left during each round

        addQuestion: function (prompt, answers, correctAnswerIndex, correctAnswerText, answerImg) {
            // Add a question object to the game's questions array
            var question = {
                prompt: prompt,
                answers: answers,
                correctAnswer: correctAnswerIndex,
                correctAnswerText: correctAnswerText,
                answerImg: answerImg,
            };

            this.questions.push(question);
        },

        initQuestions: function () {
            // Initialize all the questions
            this.addQuestion(
                "Samite is a type of what?",
                ["Dog", "Stone", "Fabric", "Cake"],
                2,
                "Fabric (a heavy silk interwoven with gold and silver thread, used in dressmaking and decoration in the Middle Ages - the name is from Greek hexamiton, meaning 'six thread')",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/The_%22Martyr_Cope%22_%281270%29.jpg/300px-The_%22Martyr_Cope%22_%281270%29.jpg");

            this.addQuestion(
                "Vermillion is a shade of which colour?",
                ["Green", "Blue", "Red", "Yellow"],
                2,
                "Red",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Red_tikka_powder.jpg/220px-Red_tikka_powder.jpg");

            this.addQuestion(
                "In summer 2010 what species produced offspring in the wild in the UK for the first time in around 400 years after reintroduction to Scotland?",
                ["Reindeer", "Bear", "Wolf", "Beaver"],
                3,
                "Beaver",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/American_Beaver.jpg/220px-American_Beaver.jpg");

            this.addQuestion(
                "A caparison is an ornamental cloth used to cover a what?",
                ["Altar", "Horse", "Wall", "Window"],
                1,
                "Horse (it's a cover fitted over the saddle, from the Spanish word capa, meaning hood).",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Medieval-Jousting-Tournaments.jpg/400px-Medieval-Jousting-Tournaments.jpg");

            this.addQuestion(
                "If something coruscates, what does it do?",
                ["Expands", "Fades", "Sparkles", "Shrinks"],
                2,
                "Sparkles (from Latin coruscare)",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Christmas_baubles_and_sparkler_%2802%29.jpg/220px-Christmas_baubles_and_sparkler_%2802%29.jpg");

            this.addQuestion(
                "In anatomy, 'plantar' relates to which part of the human body?",
                ["Foot", "Stomach", "Head", "Hand"],
                0,
                "Foot (specifically the sole of the foot, from Latin planta, meaning sole)",
                "http://teachmeanatomy.info/wp-content/uploads/Diagram-of-the-Sensory-or-Cutaneous-Innervation-of-the-Sole-of-the-Foot.jpg");

            this.addQuestion(
                "A 2010 publicity-driven competition called the Carbuncle Cup focused on unpopular British what?",
                ["Architecture", "Politicians", "Corporations", "Law"],
                0,
                "Architecture (or buildings - carbuncle refers to a big round red precious stone, or to an abscess or pimple on the face or neck). In 1984 Prince Charles called the planned National Gallery extension in London a 'monstrous carbuncle')",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Strata_SE1_from_Monument_2014.jpg/800px-Strata_SE1_from_Monument_2014.jpg");

            this.addQuestion(
                "Sfumato is a technique in what?",
                ["Cooking", "Painting", "Martial Arts", "Meditation"],
                1,
                "Painting (tones blended together avoiding sharp outlines - from 1800s Italian, sfumare, meaning shaded-off)",
                "https://upload.wikimedia.org/wikipedia/commons/5/5f/MonaLisa_sfumato.jpeg");

            this.addQuestion(
                "In Dubai, Palm Jumeirah is a what?",
                ["Artificial island development", "Camel-meat curry", "Scented aphrodisiac soap", "Public holiday"],
                0,
                "Artificial island development",
                "https://www.venturesonsite.com/news/wp-content/uploads/2016/02/palm-jumeirah.jpg");

            this.addQuestion(
                "Catalonia, the Spanish Autonomous Community region comprising provinces Barcelona, Girona, Lleida and Tarragona, banned what in 2010 with effect from 2012?",
                ["Lap-dancing", "Bullfighting", "Smoking in public outdoors", "Door-to-door selling"],
                1,
                "Bullfighting",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Madrid_Bullfight.JPG/269px-Madrid_Bullfight.JPG");
        },

        startGame: function () {
            // init everything and start the game
            triviaGame.currentQuestionIndex = 0;
            triviaGame.correctAnswers = 0;
            triviaGame.incorrectAnswers = 0;
            triviaGame.noAnswer = 0;

            // remove play button. We don't need it during play
            $(".btn-primary").remove();

            // if we are restarting game, also remove the panels that are left over from previous round
            $("#top-panel").remove();
            $("#bottom-panel").remove();

            //set up top and bottom panels on screen for play
            $("#game-area").append(
                "<div id=\"top-panel\" class=\"panel panel-default\">" +
                "</div>" +
                "<div id=\"bottom-panel\" class=\"panel panel-default\">" +
                "</div>"
            );

            // start posing the questions
            triviaGame.nextQuestion();
        },

        nextQuestion: function () {
            // Ask the next question on screen and time the user

            // set up top and bottom panels for the next question
            // top panel is for time remaining (countdown timer)
            $("#top-panel").html(
                "<div class=\"panel-body\">" +
                "You have <span id=\"seconds\">" + triviaGame.QUESTION_TIMEOUT + "</span> seconds remaining" +
                "</div>"
            );
            // bottom panel is where the question and answer options are displayed
            $("#bottom-panel").html(
                "<div class=\"panel-heading\">" +
                "<h3 class=\"panel-title\">" +
                triviaGame.questions[triviaGame.currentQuestionIndex].prompt +
                "</h3>" +
                "</div>" +
                "<div class=\"panel-body\">" +
                "<p id=\"answer-0\" class=\"opt\">" + triviaGame.questions[triviaGame.currentQuestionIndex].answers[0] + "</p>" +
                "<p id=\"answer-1\" class=\"opt\">" + triviaGame.questions[triviaGame.currentQuestionIndex].answers[1] + "</p>" +
                "<p id=\"answer-2\" class=\"opt\">" + triviaGame.questions[triviaGame.currentQuestionIndex].answers[2] + "</p>" +
                "<p id=\"answer-3\" class=\"opt\">" + triviaGame.questions[triviaGame.currentQuestionIndex].answers[3] + "</p>" +
                "</div>"
            );

            // get all options in the DOM
            var $options = $(".opt");

            // set up "hover" handler for the answer options -
            // border appears around each answer when user hovers over it
            // border disappears when mouse moves out
            $options.hover(function () {
                $(this).css("border", "solid 1px");
            }, function () {
                $(this).css("border", "none");
            });

            //start countdown timer and update time on screen
            triviaGame.time = triviaGame.QUESTION_TIMEOUT;
            triviaGame.intervalId = setInterval(function () {
                $("#seconds").text(--triviaGame.time);
                if (triviaGame.time === 0) {
                    // stop the countdown
                    clearInterval(triviaGame.intervalId);
                    // user didn't answer within allotted time. Process this case
                    triviaGame.processAnswer(null);
                }
            }, 1000);

            // set up click handlers for all 4 answer options
            $options.on("click", function () {
                // user selected an answer stop timer
                clearInterval(triviaGame.intervalId);

                // see if this is the correct answer or not (look at last char of the id and compare to correct answer index)
                // use == to compare b/c left hand side is string, right hand side is number
                var id = $(this).attr('id');
                if (id[id.length - 1] == triviaGame.questions[triviaGame.currentQuestionIndex].correctAnswer) {
                    // correct answer. Process this case.
                    triviaGame.processAnswer(true);
                }
                else {
                    // incorrect answer. Process this case.
                    triviaGame.processAnswer(false);
                }
            });

        },

        processAnswer: function (answer) {
            // User answerer ... process it
            // answer: true means correct
            //         false means incorrect
            //         null means user ran out of time

            var message; // message to display to user based on their answer

            if (answer === null) {
                // no answer
                triviaGame.noAnswer++;
                message = "Sorry, you are out of time. The answer was:";
            }
            else if (answer === true) {
                // correct answer
                triviaGame.correctAnswers++;
                message = "Good Job! You got it right!";

            }
            else {
                // incorrect answer
                triviaGame.incorrectAnswers++;
                message = "Oops! Not quite right";
            }

            // populate the top and bottom panels
            // top panel contains a message based on user's answer
            $("#top-panel").html(
                "<div class=\"panel-body\">" +
                "<h3>" + message + "</h3>" +
                "</div>"
            );

            // bottom panel contains correct answer text and image
            $("#bottom-panel").html(
                "<div class=\"panel-body\">" +
                "<p>" + triviaGame.questions[triviaGame.currentQuestionIndex].correctAnswerText + "</p>" +
                "</div>" +
                "<div>" +
                "<img class=\"img-thumbnail\" src=\"" + triviaGame.questions[triviaGame.currentQuestionIndex].answerImg + "\"/>" +
                "</div>"
            );

            // increment current question index
            triviaGame.currentQuestionIndex++;

            // wait 8 secs and move on
            setTimeout(function () {
                if (triviaGame.currentQuestionIndex === triviaGame.questions.length) {
                    // all questions asked end the game
                    triviaGame.endGame();
                }
                else {
                    // more questions to ask - go to next one
                    triviaGame.nextQuestion();
                }
            }, triviaGame.TIME_BTW_QUESTIONS * 1000);
        },

        endGame: function () {
            // end the game by showing user their tally and a "play again" button
            // populate the top and bottom panels
            // top panel contains a done message
            $("#top-panel").html(
                "<div class=\"panel-body\">" +
                "<h3>All Done!</h3>" +
                "</div>"
            );

            // bottom panel contains tally
            $("#bottom-panel").html(
                "<div class=\"panel-heading\">" +
                "<h3 class=\"panel-title\">Totals:</h3>" +
                "</div>" +
                "<div class=\"panel-body\">" +
                "<p>Correct Answers:" + triviaGame.correctAnswers + "</p>" +
                "<p>Incorrect Answers:" + triviaGame.incorrectAnswers + "</p>" +
                "<p>Unanswered:" + triviaGame.noAnswer + "</p>" +
                "</div>"
            );

            //Add the "play again" button at the bottom
            $("#game-area").append(
                "<a class=\"btn btn-primary\" role=\"button\">Play Again</a>"
            );

            // attach a click handler to play again
            $(".btn-primary").on("click", triviaGame.startGame);
        }

    };

    // init all the questions for the game
    triviaGame.initQuestions();

    // When user clicks "play" button, start game
    $(".btn-primary").on("click", triviaGame.startGame);
});