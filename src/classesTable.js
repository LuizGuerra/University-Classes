let data = "{\"classes\":[{\"lesson\":\"Constru\u00e7\u00e3o de Software\",\"periods\":[\"2LM\",\"4LM\"],\"url\":\"https:\/\/pucrs.zoom.us\/j\/93506326606?pwd=dUNqaytKUng0b3VXWmJxK2Q2blZaUT09\"},{\"lesson\":\"Programa\u00e7\u00e3o Distribu\u00edda\",\"periods\":[\"2NP\",\"4NP\"],\"url\":\"https:\/\/google.com\"},{\"lesson\":\"Gerenciamento de Projeto de Software\",\"periods\":[\"3JK\",\"5JK\"],\"url\":\"https:\/\/google.com\"},{\"lesson\":\"Manuten\u00e7\u00e3o de Software\",\"periods\":[\"3LM\"],\"url\":\"https:\/\/google.com\"},{\"lesson\":\"Intelig\u00eancia Artificial\",\"periods\":[\"3NP\",\"5NP\"],\"url\":\"https:\/\/google.com\"},{\"lesson\":\"AGES III\",\"periods\":[\"6LM\",\"6NP\"],\"url\":\"https:\/\/google.com\"}]}"

const headerTexts = ['Período','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo']
const times = ['AB', 'CD', 'FG', 'HI', 'JK', 'LM', 'NP'];

class Lesson {
    constructor(name, url) {
        this.name = name;
        this.url = url;
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

function createMatrix() {
    var mtz = [];
    for (var i = 0; i < 7; i++) {
        mtz.push([]);
        for (_ in times) {
            mtz[i].push(null);
        }
    }
    return mtz;
}

function fetchClasses() {
    var classes = JSON.parse(data)['classes'];
    return classes;
}

function prepareData(classes) {
    let matriz = createMatrix();
    for (var i = 0; i < classes.length; i++) {
        let periods = classes[i]['periods'];
        let lesson = new Lesson(classes[i]['lesson'], classes[i]['url']);
        for (index in periods) {
            let row = timeOfTheDayIndex(periods[index]);
            let column = dayOfTheWeekIndex(periods[index]);
            matriz[row][column] = new Lesson(classes[i]['lesson'], classes[i]['url']);
        }
    }
    return matriz;
}

function createTh(str) {
    var th = document.createElement('th');
    th.innerHTML = str;
    return th;
}

function createTd(str) {
    var th = document.createElement('td');
    th.innerHTML = str;
    return th;
}

function tdWithLink(lesson) {
    var a = document.createElement('a');
    a.innerHTML = lesson.name;
    a.href = lesson.url;
    a.target = "_blank";
    return a;
}

function createTable(data) {
    var body = document.getElementsByTagName('body')[0];
    var table = document.createElement('table');

    var headerRow = document.createElement('tr');
    for (var i = 0; i < 8; i++) {
        headerRow.appendChild( createTh(headerTexts[i]) );
    }
    table.appendChild(headerRow);

    let classes = prepareData(fetchClasses());
    console.table(classes);

    for (index in times) {
        var row = document.createElement('tr');
        row.appendChild( createTd(times[index]) );

        for (i in classes[index]) {
            if (classes[index][i] == null) {
                row.appendChild( createTd(" ") );
            } else {
                var td = document.createElement('td');
                td.appendChild( tdWithLink(classes[index][i]) );
                row.appendChild(td);
            }
        }

        table.appendChild(row);
    }

    
    table.classList.add("centered");

    body.appendChild(table);

    
    

    // p.innerHTML = 'hello world';
    // body.appendChild(p);
}

createTable(data);


// fetch('../classes.json').then(function(response) {
//     if (response.ok) {
//         console.log('200');
//     } else {
//         console.log('not 200')
//     }
// })
// .catch(function(error) {
//     console.log("error")
// })

// console.log(string.includes(substring));

function occurOnWeekend(times) {
    return times.length === 0 ? false :
      (times[0].includes('1') || times[0].includes('7')) || occurOnWeekend(times.slice(1));
}

function haveClassOnWeekend(classes) {
    for (var i = 0; i < classes.length; i++) {
        if (classes[i]['periods'].filter(occurOnWeekend).length > 0) {
            return true;
        }
    }
    return false;
}
