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
    card.setAttribute('id', 'card' + id);

    //construct card content
    const content = `
    <a class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">mode_edit</i></a>
    <a class="btn-floating btn-large waves-effect waves-light red" onClick=deleteID(${results.id})>
    <i class="large material-icons">delete</i>
    </a>
        <div class="col s12 m6">
            <div class="card" style="background-color: ${results.color}">
                <div class="card-content white-text">
                  <span class="card-title">${results.destination}</span>
                  <p><strong>Start Date: </strong><span class="date">${results.start}</span></p>
                  <p><strong>Duration: </strong><span class="duration">${results.duration}</span></p>
                  <p><strong>Comments: </strong><span class="comments">${results.comment}</span></p>
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

function deleteID(clicked) {
  console.log('ID is: ' + clicked);
  constructURL(clicked);
}

function constructURL(clicked) {
  var deleteURL = url + clicked;
  console.log(deleteURL);
}

// function deleteData() {
//   fetch(url, {
//     method: ‘DELETE’
//   })
//   .catch(() => alert("error with deletion"))
// }
