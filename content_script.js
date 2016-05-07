"use strict";

const SNOOZES = [
  'later..',
  "leave me alone",
  'go bother someone else',
  'a few more minutes',
  'snooze button',
  'zzzz....',
  '🙄😴',
]

const UNSAFE_SNOOZES = [
  'fuck off',
  '🖕🏼',
]

const QUESTIONS = [
  "What are you doing?",
  "Why did you open facebook? What do you need?",
  "WHY?? What do you need to do that's so important?",
  "Really...what's so important?",
  "Fine, just tell me why you needed to open facebook",
]

const UNSAFE_QUESTIONS = []

var app = {
  hiddenCount: 0,
  didChangeTaskText: false,
  snoozes: SNOOZES,
  questions: QUESTIONS,
  safeMode: false,
}

chrome.storage.sync.get({
  safemode: false,
}, function(items) {
  app.safeMode = items.safemode;
  if (!app.safeMode) {
    app.snoozes = [...app.snoozes, UNSAFE_SNOOZES];
    app.questions = [...app.questions, UNSAFE_QUESTIONS];
  }
});




function showTask() {
  app.topContainerElement.setAttribute('class', app.task ? 'focusbookPassive' : 'focusbookActive')
  app.topContainerElement.style.top = '0px'
  app.snoozeButton.innerHTML = app.snoozes[Math.floor(Math.random()*app.snoozes.length)];
  app.expandTimer = setTimeout(expandContainer,  10000);
}

function hideTask() {
  app.topContainerElement.setAttribute('class', 'focusbookPassive')
  app.topContainerElement.style.top = '-300px'
  app.hiddenCount++
  app.timer = setTimeout(showTask,  20000 + 10000 * app.hiddenCount * app.hiddenCount);
  clearTimeout(app.expandTimer)
}

function expandContainer() {
  app.topContainerElement.setAttribute('class', 'focusbookExpanding')
}

function startTask(taskString) {
  app.task = taskifyString(taskString)

  if (app.task != taskString) {
    app.textElement.innerHTML = `Finished ${app.task}? GET BACK TO ${!app.safeMode ? "FUCKING " : ""}WORK!`;
  } else {
    app.textElement.innerHTML = `'${app.task}' - finished yet? GO WORK!`;
  }

  app.inputElement.setAttribute('class', 'focusbookPassive')
  app.snoozeButton.style.visibility = "visible";
}

function taskifyString(string) {
  let newString = string.toLowerCase();
  newString = newString.replace(" my ", " your ");
  let array = newString.split(" ")

  if (array[0].toLowerCase() == 'to') {
    array.shift()
    array[0] = array[0] + 'ing';
  } else if (array[0].slice(-3) == 'ing') {
    array.unshift("'");
    array.push("'")
  }

  return array.join(' ');
}

function onkeypress(e) {
  if (!e) e = window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == '13'){
    startTask(this.value)
    hideTask();
    return false;
  }
}



function createElement() {
  app.topContainerElement = document.createElement('div');
  app.topContainerElement.setAttribute('id', 'focusbookTopContainer');
  app.topContainerElement.setAttribute('class', 'focusbookActive');
  app.topContainerElement.style.top = '-300px'

  //MAIN CONTAINER
  app.mainContainerElement = document.createElement('div');
  app.mainContainerElement.setAttribute('id', 'focusbookMainContainer');

  app.textElement = document.createElement("span");
  app.textElement.innerHTML = app.questions[Math.floor(Math.random()*app.questions.length)];
  app.textElement.setAttribute('id', 'focusbookMainText');

  app.inputElement = document.createElement("input")
  app.inputElement.setAttribute('id', 'focusbookInput');
  app.inputElement.setAttribute('type', 'text');
  app.inputElement.onkeypress = onkeypress

  app.mainContainerElement.appendChild(app.textElement);
  app.mainContainerElement.appendChild(app.inputElement);


  // BUTTONS CONTAINER
  app.buttonsContainerElement = document.createElement('div');
  app.buttonsContainerElement.setAttribute('id', 'focusbookButtons');

  app.snoozeButton = document.createElement('button');
  app.snoozeButton.setAttribute('id', 'snoozeButton');
  app.snoozeButton.setAttribute('class', 'focusbookButton')
  app.snoozeButton.onclick = hideTask;

  app.buttonsContainerElement.appendChild(app.snoozeButton);
  app.topContainerElement.appendChild(app.mainContainerElement);
  app.topContainerElement.appendChild(app.buttonsContainerElement);

  document.all[0].appendChild(app.topContainerElement);
}

new Scheduler()
.then((scheduler) => {
  if (scheduler.isActive()) {
    console.log("I'm active");
    createElement();
    showTask();
  }
})
.catch((error) => {
  // TODO: think about how to catch and report errors
});
