function parseTime(time) {
  let timeParse = time.split(':');
  return {
    hours: timeParse[0],
    minutes: timeParse[1]
  };
}

// helper method because I'm tired of writing this out.
function gel(id) {
  return document.getElementById(id);
}

function eventHandling() {
  gel('enforce-schedule').addEventListener('click', function() {
    toggleSchedule();
  });
}

function addClass(el, className) {
  let classes = Array.prototype.slice.call(el.classList);
  if (classes.indexOf(className) === -1) {
    classes.push(className);
    el.className = classes.join(' ');
  }
}

function removeClass(el, className) {
  let classes = Array.prototype.slice.call(el.classList);
  let classIndex = classes.indexOf(className);
  if (classIndex !== -1) {
    classes.splice(classIndex, 1);
    el.className = classes.join(' ');
  }
}

function toggleSchedule() {
  let enabled = gel('enforce-schedule').checked;

  let scheduleInputs = document.querySelectorAll('.enforce-schedule-group input')
  scheduleInputs.forEach(function(input) {
    input.disabled = !enabled;
  });

  let group = document.querySelector('.enforce-schedule-group');
  if (enabled) {
    removeClass(group, 'disabled');
  } else {
    addClass(group, 'disabled');
  }
}

function initEnforced() {
  new Scheduler()
  .then((schedule) => {
    let times = schedule.times;

    // let's short circuit this if nothing is saved
    if (!times.length) return;

    // eventually we'll support multiple times
    let time = times[0];

    let start = parseTime(time.start);
    let end   = parseTime(time.end);

    gel('start-time-hours').value = start.hours;
    gel('start-time-minutes').value = start.minutes;
    gel('end-time-hours').value = end.hours;
    gel('end-time-minutes').value = end.minutes;

    gel('enforce-schedule').checked = schedule.enforced;

    toggleSchedule();
  });
}



// Saves options to chrome.storage
function save_options() {
  var safemode = document.getElementById('safemode').checked;
  let start = document.getElementById('start-time-hours').value + ':' + document.getElementById('start-time-minutes').value;
  let end = document.getElementById('end-time-hours').value + ':' + document.getElementById('end-time-minutes').value;
  let enabled = gel('enforce-schedule').checked;

  chrome.storage.sync.set({
    safemode: safemode,
    'schedule:times': [{ start, end }],
    'schedule:enforced?': enabled
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    safemode: false,
  }, function(items) {
    document.getElementById('safemode').checked = items.safemode;
  });

  initEnforced();
}

document.addEventListener('DOMContentLoaded', eventHandling);
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
