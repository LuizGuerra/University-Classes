// Constants
const letterTimes = ['AB', 'CD', 'FG', 'HI', 'JK', 'LM', 'NP'];
const storageKey = 'Open-Classes-Website';

// Important data
var jsonString = localStorage.getItem(storageKey);

// HTML Tags
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

function main() {
    loadCalendar(); 
    setupInputButton();
    setupSaveButton();
}
main();

// Actions
function loadCalendar() {
    // Verify if cache is empty
    if (jsonString == null) {
        jsonString = '';
        return;
    }
    // If is not empty, load table
    let classes = JSON.parse(jsonString);
    for (i in classes) {
        const lessonName = classes[i]['lesson'];
        const periods = classes[i]['periods'];
        const siteURL = classes[i]['url'];
        for (j in periods) {
            const rowId =  `${periods[j].slice(1)}_Row`;
            const day = dayOfTheWeekIndex(periods[j]);
            var cell = document.getElementById(rowId).cells[day+1];
            let classLink = createLink(lessonName, siteURL);
            cell.appendChild( classLink );
        }
    }
}

// 0:Monday, 1:Tuesday, 2:Wednesday, 3:Thursday, 4:Friday
// 5:Saturday, 6:Sunday
function dayOfTheWeekIndex(str) {
    let index = parseInt(str.charAt(0)) - 2;
    return index == -1 ? 6 : index;
}

function setupInputButton() {
    periodAddButton.onclick = periodAddButtonAction;
}

function isValidURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function areLetters(str) {
    return letterTimes.includes(str);
    // for(i in str) {
    //     const c = str.charAt(i);
    //     if (c.toLowerCase() == c.toUpperCase()) {
    //         return false;
    //     }
    // }
    // return true;
}

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

function setupSaveButton() {
    saveButton.onclick = function() {
        const lessonName = document.getElementById('lessonNameID').value;
        const classesDivChildren = document.getElementById('periodContainer').children;
        const periods = Array.from(classesDivChildren)
            .filter(x => x.tagName == 'INPUT' && x.value != '')
            .map(x => x.value.toUpperCase());
        const url = document.getElementById('urlID').value;
        if (lessonName.length == 0 || !areValidPeriods(periods) || !isValidURL(url)){
            return;
        }
        const lesson = new Lesson(lessonName, periods, url);
        if (jsonString == '') {
            jsonString = JSON.stringify([lesson]);
        } else {
            var jsonArr = JSON.parse(jsonString);
            for (i in periods) {
                const rowId =  `${periods[i].slice(1)}_Row`;
                const day = dayOfTheWeekIndex(periods[j]);
                if (document.getElementById(rowId).children[day+1].childElementCount != 0) {
                    location.reload();
                    return;
                }
            }
            jsonArr.push(lesson);
            jsonString = JSON.stringify(jsonArr);
        }
        localStorage.setItem(storageKey, jsonString);
        location.reload();
    }
}

function createLink(lesson, url) {
    var a = document.createElement('a');
    a.innerHTML = lesson;
    a.href = url;
    a.target = "_blank";
    return a;
}

// Button Actions

function onClickAction(ge, ev) {
    var tr = document.getElementById('addPeriodID');
    tr.insertBefore( createPeriodInput(), tr.lastChild )
}

function periodAddButtonAction() {
    // Tags
    var inputContainer = document.getElementById('periodContainer');
    // Verify if it have enough
    if (inputContainer.children.length == 16) {
        return
    }
    // Create input
    var input = document.createElement('input');
    input.type = 'text';
    input.classList.add('periodsInputStyle');
    input.placeholder = '2JK';
    input.autocomplete = 'off';
    input.maxLength = '3';
    inputContainer.insertBefore(input, periodAddButton);
}


// document.getElementById('tagged').style.borderColor = 'green';
// document.getElementById('tagged').style.borderWidth = '3px';
// document.getElementById('tagged').style.borderRadius = '10px';