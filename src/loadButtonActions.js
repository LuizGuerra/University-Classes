// PERIOD ADD BUTTON ACTION
// Add input tags
periodAddButton.onclick = function () {
    // Verify if it have enough
    if (periodInputs.length == 13) return alert('Número máximo de períodos atingido.');
    // Create input
    var input = document.createElement('input');
    input.type = 'text';
    input.classList.add('periodsInputStyle');
    input.placeholder = '2JK';
    input.autocomplete = 'off';
    input.maxLength = '3';
    periodContainer.insertBefore(input, periodAddButton);
}

// PERIOD REMOVE BUTTON ACTION
// Remove input tags
periodRemoveButton.onclick = function () {
    // Verify if can remove
    if (periodInputs.length == 3) return alert('Não é possível remover, pois o mínimo de períodos é 1.');
    // Remove last input
    var lastInput = periodInputs[periodInputs.length-3];
    lastInput.remove();
}

// SAVE BUTTON ACTION
// Save new lesson
saveButton.onclick = function () {
    // Read data from input boxes
    const lessonName = lessonNameInput.value;
    const periods = Array.from(
        new Set(retrievePeriodInputFields()
            .map(x => x.value.toUpperCase())
            .filter(x => x != ''))
    );
    const url = urlInput.value;
    // Continue action if inputs are valid
    var errors = [];
    // Verify lesson name input
    if (lessonName.length == 0) {
        errors.push('Nome da cadeira não pode estar vazia.');
        lessonNameInput.style.border = '2px solid #e32a05';
    }
    // Verify Periods input
    const invalidPeriods = areValidPeriods(periods);
    if (periods.length == 0) {
        errors.push('A cadeira deve ter ao menos um horário.');
    } else if (invalidPeriods.length != 0) {
        if (invalidPeriods.length == 1) {
            errors.push(`${invalidPeriods[0]} não é um horário válido.`);
        } else {
            errors.push(`${invalidPeriods.join(', ')} não são horários válidos.`);
        }
    }
    if (periodInputs[0].children[1].value.length == 0 ||
        invalidPeriods.includes(periodInputs[0].children[1].value.toUpperCase())) {
        periodInputs[0].children[1].style.border = '2px solid #e32a05';
    }
    for (let i = 1; i < periodInputs.length - 2; i++) {
        if (periodInputs[i].value.length == 0 ||
            invalidPeriods.includes(periodInputs[i].value.toUpperCase())) {
            periodInputs[i].style.border = '2px solid #e32a05';
        }
    }
    // Verify URL input
    if (url.length == 0) {
        errors.push('A URL não pode estar vazia.');
        urlInput.style.border = '2px solid #e32a05';
    } else if (!isValidURL(url)) {
        errors.push('A URL informada não é um link de aula.');
        urlInput.style.border = '2px solid #e32a05';
    }
    if (errors.length != 0) {
        alert(errors.join('\n'));
        return;
    }
    // Creates a new lesson and add it to the local storage
    const lesson = new Lesson(lessonName, periods, url);
    removeLesson(lessonName);
    if (jsonString == null || jsonString == '') {
        jsonString = JSON.stringify([lesson]);
    } else {
        var jsonArr = JSON.parse(jsonString);
        for (let period of periods) {
            const rowId = `${period.slice(1)}_Row`;
            const day = dayOfTheWeekIndex(period);
            // If isn't editing and already have content at that time that, ignore input
            if (!editLessonButtonIsSelected && document.getElementById(rowId).children[day + 1].childElementCount != 0) {
                alert('A disciplina conflita com outra disciplina no mesmo horário');
                return;
            }
        }
        jsonArr.push(lesson);
        jsonString = JSON.stringify(jsonArr);
    }
    localStorage.setItem(storageKey, jsonString);
    location.reload();
}

// AUTO OPENER BUTTON ACTION
autoButton.onclick = function () {
    if (autoOpenerString == null) {
        if (confirm(autoConfirmString)) {
            openURL();
        }
    }
    if (autoButtonIsSelected) {
        autoButtonIsSelected = false;
        autoButton.classList.remove('buttonIsSelected');
        localStorage.setItem(autoStorageKey, 'n');
        location.reload();
        return;
    }
    autoButton.classList.add('buttonIsSelected');
    autoButtonIsSelected = true;
    localStorage.setItem(autoStorageKey, 'y');
    location.reload();
}

