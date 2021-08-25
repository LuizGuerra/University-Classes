// Constants
const letterTimes = ['AB', 'CD', 'FG', 'HI', 'JK', 'LM', 'NP'];
const betweenTimes = ['ABCD', 'CDFG', 'FGHI', 'HIJK', 'JKLM', 'LMNP'];

const storageKey = 'Open-Classes-Website';
const autoStorageKey = `${storageKey}/auto`;
const focusStorageKey = `${storageKey}/focus`;

const noClassFlagAlert = 'Esse botão serve pra destacar o período atual. Entretanto, não estamos em horário de aula! Teste essa feature mais tarde.';
const popupBloquedAlert = 'Não foi possível abrir a aula, pois os popups estão desativados para este site.\nPor favor, habilite eles para poder usar esta feature.';
const autoConfirmString = 'Toda vez que abrir este site e estiver em horário de aula, abrir automaticamente o link da aula?\nEssa mensagem apenas aparecerá uma vez.';

const date = new Date();
const weekDay = date.getDay() == 0 ? 7 : date.getDay(); // S:7 M:1 T:2 W:3 T:4 F:5 S:6

// Important data
var jsonString = localStorage.getItem(storageKey);
var autoOpenerString = localStorage.getItem(autoStorageKey);
var focusString = localStorage.getItem(focusStorageKey);

// Important HTML Tags
var table = document.getElementsByTagName('table')[0];

var periodAddButton = document.getElementById('addPeriodID');
var periodRemoveButton = document.getElementById('removePeriodID');
var saveButton = document.getElementById('saveButtonID');
var autoButton = document.getElementById('autoOpener');
var focusButton = document.getElementById('targetColors');
var purgeButton = document.getElementById('purgeButton');
var editButton = document.getElementById('editButton');

var lessonNameInput = document.getElementById('lessonNameID');
var periodContainer = document.getElementById('periodContainer');
var periodInputs = periodContainer.children;
var urlInput = document.getElementById('urlID');

// Global variables
var autoButtonIsSelected = false
var focusButtonIsSelected = false
var removeLessonButtonIsSelected = false
var editLessonButtonIsSelected = false

// Classes
class Lesson {
    constructor(lesson, periods, url) {
        this.lesson = lesson;
        this.periods = periods;
        this.url = url;
    }
}

class LGTime {
    constructor(startingHour, startingMinute, endingHour, endingMinute) {
        if (startingHour > endingHour || (startingHour == endingHour && startingMinute > endingMinute)) {
            throw new Error('Ending time can\'t be before starting time');
        }
        this.start = new Date();
        this.start.setHours(startingHour);
        this.start.setMinutes(startingMinute);

        this.end = new Date();
        this.end.setHours(endingHour);
        this.end.setMinutes(endingMinute);
    }
    insideOf(hour, minute) {
        const t = new Date();
        t.setHours(hour);
        t.setMinutes(minute);
        return this.start <= t && t < this.end;
    }
    static getNow() {
        const date = new Date();
        const hour = date.getHours();
        const mins = date.getMinutes();
        var now = null;
        var next = null;
        const keys = Object.keys(schedules);
        for(let i in keys) {
            // If its not the desired time, continue
            if (!schedules[keys[i]].insideOf(hour, mins)) { continue; }
            // If it is, add to now
            now = keys[i];
            // If its between classes
            if (betweenTimes.includes(keys[i])) {
                next = keys[i].substring(2);
                break;
            }
            // Then, its during class
            // If its the last class of the day
            if (keys[i] == 'NP') {
                break;
            } else {
                next = letterTimes[letterTimes.indexOf(keys[i]) + 1];
                break;
            }
        }
        return {
            now: now,
            next: next
        };
    }
}
const schedules = {
    'AB': (new LGTime(08, 00, 09, 40)),
    'ABCD': (new LGTime(09, 40, 09, 50)),
    'CD': (new LGTime(09, 50, 11, 30)),
    'CDFG': (new LGTime(11, 30, 14, 00)),
    'FG': (new LGTime(14, 00, 15, 40)),
    'FGHI': (new LGTime(15, 40, 15, 50)),
    'HI': (new LGTime(15, 50, 17, 30)),
    'JK': (new LGTime(17, 30, 19, 00)),
    'JKLM': (new LGTime(19, 00, 19, 15)),
    'LM': (new LGTime(19, 15, 20, 45)),
    'LMNP': (new LGTime(20, 45, 21, 00)),
    'NP': (new LGTime(21, 00, 22, 30)),
};
const now = LGTime.getNow();

