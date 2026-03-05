/*
  TODO:
  - add support for finding histogram of name lengths, and use that to determine generated name length

*/

function generateNames(num, minLen, maxLen, nameList, filterOutDups) {
  var genList = "";

  num = parseInt(num, 10);
  if (isNaN(num) || num <= 0) {
    return genList;
  }
  num = Math.min(10, num);

  var requestedMinLen = parseInt(minLen, 10);
  var requestedMaxLen = parseInt(maxLen, 10);

  if (isNaN(requestedMinLen)) {
    requestedMinLen = 1;
  }

  if (isNaN(requestedMaxLen)) {
    requestedMaxLen = 10000;
  }

  if (requestedMaxLen < requestedMinLen) {
    var tmpLen = requestedMinLen;
    requestedMinLen = requestedMaxLen;
    requestedMaxLen = tmpLen;
  }

  var nameListStr = String(nameList == null ? "" : nameList);
  var names = nameListStr.toLowerCase().split("\n");
  var sourceNames = [];
  var one = new Object();
  var two = new Object();
  var three = new Object();
  var oneLetters = "";
  var twoLetters = new Object();
  var threeLetters = new Object();
  var maxOne = 0;
  var maxTwo = 0;
  var maxThree = 0;
  var minNameLen = 10000;
  var maxNameLen = 0;
  
  for (var i = 0; i < names.length; i++) {
    var curr = new String(trim(names[i]));

    if (curr.length === 0) {
      continue;
    }

    sourceNames.push(curr);

    if (curr.length < 3) {
      continue;
    }

    minNameLen = Math.min(minNameLen, curr.length);
    maxNameLen = Math.max(maxNameLen, curr.length);

    for (var j = 0; j < curr.length - 2; j++) {

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
          twoLetters[curr.charAt(j-1)] = "";
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
          threeLetters[curr.charAt(j-2)][curr.charAt(j-1)] = "";
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

  if (oneLetters.length === 0 || minNameLen === 10000) {
    return genList;
  }

  var effectiveMinLen = Math.max(requestedMinLen, minNameLen);
  var effectiveMaxLen = Math.min(requestedMaxLen, maxNameLen);

  if (effectiveMaxLen < effectiveMinLen) {
    return genList;
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
  
  var generatedCount = 0;
  var generationAttempts = 0;
  var maxGenerationAttempts = num * 500;

  while (generatedCount < num && generationAttempts < maxGenerationAttempts) {
    generationAttempts++;
    var genName = "";
    
    var sanity = 0;
  
    while (sanity++ < 15000) {
      if (genName.length == 0) {
        var offset = rndInt(oneLetters.length);
        for (var q = 0; q < oneLetters.length; q++) {
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
        if (secondLetters == null || secondLetters.length == 0) {
          genName = "";
          continue;
        }
        var offset = rndInt(secondLetters.length);
        for (var r = 0; r < secondLetters.length; r++) {
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
          for (var s = 0; s < thirdLetters.length; s++) {
            var rThree = rndInt(maxThree*stopFactor);
            var letter = thirdLetters.charAt((s+offset)%(thirdLetters.length));
            if (rThree < (1*three[genName.charAt(genName.length-2)][genName.charAt(genName.length-1)][letter])) {
              genName += "" + letter;
              if ((genName.length >= effectiveMinLen && rndInt(lengthFactor) < 2) || genName.length >= effectiveMaxLen) {
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
    
    if (genName.length < effectiveMinLen || genName.length > effectiveMaxLen) {
      useName = false;
    }
    
    if (filterOutDups) {
      for (var m = 0; m < sourceNames.length; m++) {
        if (sourceNames[m] == genName) {
          useName = false;
          break;
        }
      }
    }
    
    if (useName) {
      genList = genList + genName.charAt(0).toUpperCase() + genName.substring(1) + "\n";
      generatedCount++;
    }
  }
  
  return genList;
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
