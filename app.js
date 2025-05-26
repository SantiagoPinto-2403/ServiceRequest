document.getElementById('serviceRequestForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const status = document.getElementById('status').value;
    const intent = document.getElementById('intent').value;
    const priority = document.getElementById('priority').value;
    const subjectReference = document.getElementById('subjectReference').value;
    const encounterReference = document.getElementById('encounterReference').value;
    const occurrenceDate = document.getElementById('occurrenceDate').value;
    let authoredOn = document.getElementById('authoredOn').value;
    const requesterReference = document.getElementById('requesterReference').value;
    const performerReference = document.getElementById('performerReference').value;
    const noteText = document.getElementById('noteText').value;

    // Remove time component if present (keep only date part)
    if (authoredOn) {
        authoredOn = authoredOn.split('T')[0];
    }

    const serviceRequest = {
        resourceType: "ServiceRequest",
        identifier: [{
            system: identifierSystem,
            value: identifierValue
        }],
        status: status,
        intent: intent,
        priority: priority,
        subject: {
            reference: subjectReference
        },
        encounter: {
            reference: encounterReference
        },
        occurrenceDateTime: occurrenceDate,
        authoredOn: authoredOn, // Now only contains date without time
        requester: {
            reference: requesterReference
        },
        performer: [{
            reference: performerReference
        }],
        note: [{
            text: noteText
        }]
    };

    fetch('https://back-end-santiago.onrender.com/servicerequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceRequest)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Solicitud de servicio creada exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al crear la solicitud de servicio.');
    });
});