// Saves options to chrome.storage
function save_options() {
  var safemode = document.getElementById('safemode').checked;
  chrome.storage.sync.set({
    safemode: safemode,
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
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);