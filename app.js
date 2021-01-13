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
    card.classList = 'col-xs-12 col-sm-6 col-md-6 col-lg-4 item';
    card.setAttribute('id', 'card' + results.id);

    var d = new Date(results.start);
    var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ', ' + d.toLocaleTimeString([], { timeStyle: 'short' });

    //construct card content
    const content = `    <div>
    <div class="card item-card card-block" style="background-color: ${results.color}">
      <img class="img-fluid rounded-circle" src="https://img.icons8.com/bubbles/100/000000/passenger-with-baggage.png" alt="Photo of traveller" />
      <div class="card-body">
      <div class="element-border">
      <h5 id = "destination${results.id}" contenteditable="false" class="card-title card-border mt-3">${results.destination}</h5></div>
        <p class="card-text clearfix">
          <small class="text-muted float-left">${date}</small>
          <small class="text-muted float-right">${results.duration} days</small>
        </p>
        <div class="element-border">
        <p id="comment${results.id}" contenteditable="false" class="card-text card-border">${results.comment}</p></div>
        <p class="item-card-title card-text text-right">
        <a class="" onClick=modifyDestination(${results.id})>
        <i class="material-icons">mode_edit</i>
        </a>
        <a class="" id="delete${results.id}" onClick=deleteData(${results.id})>
        <i class="material-icons">delete</i>
        </a>
        <a class="" style="display:none" id="save${results.id}">
        <i class="material-icons">done</i>
        </a>
      </p>
      </div>
  </div>
</div>`;

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
  var deleteBtn = document.getElementById('delete' + idx);

  editDestinationID.contentEditable = 'true'; //making destination editable
  editCommentID.contentEditable = 'true'; //making comment editable
  editDestinationID.style.border = '1px solid white';
  editCommentID.style.border = '1px solid white';

  var originalContentDestination = editDestinationID.innerHTML; //original destination content stored in variable
  var originalContentComment = editCommentID.innerHTML; //original original comment content stored in variable
  var modifyURL = url + '/' + idx;

  editDestinationID.addEventListener('keyup', presskey);
  editCommentID.addEventListener('keyup', presskey);

  function presskey() {
    saveBtn.style.display = 'inline-block';
    deleteBtn.style.display = 'none';
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

  // function to reset content editable and icons
  function saveReset() {
    saveBtn.style.display = 'none';
    deleteBtn.style.display = 'inline-block';
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
  Array.prototype.forEach.call(cal, (calData) => {
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
      description: calData.comment,
    };
    eventsCal.push(dict);
  });

  var d = new Date();

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    timeZone: 'local',
    navLinks: true,
    locale: 'en',
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    eventDidMount: function (info) {
      $(info.el).tooltip({
        title: info.event.extendedProps.description,
        placement: 'top',
        trigger: 'hover',
        container: 'body',
      });
    },
    events: eventsCal,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: true,
    },
  });

  calendar.render();
}
