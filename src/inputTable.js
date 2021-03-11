
const labels = ['Nome:', 'Periodo:', 'URL: ']

function inputTable() {
    var body = document.getElementsByTagName('body')[0];
    var table = document.createElement('table');

    for (var line = 0; line < 3; line++) { 
        var tr = document.createElement('tr');
        tr.appendChild( td(labels[line]) );

        if (line == 0) {
            tr.appendChild( createNameInput() );
        } else if (line == 1) {
            tr.id = 'tagged';
            tr.appendChild( createPeriodInput() )
            tr.appendChild( createPeriodAddButton() )

            createPeriodInput()
            createPeriodAddButton()
        } else {
            tr.appendChild( createUrlInput() );
        }

        table.appendChild(tr);
    }

    let rw = document.createElement('tr');
    let bt = createSaveButton();

    rw.appendChild(bt);
    table.appendChild(rw);

    // table.classList.add('inputPosition');
    body.appendChild(table);
}
inputTable();

function createNameInput() {
    return createInput('nameInputStyle', 'lessonName');
}

function createPeriodInput() {
    let input = createInput('periodsInputStyle', 'periodID');
    input.maxLength = '3';
    input.style = 'margin-right: 8px';
    return input;
}

function createPeriodAddButton() {
    var button = createButton(' + ');
    button.classList.add('addPeriodButton');
    button.onclick = onClickAction;
    return button;
}

function onClickAction(ge, ev) {
    var tr = document.getElementById('periodRow');
    tr.insertBefore( createPeriodInput(), tr.lastChild )
}

function createUrlInput() {
    return createInput('urlInputStyle', 'urlName')
}

function createInput(className, id) {
    var input = document.createElement('input');
    input.classList.add(className);
    input.autocomplete = 'off';
    input.type = 'text';
    input.id = id;
    return input;
}

function createSaveButton() {
    let button = createButton('Salvar');
    button.onclick = function() {
        console.log(new Date().toString());
    }
    button.classList.add('saveButton');
    return button;
}

// ==============================================================================
//                         GENERAL AUXILIAR FUNCTIONS
// ==============================================================================

function th(str) {
    var th = document.createElement('th');
    th.innerHTML = str;
    return th;
}

function td(str) {
    var th = document.createElement('td');
    th.innerHTML = str;
    return th;
}

function link(lesson) {
    var a = document.createElement('a');
    a.innerHTML = lesson.name;
    a.href = lesson.url;
    a.target = "_blank";
    return a;
}

function createButton(str) {
    var button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = str;
    return button;
}
