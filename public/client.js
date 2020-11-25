console.log('Hello from JS');
$(document).ready(readyNow);

function readyNow() {
    console.log('Hello from JQ');
    handleClick();
    getPets();
}

function renderPets() {
    
}

function getPets() {
    $.ajax({
        method: 'GET',
        url: '/pet'
      }).then( function(response) {
         renderPets( response );
        console.log('Response in getPets:', response);
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
