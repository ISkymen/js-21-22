"use strict";

function getDatafromURL(url) {
  let httpreq = new XMLHttpRequest();
  httpreq.open("GET", url, false);
  httpreq.send(null);
  return httpreq.responseText;
}

function prepareQuestion(url) {
  localStorage.setItem("Questions", getDatafromURL(url));
  return JSON.parse(localStorage.getItem("Questions"));
}

function getAnswerCode(questionOBJ) {
  let checkArray = [];
  _.each(questionOBJ, function (question, i) {
    checkArray[i] = [];
    _.each(question.answers, function (answers) {
      checkArray[i].push(!!+answers.substr(0, 1)); // Convert '0' and '1' to boolean
    })
  });
  return checkArray;
}

function getCheckboxState() {
  let checkBox = document.getElementsByClassName("answer__list");
  let checkBoxArray = [];
  _.each(checkBox, function (checkbox, i) {
    checkBoxArray[i] = [];
    _.each(checkbox.getElementsByTagName('input'), function (input) {
      checkBoxArray[i].push(input.checked + "");
    })
  });
  return checkBoxArray;
}

function generateResult(correctAnswers, totalAnswers) {
  if (correctAnswers == totalAnswers) {
    return "Поздравляем! Вы правильно ответили на все вопросы."
  }
  else {
    if (correctAnswers == 0) {
      return "Вы не смогли ответить правильно ни на один вопрос :("
    }
    else {
      return "Вы ответили правильно на " + correctAnswers + " из " + totalAnswers + " вопросов.";
    }
  }
}

function checkAnswer() {
  let checkboxState = getCheckboxState();
  let answerCode = getAnswerCode(questionOBJ);
  let correctAnswers = 0;
  if (checkboxState.length == answerCode.length) {
    _.each(checkboxState, function (checkbox, i) {
      if (checkbox.toString() == answerCode[i].toString()) {
        correctAnswers += 1;
      }
    });
  }
  let result = generateResult(correctAnswers, answerCode.length);
  outputResult(result);
}

function outputResult(result) {
  let modal = document.getElementById('myModal');
  let span = document.getElementsByClassName("close")[0];
  let start = document.getElementById("start");
  let modalBody = document.getElementsByClassName("modal-body")[0];

  modalBody.innerHTML = "<h2>" + result + "</h2>";
  modal.style.display = "block";

  span.onclick = function () {
    modal.style.display = "none";
  };

  start.onclick = function () {
    modal.style.display = "none";
    startTest();
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

function generateDOM() {
  let blockTitle = document.createElement("h1");
  blockTitle.innerHTML = "Тест по программированию";
  blockTitle.className = "page-title";
  document.body.appendChild(blockTitle);

  let questionList = document.createElement("ol");
  document.body.appendChild(questionList);
  _.each(questionOBJ, function (question) {
    let questionItem = document.createElement("li");
    questionItem.className = "question-block";
    questionList.appendChild(questionItem);
    let blockQuestion = document.createElement("h2");
    blockQuestion.innerHTML = question.question;
    blockQuestion.className = "question";
    questionItem.appendChild(blockQuestion);
    let list = document.createElement("ul");
    list.className = "answer__list";
    questionItem.appendChild(list);
    _.each(question.answers, function (answers) {
      let listItem = document.createElement("li");
      let listInput = document.createElement("input");
      let listLabel = document.createElement("label");
      listInput.setAttribute("type", "checkbox");
      listItem.className = "answer__item";
      listLabel.innerHTML = answers.substr(2);
      list.appendChild(listItem);
      listItem.appendChild(listLabel);
      listLabel.insertBefore(listInput, listLabel.firstChild);
    })
  });
  let blockButton = document.createElement("button");
  blockButton.addEventListener('click', checkAnswer);
  blockButton.innerHTML = "Проверить мои результаты";
  blockButton.className = "button";
  document.body.appendChild(blockButton);
}

function startTest() {
  document.body.innerHTML = '<div id="myModal" class="modal"><div class="modal-content"><div class="modal-header"><span class="close">×</span><h2>Результаты теста</h2></div><div class="modal-body"></div><div class="modal-footer"><button id="start" type="button" class="button">Начать тест сначала</button></div></div>';
  generateDOM();
}

var url = 'http://10.skm.pp.ua/js-21-22/src/question.json';
var questionOBJ = prepareQuestion(url);
startTest();







