//API

var url = 'https://detangled.in/develop/76e17330-1089-4b1d-a113-c3f1e48b2658/events';

fetch(url)
  .then((response) => response.json())
  .then((json) => {
    displayData(json);
  })
  .catch(() => alert('Some error occured!'));

const container = document.getElementById('card-sidebar');

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
                <p>
                  <span id = "destination${results.id}" contenteditable="true" class="card-title">${results.destination}</span></p>
                  <p><strong>Start Date: </strong><span class="date">${date}</span></p>
                  <p><strong>Duration: </strong><span class="duration">${results.duration}</span> days</p>
                  <p><strong>Comments: </strong><span contenteditable="true" class="comments" id="comment${results.id}">${results.comment}</span></p>
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

function modifyDestination(edited) {
  var editID = document.getElementById('destination' + edited);
  var saveBtn = document.getElementById('save' + edited);

  var originalContent = editID.innerHTML;
  editID.addEventListener('keypress', function () {
    if (editID.innerHTML !== originalContent) {
      saveBtn.addEventListener('click', function () {
        var updatedContent = editID.innerHTML;
      });
    }
  });
}

// function modifyComment(commentEdit) {
//   var editedComment = document.getElementById('comment' + commentEdit);
//   var saveBtn = document.getElementById('save' + commentEdit);

//   var original = editedComment.innerHTML;
//   editedComment.addEventListener('keypress', function () {
//     if (editedComment.innerHTML !== original) {
//       saveBtn.addEventListener('click', function () {
//         var updated = editedComment.innerHTML;
//       });
//     }
//   });
// }

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
