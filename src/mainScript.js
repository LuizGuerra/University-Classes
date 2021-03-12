// Constants
const letterTimes = ['AB', 'CD', 'FG', 'HI', 'JK', 'LM', 'NP'];

// Important data
var data = localStorage.getItem('Open-Classes-Website');
var isFirstTimeInSite = data == null;

// HTML Tags
var table = document.getElementsByTagName('table')[0];
var periodAddButton = document.getElementById('addPeriodID');

function main() {
    loadCalendar(); 
    setupInputButton() ;
}
main();

// Actions
function loadCalendar() {
    // Verify if cache is empty
    if (isFirstTimeInSite) {
        console.log('This is the user first time on the site!');
        return;
    }
    console.log('This is NOT the first time on the site!!!!');
    let classes = JSON.parse(data)['classes'];
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

function timeOfTheDayIndex(str) {
    return times.indexOf(str.slice(1));
}

function createLink(lesson, url) {
    var a = document.createElement('a');
    a.innerHTML = lesson;
    a.href = url;
    a.target = "_blank";
    return a;
}

function setupInputButton() {
    periodAddButton.onclick = periodAddButtonAction;
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
    inputContainer.insertBefore(input, periodAddButton);
}

function removeEmptyRows() {
    console.log('Removing empty rows');
    // Se for primeira vez, mostra tabela vazia
    if (isFirstTimeInSite) {
        return;
    }
    // Se não for primeira vez, remove as vazias
}



// uhh... Foo?




// Button Actions

function onClickAction(ge, ev) {
    var tr = document.getElementById('addPeriodID');
    tr.insertBefore( createPeriodInput(), tr.lastChild )
}


// document.getElementById('tagged').style.borderColor = 'green';
// document.getElementById('tagged').style.borderWidth = '3px';
// document.getElementById('tagged').style.borderRadius = '10px';