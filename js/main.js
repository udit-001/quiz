var timer = document.getElementById("timer");
var score = 0;
var scoreText = document.getElementById("score");
var correctAns = 0;
var counter = 0;

// Change this to increase time for each question
var timeLeft = 10;

timer.innerText = timeLeft - counter;

// This function is the one that updates the text on the text element
function timeIt(){
    if(timeLeft - counter == 0){
        showCorrectAns();
        document.getElementById("next").style.visibility = "visible";
        return;
    }
    else{
        counter++;
        timer.innerText = timeLeft - counter;
    }
    if((timeLeft - counter) < 1){
        document.getElementById("beep2").play();
    }
    else if((timeLeft - counter) < 4){
        document.getElementById("beep").play();
    }
}

var countDown;

// This function starts a timer
function startTimer(){
    counter = 0;
    timer.innerText = timeLeft - counter;
    countDown = setInterval(timeIt, 1010);
}

var myQuestions = [
    {
        question: "What is 10/2?",
        answers: [
            '3',
            '5',
            '115'
        ],
        correctAnswer: '5'
    },
    {
        question: "What is 30/3?",
        answers: [
            '13',
            '50',
            '10'
        ],
        correctAnswer: '10'
    },
    {
        question: "Largest organ of the body.",
        answers: [
            'Stomach',
            'Large Intestine',
            'Small Intestine',
            'None of these'
        ],
        correctAnswer: 'Small Intestine'
    },
    {
        question: "Who assasinated Mahatma Gandhi?",
        answers: [
            'Dravid Singh',
            'Nathuram Godsey',
            'Ali Mirza',
            'Kabeer Akbar'
        ],
        correctAnswer: 'Nathuram Godsey'
    },
    {
        question: "Which is the largest planet in the solar system?",
        answers: [
            'Jupiter',
            'Neptune',
            'Earth',
            'Mars'
        ],
        correctAnswer: 'Jupiter'
    },
    {
        question: "NaCl is the chemical formula of",
        answers: [
            'Sodium Chloride',
            'Nitrous Chloride',
            'Ammonia',
            'Nano calcium'
        ],
        correctAnswer: "Sodium Chloride"
    },
    {
        question: "What is the first element on the periodic table?",
        answers: ['Sodium',
                  'Oxygen',
                  'Hydrogen',
                  'Helium'
        ],
        correctAnswer: 'Hydrogen'
    },
    {
        question: "What type of electrical charge does a neutron have?",
        answers: [
            'Negative',
            'Positive',
            'No charge',
            'Double negative'
        ],
        correctAnswer: 'No charge'
    },
    {
        question: "Air is mostly made up of",
        answers: [
            'Oxygen',
            'Carbon Dioxide',
            'Argon',
            'Nitrogen'
        ],
        correctAnswer: 'Nitrogen'

    },
    {
        question: "Who was the first man to go in Space?",
        answers: [
            'Neil Armstrong',
            'Rakesh Sharma',
            'Yuri Gagarin',
            'Alexei Leonov'
        ],
        correctAnswer: 'Yuri Gagarin'
    }
];

// This function would be called when the user selects the wrong answer and the timer gets over then the right answer is shown to the user
function showCorrectAns(){
    var choices = document.getElementById("choices");
    for(i = 0; i < choices.children.length; i++){
        if(choices.children[i].textContent == myQuestions[currQ].correctAnswer){
            choices.children[i].classList.add("bg-success");
            choices.children[i].classList.add("text-light");
        }
    }
}

// When no question is being displayed, this is set to currQ. So when nextQues is called the first question appears!
var currQ = -1;

// Goes to the next question
// Also adds link to score.html when submit button is clicked
// Also plays clicked sound when next button is clicked]
// Also Increases the width of the progress bar
// Adds choices for the respective question
// Also calls addCheckAns which adds click event listeners to all the choices
// Also starts the timer
function nextQues(){
    if(currQ == myQuestions.length - 1){
        document.getElementById("next").addEventListener("click", function(){
            document.getElementById("click").play();
            localStorage.setItem("correctAns", correctAns);
            localStorage.setItem("score", score);
            document.location.replace("score.html");                        
        });
    }

    else{
        currQ++;
        var question = document.getElementById("question");
        var choices = document.getElementById("choices");
        var clickSound = document.getElementById("click");

        clickSound.play();
        var progress = document.getElementById("progress");

        choices.innerHTML = "";

        progress.style.width = Number.parseInt(progress.style.width) + Number.parseInt(10)  + "%";

        quesNo.innerText = (currQ+1);

        question.innerText = myQuestions[currQ].question;
        for(i = 0; i < myQuestions[currQ].answers.length; i++){
            var choice = document.createElement("li");
            choice.className = "list-group-item";
            choice.id = i;
            var text = document.createTextNode(myQuestions[currQ].answers[i]);
            choice.appendChild(text);
            choices.appendChild(choice);
        }

        addCheckAns();
        document.getElementById("next").style.visibility = "hidden";
        startTimer();
    }
}

// Listens to click event on all the choices and sets background color to red or green depending on whether correct answer was clicked or not
// Also plays the clicked sound when any of the options is pressed
// Also sets the text on the next Button to Submit on Last Question
function checkAns(e){
    clearInterval(countDown);
    var elem = document.getElementById(e.target.id);
    var choices = document.getElementById("choices");
    var flag = 0;
    
    var clickSound = document.getElementById("click");

    clickSound.play();

    for(i = 0; i < choices.children.length; i++){
        if(choices.children[i].classList.contains("bg-success") || choices.children[i].classList.contains("bg-danger")){
            flag = 1;
        }
    }
    if(flag == 0){
        if(e.target.textContent == myQuestions[currQ].correctAnswer){
                // alert("You got it right!");
                elem.classList.add("bg-success");
                elem.classList.add("text-light");
                score += Number.parseInt(timer.innerText) * 2;
                scoreText.innerText = score+"pts.";
                var scoredSound = document.getElementById("scored");
                correctAns++;
                scoredSound.play();
            }
            else{
                elem.classList.add("bg-danger");
                elem.classList.add("text-light");
                document.getElementById("beep2").play();
                setTimeout(showCorrectAns, 300);
            }
            
            document.getElementById("next").style.visibility = "visible";
        }

        if(currQ == 9){
            document.getElementById("next").innerHTML = "Submit &#x27A1;&#xFE0F;";
        }
        else{
            document.getElementById("next").innerText = "Next";
        }
    }

// Adds click event listeners to all the choices added using JavaScript
function addCheckAns(){
    var choices = document.getElementById("choices");

    for(i = 0; i < choices.children.length; i++){
        choices.children[i].addEventListener("click", checkAns);
    }
}

// Adds event listeners to next and previous buttons
document.getElementById("next").addEventListener("click", nextQues);
// document.getElementById("prev").addEventListener("click", prevQues);

//Starts the quiz
function initQuiz(){
    nextQues();
}

initQuiz();
console.log(myQuestions.length);
