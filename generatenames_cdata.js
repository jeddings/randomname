  <script src="http://www.google.com/jsapi" type="text/javascript"></script>
  
  <div id="tablediv" style="overflow: auto;">
    <img src="http://www.google.com/ig/images/spinner.gif" />
  </div>
  
  <script>
    
  var num, minLen, maxLen;

/**
 * Load the APIs and run sendQuery when the load is complete
 */
var gadgetHelper = null;
_IG_RegisterOnloadHandler(loadVisualizationAPI);
function loadVisualizationAPI() {
  google.load("visualization", "1");
  google.setOnLoadCallback(sendQuery);
}

/**
 * Create a query (shaped by the Gadget's user preferences), then
 * send it to the spreadsheet data source. Also give the name of a
 * function ("handleQueryResponse") to run once the spreadsheet data
 * is retrieved:
 */
function sendQuery() {
  var prefs = new _IG_Prefs(); // User preferences
  num = prefs.getInt("_num_names_to_generate");
  minLen = prefs.getInt("_minimum_length");
  maxLen = prefs.getInt("_maximum_length");

  gadgetHelper = new google.visualization.GadgetHelper();
  var query = gadgetHelper.createQueryFromPrefs(prefs);
  query.send(handleQueryResponse);
}

/**
 * The core logic. Process the spreadsheet data however you want.
 * In this case, we create HTML to be presented back to the user.
 * We'll use inline comments to provide a step-by-step description
 * of what we're doing:
 */
