var timer = document.getElementById("timer");
var score = 0;
var scoreText = document.getElementById("score");
var correctAns = 0;
var counter = 0;

// Change this to increase time for each question
var timeLeft = 10;

timer.innerText = timeLeft - counter;

// This function is the one that updates the text on the text element
function timeIt() {
    if (timeLeft - counter == 0) {
        showCorrectAns();
        document.getElementById("next").style.visibility = "visible";
        return;
    } else {
        counter++;
        timer.innerText = timeLeft - counter;
    }
    if ((timeLeft - counter) < 1) {
        document.getElementById("beep2").play();
    } else if ((timeLeft - counter) < 4) {
        document.getElementById("beep").play();
    }
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

var countDown;

// This function starts a timer
function startTimer() {
    counter = 0;
    timer.innerText = timeLeft - counter;
    countDown = setInterval(timeIt, 1010);
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

var myQuestions = null;

// This function would be called when the user selects the wrong answer and the timer gets over then the right answer is shown to the user
function showCorrectAns() {
    var choices = document.getElementById("choices");
    for (i = 0; i < choices.children.length; i++) {
        if (choices.children[i].textContent == decodeHtml(myQuestions[currQ].correct_answer)) {
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
function nextQues() {
    if (currQ == myQuestions.length - 1) {
        document.getElementById("next").addEventListener("click", function () {
            document.getElementById("click").play();
            localStorage.setItem("correctAns", correctAns);
            localStorage.setItem("score", score);
            document.location.replace("score.html");
        });
        document.getElementById("next").click();
    } else {
        currQ++;
        var question = document.getElementById("question");
        var choices = document.getElementById("choices");
        var clickSound = document.getElementById("click");

        clickSound.play();
        var progress = document.getElementById("progress");

        choices.innerHTML = "";

        progress.style.width = Number.parseInt(progress.style.width) + Number.parseInt(10) + "%";

        quesNo.innerText = (currQ + 1);

        question.innerText = decodeHtml(myQuestions[currQ].question);
        var answers = myQuestions[currQ].incorrect_answers;
        answers.push(myQuestions[currQ].correct_answer);
        shuffle(answers);
        for (i = 0; i < answers.length; i++) {
            var choice = document.createElement("li");
            choice.className = "list-group-item";
            choice.id = i;
            val = decodeHtml(answers[i]);
            var text = document.createTextNode(val);
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
function checkAns(e) {
    clearInterval(countDown);
    var elem = document.getElementById(e.target.id);
    var choices = document.getElementById("choices");
    var flag = 0;

    var clickSound = document.getElementById("click");

    clickSound.play();

    for (i = 0; i < choices.children.length; i++) {
        if (choices.children[i].classList.contains("bg-success") || choices.children[i].classList.contains("bg-danger")) {
            flag = 1;
        }
    }
    if (flag == 0) {
        if (e.target.textContent == myQuestions[currQ].correct_answer) {
            // alert("You got it right!");
            elem.classList.add("bg-success");
            elem.classList.add("text-light");
            score += Number.parseInt(timer.innerText) * 2;
            scoreText.innerText = score + "pts.";
            var scoredSound = document.getElementById("scored");
            correctAns++;
            scoredSound.play();
        } else {
            elem.classList.add("bg-danger");
            elem.classList.add("text-light");
            document.getElementById("beep2").play();
            setTimeout(showCorrectAns, 300);
        }

        document.getElementById("next").style.visibility = "visible";
    }

    if (currQ == 9) {
        document.getElementById("next").innerHTML = "Submit &#x27A1;&#xFE0F;";
    } else {
        document.getElementById("next").innerText = "Next";
    }
}

// Adds click event listeners to all the choices added using JavaScript
function addCheckAns() {
    var choices = document.getElementById("choices");

    for (i = 0; i < choices.children.length; i++) {
        choices.children[i].addEventListener("click", checkAns);
    }
}

// Adds event listeners to next and previous buttons
document.getElementById("next").addEventListener("click", nextQues);
// document.getElementById("prev").addEventListener("click", prevQues);

//Starts the quiz
// function initQuiz(){
//     nextQues();
// }

// initQuiz();
// https: //opentdb.com/api.php?amount=10&type=multiple

document.addEventListener('DOMContentLoaded',
    function () {
        const request = new XMLHttpRequest();
        cat = localStorage.getItem("category")
        diff = localStorage.getItem("difficulty");
        tv_type = localStorage.getItem("type");
        if (cat === "any") {
            cat = "";
        }
        if (diff === "any") {
            diff = "";
        }
        if (tv_type === "any") {
            tv_type = "";
        }
        url = 'https://opentdb.com/api.php?amount=10&category=' + cat + '&difficulty=' + diff + '&type=' + tv_type;
        request.open('GET', url);

        request.onreadystatechange = function () {
            try {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(request.responseText);
                    myQuestions = data.results;
                    console.log(myQuestions);
                    nextQues();
                }
            } catch (err) {
                console.log(err);
            }
        }
        request.send();
    }
);