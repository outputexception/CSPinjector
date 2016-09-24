

// Saves options to chrome.storage
function save_options() {
  var url = document.getElementById('uri-to-add').value;
  var list = loadFromList();
  list.push(url);
  chrome.storage.local.set({
    whiteList: list,
    customRules: [],
  }, function() {
    document.getElementById('uri-to-add').value = "";
  });
  restore_options(); //repaint
}

// Loads options from chrome.storage
function restore_options() {
  clearList();
  chrome.storage.local.get({
    whiteList: [],
    customRules: [],
  }, function(items) {
    // Load default white list if empty
    if(items.whiteList.length == 0){
      var defaultConfig = ["https://accounts.google.com", "https://drive.google.com"];
      chrome.storage.local.set({
        whiteList: defaultConfig,
        customRules: [],
      }, function(){
        defaultConfig.forEach(x => addToList(x));
      });
    } else {
      var list = items.whiteList;

      if(list != null && list.length != 0)
        list.forEach(x => addToList(x));
    }
  });
}

// Adds domain to html list object
function addToList(url) {
  var option = document.createElement("option");
  option.innerHTML = url;
  document.getElementById("url-list").options.add(option);
}

// reads domains from list and
// return them as array
function loadFromList(){
  var result = [];
  document.getElementById("url-list").childNodes.forEach(x => result.push(x.innerHTML));
  return result;

}

// Clears html list object
function clearList(){
  var list = document.getElementById("url-list");
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }
}

// Clears options
function clear_options(){
  chrome.storage.local.clear();
  restore_options();
}

// Clears options
function remove_option(){
  var list = document.getElementById("url-list");
  var size = list.selectedOptions.length;
  while(size-- > 0)
    list.selectedOptions[0].remove();
  list = loadFromList();

  chrome.storage.local.set({
    whiteList: list,
  }, function() {

  });
  restore_options();
}

// function adding current domain to white list
// and repaint list
function addOrigin(){
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      var url = new URL(tabs[0].url);
      var list = loadFromList();
      if(list.indexOf(url.origin) > -1) return;
      list.push(url.origin);
      chrome.storage.local.set({
        whiteList: list,
      }, function() {
        // TO-DO
        // Enable when finished
        // blink("url-list", 1000);
      });
      restore_options();
  });
}

// Feature function
// blinks on color
function blink(id, timeout){
  var temp = document.getElementById(id).className;
  document.getElementById(id).className = "blink";
  setTimeout(function () {
    document.getElementById(id).className = temp;

  }, timeout);
}


// TO-DO
// Use this prototyped objects for keeping custom setting
// New Feature
var options = {
  "default-src" : {},
  "style-src" : {},
  "script-src" : {},
  "connect-src" : {},
  "img-src" : {},
  "frame-src" : {},
  "font-src" : {},
  "child-src" : {},
  "media-src" : {}
}

var avaible = {
  "'none'" : false,
  "'self'" : false,
  "https:" : false,
  "blob:" : false,
  "data:" : false,
  "'unsafe-inline'" : false,
  "'unsafe-eval'" : false
}


// Event listeners:

// loads stored options when option page is loaded
document.addEventListener('DOMContentLoaded', restore_options);

// invoke save_options function with save button
document.getElementById('save').addEventListener('click',
    save_options);

// invoke save_options function with save button
document.getElementById('addOrigin').addEventListener('click',
    addOrigin);

// invoke clear_options function with clear button
document.getElementById('clear').addEventListener('click',
        clear_options);

// invoke clear_options function with clear button
document.getElementById('remove').addEventListener('click',
        remove_option);
