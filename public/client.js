console.log('Hello from JS');
$(document).ready(readyNow);

function readyNow() {
    console.log('Hello from JQ');
    handleClick();
    getPets();
}

function renderPets(pets) {
    console.log('here are our pets', pets);
    console.log(pets[0]);
    for (let each of pets) {
        let $tr = $(`<tr data-id="${each[0]}"></tr>`)
        $tr.append(`<td>${each[1]}</td>`)
        $tr.append(`<td>${each[2]}</td>`)
        $tr.append(`<td>${each[3]}</td>`)
        $tr.append(`<td>${each[4]}</td>`)

        $tr.append(`<button class="deleteButton">Delete</button>`);
        $tr.append(`<button class="checkInButton">Check In</button>`);

        $('#petHotelRooms').append($tr)
    }
    
}

function getPets() {
    $.ajax({
        method: 'GET',
        url: '/pet'
      }).then( function(response) {
         renderPets( response.pets );
        // console.log('Response in getPets:', response);
      }).catch( function(error) {
        console.log('Error getting books', error);
        alert('Sorry. Something bad happened. Try again later.');
      })
    
}

function handleClick() {
    console.log('handling the clicks');
$('#btn-submit').on('click', handleSubmit)
}

function handleSubmit() {
    console.log('submit clicked');
}
