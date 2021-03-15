// LOAD CALENDAR ACTION
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


// document.getElementById('tagged').style.borderColor = 'green';
// document.getElementById('tagged').style.borderWidth = '3px';
// document.getElementById('tagged').style.borderRadius = '10px';