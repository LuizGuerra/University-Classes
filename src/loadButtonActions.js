// PERIOD ADD BUTTON ACTION
// Add input tags
periodAddButton.onclick = function() {
    // Tags
    var inputContainer = document.getElementById('periodContainer');
    // Verify if it have enough
    if (inputContainer.children.length == 12) {
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

// SAVE BUTTON ACTION
// Save new lesson
saveButton.onclick = function() {
    // Read data from input boxes
    const lessonName = document.getElementById('lessonNameID').value;
    const classesDivChildren = document.getElementById('periodContainer').children;
    const periods = Array.from(classesDivChildren)
        .filter(x => x.tagName == 'INPUT' && x.value != '')
        .map(x => x.value.toUpperCase());
    const url = document.getElementById('urlID').value;
    // Continue action if inputs are valid
    if (lessonName.length == 0 || !areValidPeriods(periods) || !isValidURL(url)){
        return;
    }
    // Creates a new lesson and add it to the local storage
    const lesson = new Lesson(lessonName, periods, url);
    if (jsonString == null || jsonString == '') {
        jsonString = JSON.stringify([lesson]);
    } else {
        var jsonArr = JSON.parse(jsonString);
        for (i in periods) {
            const rowId =  `${periods[i].slice(1)}_Row`;
            const day = dayOfTheWeekIndex(periods[j]);
            // If already have content at that time, ignore input
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