// Important functions

function scrollToEndOfPage() {
    window.scroll({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth'
    });
}

// Get current or next class, null if none
function getClass() {
    try {
        return document.getElementById(`${now.now}_Row`).cells[weekDay];
    } catch (error) {
        try {
            return document.getElementById(`${now.next}_Row`).cells[weekDay];
        } catch (error) { }
    }
    return null;
}

// Open Class URL
async function openURL() {
    try {
        var cell = getClass();
        if(now.now != null && (cell == null || cell.children.length == 0)) { return; }
        var newWin = window.open(cell.children[0].href)
        if(!newWin || newWin.closed || typeof newWin.closed=='undefined') {
            setTimeout(function() { alert(popupBloquedAlert); }, 1);
        }
    } catch (e) { setTimeout(function() { alert(popupBloquedAlert); }, 1); }
}

//
function changeTodayColumnBackground() {
    const isOn = focusString == null || focusString == 'y' ;
    for (let i = 1; i < 8; i++) {
        for (let j = 1; j < 8; j++) {
            if (weekDay == i) {
                table.rows[j].cells[i].style.backgroundColor = isOn ? '#EDEDED' : 'White';
            }
        }
    }
}

//3185FC 0E4749
function updateClassBackground() {
    var cell = getClass();
    changeTodayColumnBackground();
    if(cell != null) {
        if(focusString == null || focusString == 'y') {
            try {
                cell.children[0].style.color ='#FFFFFF';
                cell.style.backgroundColor ='#0E4749';
            } catch (e) {
                // cell.style.backgroundColor ='#EDEDED';
                cell.style.borderWidth = '3px';
            }
        } else {
            cell.style.backgroundColor = 'White';
            cell.style.borderWidth = '1px';
            try {
                cell.children[0].style.color ='#272727';
            } catch (e) {}
        }
    }
    return cell;
}

// Update Json string
function updateLocalStorageData(classes) {
    jsonString = JSON.stringify(classes);
    localStorage.setItem(storageKey, jsonString);
}

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
    var invalid = [];
    for (var index in periods) {
        const number = periods[index].substring(0);
        const letters = periods[index].substring(1);
        if (isNaN(parseInt(number))) {
            invalid.push(periods[index]);
            continue;
        }
        if (letters.length != 2 || !areLetters(letters)) {
            invalid.push(periods[index]);
        }
    }
    return invalid;
}

// Given a string, verify if it is a URL
function isValidURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
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

function retrievePeriodInputFields() {
    var arr = Array.from(periodInputs);
    var first = arr[0].children[1];
    var tail = arr.filter(x => x.tagName == 'INPUT' && x.value != '');
    return [first].concat(tail);
}

function createImage(path, imageClass) {
    let image = document.createElement('img');
    image.src = path;
    image.classList.add(imageClass);
    return image;
}

// Creates a button with an image and sets a name to it
function tableButton(image, lesson) {
    let button = document.createElement('button');
    button.appendChild(image);
    button.name = lesson;
    return button;
}

// Creates a remove class button
function createRemoveButton(lesson) {
    let image = createImage('resources/remove.svg', 'removeLessonImage');
    let button = tableButton(image, lesson);
    button.classList.add('removeLessonButton');
    button.onclick = function () {
        removeLesson(lesson);
        location.reload();
    };
    return button;
}

// Creates a edit class button
function createEditButton(lesson) {
    let image = createImage('resources/smallEdit.svg', 'editLessonImage');
    let button = tableButton(image, lesson);
    button.classList.add('editLessonButton');
    button.onclick = function () {
        editLesson(lesson);
        scrollToEndOfPage();
    }
    return button;
}