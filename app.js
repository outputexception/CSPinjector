var _debug = true;
_debug = false; // comment to enable log messeges

// Start function
function injectCSP(wl){
    if(_debug)console.log("Content Security Policy Injection has been started");
    var meta = document.createElement('meta');

    // TO-DO
    // Add few security level
    // ex: LOW, MED, HIGH
    if(isSafe(document.origin, wl)){
      // @Deprecated: switch it to caseOf list with enum of security level
      // secureCSP(meta)
      // delete(meta);
    } else {
      unSecureCSP(meta)
    }
    // add meta tag with CSP as firt child of head tag
    // http://www.w3schools.com/jsref/met_node_appendchild.asp
    document.getElementsByTagName('head')[0].appendChild(meta);
    if(_debug)console.log("Content Security Policy Injection Successfull");
}

// checks if url is on white list
function isSafe(url, wl) {
  return wl.indexOf(url) > -1 ? true : false;
}

// Set Content-Security-Policy in meta (no need manifest)
// https://content-security-policy.com/
// It adds betwen <head> tag meta like bellow
// <meta http-equiv="Content-Security-Policy" content="default-src *; style-src 'self' 'unsafe-inline'; script-src 'self'"/>
function unSecureCSP(meta){
      if(_debug)console.log("Treating like unsecure site");

      meta.httpEquiv = "Content-Security-Policy";
      meta.content="default-src 'none';";
      meta.content+=" style-src 'self' https: 'unsafe-inline';";
      meta.content+=" script-src 'self' https: 'unsafe-inline';"; // 'unsafe-eval' required to google login
      meta.content+=" connect-src 'self' https: 'unsafe-inline';";
      meta.content+=" img-src 'self' https: 'unsafe-inline';";
      // meta.content+=" frame-src 'self' https: 'unsafe-inline';"; // 'required on gmail so hangout could work'
      meta.content+=" font-src filesystem: 'self' 'unsafe-inline';";
      // meta.content+=" child-src 'self' https: 'unsafe-inline';"; // 'required on gmail so hangout could work'
      meta.content+=" media-src 'self' https: blob: 'unsafe-inline';";
      // meta.content+=" report-uri "
}

// Set Content-Security-Policy on the lowest restriction
// it mean that let on almost everything :)
function secureCSP(meta){
      if(_debug)console.log("Treating like secure site");
      meta.httpEquiv = "Content-Security-Policy";
      meta.content="default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval';";
}


// Starting point
// After load options it will inject Content-Security-Policy
// Read more: chrome developer extentions:
// https://developer.chrome.com/extensions/options
chrome.storage.local.get({
  whiteList: ""
}, function(items) {
  var WHITE_LIST = [];
  if (items.whiteList !== null)
    // if white list string exist then transform it to array
    WHITE_LIST = items.whiteList;
    if(_debug)console.log(WHITE_LIST);

  // run incjectCSP with white list array as parameter
  injectCSP(WHITE_LIST);
});