var flag = true;
// FOCUS BUTTON ACTION
focusButton.onclick = function () {
    if (flag && now.now == null && now.now == null) {
        flag = false;
        alert(noClassFlagAlert);
    }
    if (focusButtonIsSelected) {
        focusButtonIsSelected = false;
        focusButton.classList.remove('buttonIsSelected');
        focusString = 'n';
        localStorage.setItem(focusStorageKey, 'n');
    } else {
        focusButtonIsSelected = true;
        focusButton.classList.add('buttonIsSelected');
        focusString = 'y';
        localStorage.setItem(focusStorageKey, 'y');
    }
    if(!flag) { return; }
    updateClassBackground();
}

// PURGE BUTTON ACTION
purgeButton.onclick = function () {
    if (confirm('Tem certeza que quer apagar todos os seus dados? Você perderá o que tem agora.')) {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(autoStorageKey);
        localStorage.removeItem(focusStorageKey);
        location.reload();
    }
}

// EDIT BUTTON ACTION
editButton.onclick = function () {
    // If is already on
    if (editLessonButtonIsSelected) {
        editLessonButtonIsSelected = false;
        editButton.classList.remove('buttonIsSelected');
        let editButtons = document.getElementsByClassName('editLessonButton');
        while (editButtons.length > 0) {
            editButtons[0].parentElement.removeChild(editButtons[0]);
        }
        let removeButtons = document.getElementsByClassName('removeLessonButton');
        while (removeButtons.length > 0) {
            removeButtons[0].parentElement.removeChild(removeButtons[0]);
        }
        return;
    }
    // If is turning on
    if (jsonString == '') {
        return;
    }
    editLessonButtonIsSelected = true;
    editButton.classList.add('buttonIsSelected');
    let classes = JSON.parse(jsonString);
    for (let clazz of classes) {
        const lessonInfo = clazz;
        const periods = lessonInfo.periods;
        for (let period of periods) {
            const rowId = `${period.slice(1)}_Row`;
            const day = dayOfTheWeekIndex(period);
            const cell = document.getElementById(rowId).cells[day + 1];
            let editButton = createEditButton(lessonInfo.lesson);
            cell.insertBefore(editButton, cell.children[0]);
            let removeButton = createRemoveButton(lessonInfo.lesson);
            cell.insertBefore(removeButton, cell.children[0]);
        }
    }
}

// GET A LESSON OBJECT
function getLesson(named) {
    if (jsonString == '') {
        return;
    }
    var classes = JSON.parse(jsonString);
    for (let clazz of classes) {
        if (clazz.lesson.toLowerCase() == named.toLowerCase()) {
            return clazz;
        }
    }
    return null;
}

// REMOVE LESSON WITH GIVEN NAME
function removeLesson(lesson) {
    if (jsonString == '' || lesson == undefined || lesson.length == 0) {
        return;
    }
    var classes = JSON.parse(jsonString);
    var removedLesson = null;
    for (var i in classes) {
        if (classes[i]['lesson'].toLowerCase() == lesson.toLowerCase()) {
            removedLesson = classes.splice(i, 1);
            break;
        }
    }
    updateLocalStorageData(classes);
    return removedLesson;
}

// EDIT BUTTON ON TABLE ACTION
function editLesson(lesson) {
    const lessonObject = getLesson(lesson);
    const periodsArrayLength = lessonObject.periods.length;
    // Add text to lesson name input
    lessonNameInput.value = lessonObject.lesson;
    // At the first index, add text to lesson input
    periodInputs[0].children[1].value = lessonObject.periods[0];
    // Remove not used inputs
    // CAUTION: last one is the add button, do not remove it!
    while (periodInputs.length > 3) {
        periodInputs[1].parentNode.removeChild(periodInputs[1]);
    }
    // Add the remaining lesson periods, if there are more than one
    for (let i = 1; i < periodsArrayLength; i++) {
        // Create period input if there isn't one
        if (i + 2 >= periodInputs.length) {
            periodAddButton.onclick();
        }
        // Add text to period input
        periodInputs[i].value = lessonObject.periods[i];
    }
    // Add text to lesson url input
    urlInput.value = lessonObject.url;
}

document.addEventListener('keydown', function (event) {
    if (event.key == "Enter") {
        saveButton.click();
    }
});

var cb = document.getElementById('checkbox_colors');
function doAlert(cb) {
    console.log(cb.checked);
}