function handleQueryResponse(response) {
  
  /**
   * Use the visualization GadgetHelper class to handle errors
   */
  if (!gadgetHelper.validateResponse(response)) {
    return; // Default error handling was done, just leave.
  }
  
  var one = new Object();
  var two = new Object();
  var three = new Object();
  var oneLetters = new String("");
  var twoLetters = new Object();
  var threeLetters = new Object();
  var maxOne = 0;
  var maxTwo = 0;
  var maxThree = 0;
  var minNameLen = 10000;
  var maxNameLen = 0;
  var filterOutDups = true;

  /**
   * GET THE DATA FROM THE SPREADSHEET - sorry to scream in caps, but
   * this is a key step
   */
  var data = response.getDataTable();
  
  var html = []; // start the HTML output string
  html.push('\n');
  
  /**
   * Process all Rows in the specified range
   */
  for (var row = 0; row < data.getNumberOfRows(); row++) {
    
    /**
     * Process the Columns in each Row
     */
    for (var col = 0; col < data.getNumberOfColumns(); col++) {
      
      /**
       * GET A DATA VALUE FROM THE RANGE - sorry again for screaming - but
       * this is the next key step
       */
      var formattedValue = data.getFormattedValue(row, col);
      formattedValue = new String(escapeHtml(formattedValue));
      var curr = new String(trim(formattedValue.toLowerCase()));

      /**
       * Look for the 'world'... add the word to the html either way, but
       * format it differently
       */
    minNameLen = Math.min(minNameLen, curr.length);
    maxNameLen = Math.max(maxNameLen, curr.length);
    
    if (curr.length >= 3) {
      for (j = 0; j < curr.length - 2; j++) {

        // looking at the first letter of the word
        if (j == 0) {

          // if we haven't recorded this letter before, zero it out
          if (one[curr.charAt(j)] == null) {
            one[curr.charAt(j)] = 0;
          }

          // increment the letter count by one
          one[curr.charAt(j)] += 1;

          // if we haven't seen this letter before, append it to the list of possible first letters
          if (oneLetters.indexOf(curr.charAt(j),0) == -1) {
            oneLetters += "" + curr.charAt(j);
          }

          // record the max count to do randomizations later
          maxOne = Math.max(maxOne, one[curr.charAt(j)]);
        }

        // looking at the second letter of the word
        if (j == 1) {
          
          // if we haven't recorded the first letter before, initialize it
          if (two[curr.charAt(j-1)] == null) {
            two[curr.charAt(j-1)] = new Object();
          }

          // if we haven't recorded the first letter of the possible second letters, initialize it
          if (twoLetters[curr.charAt(j-1)] == null) {
            twoLetters[curr.charAt(j-1)] = new String("");
          }

          // if we haven't recorded this letter before, zero it out
          if (two[curr.charAt(j-1)][curr.charAt(j)] == null) {
            two[curr.charAt(j-1)][curr.charAt(j)] = 0;
          }

          // increment the letter count by one
          two[curr.charAt(j-1)][curr.charAt(j)] += 1;

          // if we haven't seen this letter before, append it to the list of possible second letters
          if (twoLetters[curr.charAt(j-1)].indexOf(curr.charAt(j),0) == -1) {
            twoLetters[curr.charAt(j-1)] += "" + curr.charAt(j);
          }

          // record the max count to do randomizations later
          maxTwo = Math.max(maxTwo, two[curr.charAt(j-1)][curr.charAt(j)]);
        }

        // looking at the third and later letters of the word
        if (j > 1) {
          
          // initializations for first occurrences
          if (three[curr.charAt(j-2)] == null) {
            three[curr.charAt(j-2)] = new Object();
          }

          if (three[curr.charAt(j-2)][curr.charAt(j-1)] == null) {
            three[curr.charAt(j-2)][curr.charAt(j-1)]= new Object();
          }

          if (threeLetters[curr.charAt(j-2)] == null) {
            threeLetters[curr.charAt(j-2)] = new Object();
          }

          if (threeLetters[curr.charAt(j-2)][curr.charAt(j-1)] == null) {
            threeLetters[curr.charAt(j-2)][curr.charAt(j-1)] = new String("");
          }

          if (three[curr.charAt(j-2)][curr.charAt(j-1)][curr.charAt(j)] == null) {
            three[curr.charAt(j-2)][curr.charAt(j-1)][curr.charAt(j)] = 0;
          }

          // increment the letter count by one
          three[curr.charAt(j-2)][curr.charAt(j-1)][curr.charAt(j)] += 1;

          // if we haven't seen this letter before, append it to the list of possible second letters
          if (threeLetters[curr.charAt(j-2)][curr.charAt(j-1)].indexOf(curr.charAt(j),0) == -1) {
            threeLetters[curr.charAt(j-2)][curr.charAt(j-1)] += "" + curr.charAt(j);
          }

          // record the max count to do randomizations later
          maxThree = Math.max(maxThree, three[curr.charAt(j-2)][curr.charAt(j-1)][curr.charAt(j)]);
        }
      }
    }
  }
  
  /*
  var s = "";
  s += "--------\nthreeLetters\n--------\n";
  for (key1 in threeLetters) {
    for (key2 in threeLetters[key1]) {
      s += "threeLetters[" + key1 + "][" + key2 + "]=" + threeLetters[key1][key2] + "\n";
    }
  }
  
  s += "--------\nthree\n--------\n";
  for (key1 in three) {
    for (key2 in three[key1]) {
      for (key3 in three[key1][key2]) {
        s += "three[" + key1 + "][" + key2 + "][" + key3 + "]=" + three[key1][key2][key3] + "\n";
      }
    }
  }
  
  document.rd.gen.value = s;
  */
  
  var stopFactor = 1;
  var lengthFactor = 17;
  var stopProcessing = false;
  
  for (k = 0; k < num; k++) {
    var genName = new String("");
    
    var sanity = 0;
  
    while (sanity++ < 15000) {
      if (genName.length == 0) {
        var offset = rndInt(oneLetters.length);
        for (q = 0; q < oneLetters.length; q++) {
          var rOne = rndInt(maxOne*stopFactor);
          var letter = oneLetters.charAt((q+offset)%(oneLetters.length));
          if (rOne < (1*one[letter])) {
            genName += "" + letter;
            break;
          }
        }
      }
      
      if (genName.length == 1) {
        var secondLetters = twoLetters[genName.charAt(0)];
        var offset = rndInt(secondLetters.length);
        for (r = 0; r < secondLetters.length; r++) {
          var rTwo = rndInt(maxTwo*stopFactor);
          var letter = secondLetters.charAt((r+offset)%(secondLetters.length));
          if (rTwo < (1*two[genName.charAt(0)][letter])) {
            genName += "" + letter;
            break;
          }
        }
      }
      
      if (genName.length > 1) {
        var thirdLetters = threeLetters[genName.charAt((genName.length)-2)][genName.charAt((genName.length)-1)];
        if (thirdLetters == null) {
          //alert(genName + ", " + genName.charAt((genName.length)-2) + ", " + genName.charAt((genName.length)-1));
          genName = "";
        } else {
          var offset = rndInt(thirdLetters.length);
          for (s = 0; s < thirdLetters.length; s++) {
            var rThree = rndInt(maxThree*stopFactor);
            var letter = thirdLetters.charAt((s+offset)%(thirdLetters.length));
            if (rThree < (1*three[genName.charAt(genName.length-2)][genName.charAt(genName.length-1)][letter])) {
              genName += "" + letter;
              if ((genName.length >= minNameLen && rndInt(lengthFactor) < 2) || genName.length >= maxNameLen) {
                stopProcessing = true;
              }
              break;
            }
          }
        }
      
        if (stopProcessing) {
          break;
        }
      }
    }
    
    stopProcessing = false;
    
    var useName = true;
    
    if (genName.length < minNameLen) {
      useName = false;
    }
    
    if (filterOutDups) {
      for (m = 0; m < names.length; m++) {
        if (names[m] == genName) {
          useName = false;
          break;
        }
      }
    }
    
    if (useName) {
      html.push(genName.charAt(0).toUpperCase() + genName.substring(1,genName.length-1) + "\n");
    } else {
      k--;
    }
    
  }
  
  /**
   * Set the generated html into the container div.
   */
  var tableDiv = _gel('tablediv');
  tableDiv.innerHTML = html.join('');
  tableDiv.style.width = document.body.clientWidth + 'px';
  tableDiv.style.height = document.body.clientHeight + 'px';
  }
  
  /**
   * Define any supporting code you need
   * (like this handy function to escape special characters for html output):
   */
  function escapeHtml(text) {
    if (text == null) {
      return '';
  }
  return _hesc(text);
}

function rndInt(max) {
  return Math.floor(Math.random()*max);
  //return rand(max);
}

function trim(s) 
{
  while ((s.substring(0,1) == ' ') || (s.substring(0,1) == '\n') || (s.substring(0,1) == '\r')) {
    s = s.substring(1,s.length);
  }

  while ((s.substring(s.length-1,s.length) == ' ') || (s.substring(s.length-1,s.length) == '\n') || (s.substring(s.length-1,s.length) == '\r')) {
    s = s.substring(0,s.length-1);
  }

  return s;
}

rnd.today=new Date();
rnd.seed=rnd.today.getTime();

function rnd() {
  rnd.seed = (rnd.seed*9301+49297) % 233280;
  return rnd.seed/(233280.0);
}

function rand(number) {
  return Math.floor(rnd()*number);
}

</script>
