// Constants
const letterTimes = ['AB', 'CD', 'FG', 'HI', 'JK', 'LM', 'NP'];
const storageKey = 'Open-Classes-Website';

// Important data
var jsonString = localStorage.getItem(storageKey);

// Important HTML Tags
var table = document.getElementsByTagName('table')[0];
var periodAddButton = document.getElementById('addPeriodID');
var saveButton = document.getElementById('saveButtonID');

// Classes
class Lesson {
    constructor(lesson, periods, url) {
        this.lesson = lesson;
        this.periods = periods;
        this.url = url;
    }
}

// Important functions

// 0:Monday, 1:Tuesday, 2:Wednesday, 3:Thursday, 4:Friday
// 5:Saturday, 6:Sunday
function dayOfTheWeekIndex(str) {
    let index = parseInt(str.charAt(0)) - 2;
    return index == -1 ? 6 : index;
}

// Given array of periods, verify if they are valid
function areValidPeriods(periods) {
    if (periods.length == 0) {
        return false;
    }
    for(index in periods) {
        const number = periods[index].substring(0);
        const letters = periods[index].substring(1);
        if (isNaN(parseInt(number))) {
            return false;
        }
        if (letters.length != 2 || !areLetters(letters)) {
            return false;
        }
    }
    return true;
}

// Given a string, verify if it is a URL
function isValidURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

// Verify if given string is included in lettetTimes string array
function areLetters(str) {
    return letterTimes.includes(str);
}

// Creates a link given a string (inner html) and a url to access
function createLink(lesson, url) {
    var a = document.createElement('a');
    a.innerHTML = lesson;
    a.href = url;
    a.target = "_blank";
    return a;
}