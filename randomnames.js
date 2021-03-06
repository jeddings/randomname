/*
 TODO:
 - add support for finding histogram of name lengths, and use that to determine generated name length

 */
function generateNames (num, minLen, maxLen, incomingNameList, filterOutDups) {

    var genList = '';

    num = Math.min(100,num);

    var one = {};
    var two = {};
    var three = {};
    var oneLetters = '';
    var twoLetters = {};
    var threeLetters = {};
    var maxOne = 0;
    var maxTwo = 0;
    var maxThree = 0;
    var minNameLen = 10000;
    var maxNameLen = 0;
    var namesList = '';
    
    for (var i = 0; i < namesList.length; i++) {
        var curr = trim(namesList[i]);
        minNameLen = Math.min(minNameLen, curr.length);
        maxNameLen = Math.max(maxNameLen, curr.length);

        if (curr.length >= 3) {
            for (var j = 0; j < curr.length - 2; j++) {

                // looking at the first letter of the word
                if (j === 0) {

		    var currNameChar = curr.charAt(j);
		    var prevNameChar = curr.charAt(j-1);
		    var prevPrevNameChar = curr.charAt(j-2);

                    // if we haven't recorded this letter before, zero it out
                    if (one[currNameChar] === null || one[currNameChar] === NaN) {
                        one[currNameChar] = 0;
                    }
                }
            }
        }
    }

    //var namesList = generateNamesSeedList(incomingNameList).toLowerCase().split('\n');
    
    /*
     var s = '';
     s += '--------\nthreeLetters\n--------\n';
     for (key1 in threeLetters) {
     for (key2 in threeLetters[key1]) {
     s += 'threeLetters[' + key1 + '][' + key2 + ']=' + threeLetters[key1][key2] + '\n';
     }
     }

     s += '--------\nthree\n--------\n';
     for (key1 in three) {
     for (key2 in three[key1]) {
     for (key3 in three[key1][key2]) {
     s += 'three[' + key1 + '][' + key2 + '][' + key3 + ']=' + three[key1][key2][key3] + '\n';
     }
     }
     }

     document.rd.gen.value = s;
     */

    var stopFactor = 1;
    var lengthFactor = 17;
    var stopProcessing = false;

    for (var k = 0; k < num; k++) {
        var genName = '';

        var sanity = 0;
        var letter = '';
        var offset = 0;

        while (sanity++ < 150) {
            if (genName.length === 0) {
                offset = rndInt(oneLetters.length);
                for (var q = 0; q < oneLetters.length; q++) {
                    var rOne = rndInt(maxOne*stopFactor);
                    letter = oneLetters.charAt((q+offset)%(oneLetters.length));
                    if (rOne < (1*one[letter])) {
                        genName += '' + letter;
                        break;
                    }
                }
            }

            if (genName.length === 1) {
                var secondLetters = twoLetters[genName.charAt(0)];
                offset = rndInt(secondLetters.length);
                for (var r = 0; r < secondLetters.length; r++) {
                    var rTwo = rndInt(maxTwo*stopFactor);
                    letter = secondLetters.charAt((r+offset)%(secondLetters.length));
                    if (rTwo < (1*two[genName.charAt(0)][letter])) {
                        genName += '' + letter;
                        break;
                    }
                }
            }

            if (genName.length > 1) {
                var thirdLetters = threeLetters[genName.charAt((genName.length)-2)][genName.charAt((genName.length)-1)];
                if (thirdLetters === null) {
                    //alert(genName + ', ' + genName.charAt((genName.length)-2) + ', ' + genName.charAt((genName.length)-1));
                    genName = '';
                } else {
                    offset = rndInt(thirdLetters.length);
                    for (var s = 0; s < thirdLetters.length; s++) {
                        var rThree = rndInt(maxThree*stopFactor);
                        letter = thirdLetters.charAt((s+offset)%(thirdLetters.length));
                        if (rThree < (1*three[genName.charAt(genName.length-2)][genName.charAt(genName.length-1)][letter])) {
                            genName += '' + letter;
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
            for (var m = 0; m < namesList.length; m++) {
                if (namesList[m] === genName) {
                    useName = false;
                    break;
                }
            }
        }

        if (useName) {
            genList = genList + genName.charAt(0).toUpperCase() + genName.substring(1,genName.length-1) + '\n';
        } else {
            k--;
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
    while ((s.substring(0,1) === ' ') || (s.substring(0,1) === '\n') || (s.substring(0,1) === '\r')) {
        s = s.substring(1,s.length);
    }
    
    while ((s.substring(s.length-1,s.length) === ' ') || (s.substring(s.length-1,s.length) === '\n') || (s.substring(s.length-1,s.length) === '\r')) {
        s = s.substring(0,s.length-1);
    }

    return s;
}


/*
function rand(number) {
    rnd.today=new Date();
    rnd.seed=rnd.today.getTime();
    rnd.seed = (rnd.seed*9301+49297) % 233280;
    return rnd.seed/(233280.0);


    return Math.floor(rnd.seed/(233280.0)*number);
}
*/
