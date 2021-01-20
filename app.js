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

//function to display data as cards
function displayData(data) {
  //sorting data according to start date
  data.sort(function (a, b) {
    return new Date(a.start) - new Date(b.start);
  });

  //display data as cards
  data.forEach((results, id) => {
    const card = document.createElement('div');
    card.classList = 'col-xs-12 col-sm-6 col-md-6 col-lg-4 item';
    card.setAttribute('id', 'card' + results.id);
    var d = new Date(results.start);
    var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ', ' + d.toLocaleTimeString([], { timeStyle: 'short' });
    var imageURL = 'https://images.assetsdelivery.com/compings_v2/televisor555/televisor5551912/televisor555191200015.jpg';
    const content = `
    <div>
    <div class="card item-card card-block" style="background-color: ${results.color}">
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
    <img id="image-card" class="img-fluid rounded-circle mx-auto mt-4" src="${imageURL}" alt="Photo of traveller" />
    <div class="card-body">
        <p class="card-title-comment">Destination </p>
        <p id = "destination${results.id}" contenteditable="false" class="card-margin card-title card-border">${results.destination}</p>
        <p class="card-title-comment">Trip Start Date </p>
          <span class="card-margin">${date}</span>
        <p class="card-title-comment">Trip Duration </p>
          <span class="card-margin">${results.duration} days</span>
        <p class="card-title-comment">Comments </p>
        <p id="comment${results.id}" contenteditable="false" class="card-margin card-text card-border">${results.comment}</p>
    </div>
    </div>
    </div>`;
    card.innerHTML += content;
    container.appendChild(card);
  });
}

//function to modify data in api
function modifyDestination(idx) {
  var editDestinationID = document.getElementById('destination' + idx);
  var editCommentID = document.getElementById('comment' + idx);
  var saveBtn = document.getElementById('save' + idx);
  var deleteBtn = document.getElementById('delete' + idx);

  editDestinationID.contentEditable = 'true';
  editCommentID.contentEditable = 'true';
  editDestinationID.style.border = '1px solid white';
  editCommentID.style.border = '1px solid white';

  var originalContentDestination = editDestinationID.innerHTML;
  var originalContentComment = editCommentID.innerHTML;
  var modifyURL = url + '/' + idx;

  saveBtn.style.display = 'inline-block';
  deleteBtn.style.display = 'none';

  editDestinationID.addEventListener('keyup', presskey);
  editCommentID.addEventListener('keyup', presskey);

  function presskey() {
    saveBtn.addEventListener('click', check);

    function check() {
      if (editDestinationID.innerHTML !== originalContentDestination || editCommentID.innerHTML !== originalContentComment) {
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
      }
      saveReset();
    }
  }
  saveBtn.addEventListener('click', saveReset);

  // function to reset content editable and icons
  function saveReset() {
    saveBtn.style.display = 'none';
    deleteBtn.style.display = 'inline-block';
    editDestinationID.contentEditable = 'false';
    editCommentID.contentEditable = 'false';
    editDestinationID.style.border = 'none';
    editCommentID.style.border = 'none';
  }
}

//function to delete data from api
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
