// LOAD CALENDAR
// Verify if cache is empty
if (jsonString == null) {
    jsonString = '';
} else {
    // If is not empty, load table
    let classes = JSON.parse(jsonString);
    for (let clazz of classes) {
        const lessonName = clazz.lesson;
        const periods = clazz.periods;
        const siteURL = clazz.url;
        for (let period of periods) {
            const rowId = `${period.slice(1)}_Row`;
            const day = dayOfTheWeekIndex(period);
            var cell = document.getElementById(rowId).cells[day + 1];
            let classLink = createLink(lessonName, siteURL);
            cell.appendChild(classLink);
        }
    }
}

// Change column color if isn't today.
for (let i = 1; i < 8; i++) {
    for (let j = 1; j < 8; j++) {
        if (weekDay != i) {
            table.rows[j].cells[i].style.borderColor = 'LightGray';
        }
    }
}

if (focusString == null || focusString == 'y') {
    focusButton.classList.add('buttonIsSelected');
    focusButtonIsSelected = true;
    var cell = updateClassBackground();
    try {
        document.getElementById(`${now.now}_Row`).cells[weekDay];
        cell.title = 'Current class';
    } catch (error) {
        try {
            document.getElementById(`${now.next}_Row`).cells[weekDay];
            cell.title = 'Next class';
        } catch (error) { }
    }
}

if (autoOpenerString != null && autoOpenerString == 'y') {
    autoButton.classList.add('buttonIsSelected');
    autoButtonIsSelected = true;
    openURL();
}