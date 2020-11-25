console.log('Hello from JS');
$(document).ready(readyNow);

function readyNow() {
    console.log('Hello from JQ');
    handleClick();
    getPets();
}

function addPet(petToAdd) {
    console.log(petToAdd);
    $.ajax({
      type: 'POST',
      url: '/pet',
      data: petToAdd,
      }).then(function(response) {
        console.log('Response from server:', response);
        getPets();
        $('#name').val('')
        $('#breed').val('')
        $('#color').val('')
      }).catch(function(error) {
        console.log('Error in POST', error)
        alert('Unable to add pet at this time. Please try again later.');
      });


  }

function renderPets(pets) {
    console.log('here are our pets', pets);
    console.log(pets[0]);
    $('#petHotelRooms').empty()
    for (let each of pets) {
        let $tr = $(`<tr data-id="${each[0]}"></tr>`)
        $tr.append(`<td>${each[1]}</td>`)
        $tr.append(`<td>${each[2]}</td>`)
        $tr.append(`<td>${each[3]}</td>`)
        if (each[4] == null) { 
            $tr.append(`<td>no</td>`)
        } else {
            $tr.append(`<td>${each[4]}</td>`)
        }

        $tr.append(`<button class="deleteButton">Delete</button>`);
        $tr.append(`<button class="checkInButton" data-date="${each[4]}">Check In</button>`);

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
    $('#petHotel').on('click', '.deleteButton', handleDelete)
    $('#petHotel').on('click', '.checkInButton', handleCheckIn)
}

function handleCheckIn(){
    console.log('in handleCheckIn');
    let petId = $(this).closest('tr').data('id');
    let dateValue = $(this).data('date')
    let checkInDate = {date: dateValue}
    

    console.log('inside handleCheckIn, date:', checkInDate);
    $.ajax({
        method: 'PUT', //update
        url: `/pet/${petId}`,//req.params
        data: checkInDate //req.body
      }).then(function(response){
        console.log(response);
        getPets();
      }).catch(function(){
        
      })
}

function handleDelete(){
    let petId = $(this).closest('tr').data('id');
    console.log('in handleDelete', petId);
    $.ajax({
        method: 'DELETE',
        url: `/pet/${petId}`
      }).then( function(response) {
        getPets();
        console.log('Succesfully Deleted');
      }).catch( function(error){
        console.log('Error', error);
        alert('Something bad happened. Try again later.');
      })
}

function handleSubmit() {
    console.log('submit clicked');
    
    let petObject = {
        name: $('#name').val(), 
        breed: $('#breed').val(),
        color: $('#color').val()
    }
    addPet(petObject);
}
