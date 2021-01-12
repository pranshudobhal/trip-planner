//API

var url = 'https://detangled.in/develop/76e17330-1089-4b1d-a113-c3f1e48b2658/events';

fetch(url)
  .then((response) => response.json())
  .then((json) => {
    displayData(json);
    calendar(json);
  })
  .catch(() => alert('Some error occured!'));

const container = document.getElementById('card-sidebar');

//display data in cards
function displayData(data) {
  data.forEach((results, id) => {
    //construct card element
    const card = document.createElement('div');
    card.classList = 'row';
    card.setAttribute('id', 'card' + results.id);

    var d = new Date(results.start);
    var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ', ' + d.toLocaleTimeString([], { timeStyle: 'short' });

    //construct card content
    const content = `
    <a class="btn-floating btn-large waves-effect waves-light red" onClick=modifyDestination(${results.id}) ><i class="material-icons">mode_edit</i></a>
    <a class="btn-floating btn-large waves-effect waves-light red" onClick=deleteData(${results.id})>
    <i class="large material-icons">delete</i>
    <a class="btn-floating btn-large waves-effect waves-light red" id="save${results.id}">
    <i class="large material-icons">done</i>
    </a>
        <div class="col s12 m6">
            <div class="card" style="background-color: ${results.color}">
                <div class="card-content white-text">
                <p class="destination">
                  <span id = "destination${results.id}" contenteditable="false" class="card-title">${results.destination}</span></p>
                  <p><strong>Start Date: </strong><span class="date">${date}</span></p>
                  <p><strong>Duration: </strong><span class="duration">${results.duration}</span> days</p>
                  <p><strong>Comments: </strong><span contenteditable="false" class="comments" id="comment${results.id}">${results.comment}</span></p>
                </div>
              </div>
            </div>
        </div>
    `;

    //append new created card element to container
    card.innerHTML += content;
    container.appendChild(card);
  });
}

//modify data in api
function modifyDestination(idx) {
  var editDestinationID = document.getElementById('destination' + idx); //taking destination
  var editCommentID = document.getElementById('comment' + idx); // taking comment
  var saveBtn = document.getElementById('save' + idx); //taking save button
  editDestinationID.contentEditable = 'true'; //making destination editable
  editCommentID.contentEditable = 'true'; //making comment editable
  var originalContentDestination = editDestinationID.innerHTML; //original destination content stored in variable
  var originalContentComment = editCommentID.innerHTML; //original original comment content stored in variable

  editDestinationID.addEventListener('keyup', presskey);
  editCommentID.addEventListener('keyup', presskey);

  var modifyURL = url + '/' + idx;

  function presskey() {
    if (editDestinationID.innerHTML !== originalContentDestination || editCommentID.innerHTML !== originalContentComment) {
      saveBtn.addEventListener('click', function () {
        var updatedContentDestination = editDestinationID.innerHTML;
        var updatedContentComment = editCommentID.innerHTML;
        fetch(modifyURL, {
          method: 'PATCH',
          body: JSON.stringify({
            destination: updatedContentDestination,
            comment: updatedContentComment,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        setInterval(function () {
          window.location.reload();
        }, 1000);
        saveReset();
      });
    } else if (editDestinationID.innerHTML == originalContentDestination && editCommentID.innerHTML == originalContentComment) {
      saveBtn.addEventListener('click', saveReset);
    }
  }
  saveBtn.addEventListener('click', saveReset);

  function saveReset() {
    editDestinationID.contentEditable = 'false';
    editCommentID.contentEditable = 'false';
  }
}

//delete data from api
function deleteData(clicked) {
  var deleteURL = url + '/' + clicked;

  fetch(deleteURL, {
    method: 'DELETE',
  }).catch(() => alert('error with deletion'));

  setInterval(function () {
    window.location.reload();
  }, 1000);
}

//calender
document.addEventListener('DOMContentLoaded', calendar);

function calendar(cal) {
  var calendarEl = document.getElementById('calendar');

  var eventsCal = [];
  console.log(cal);
  cal.forEach((calData, id) => {
    console.log(calData.destination);
    Date.prototype.addDays = function (days) {
      var date = new Date(calData.start);
      date.setDate(date.getDate() + days);
      return date;
    };

    var date = new Date();
    var dict = {
      title: calData.destination,
      start: calData.start,
      end: date.addDays(calData.duration),
      color: calData.color,
    };
    eventsCal.push(dict);
  });

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    timeZone: 'local',
    initialDate: '2021-01-12',
    locale: 'en',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: eventsCal,
  });

  calendar.render();
}
