document.getElementById('serviceRequestForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const status = document.getElementById('status').value;
    const intent = document.getElementById('intent').value;
    const priority = document.getElementById('priority').value;
    const subjectReference = document.getElementById('subjectReference').value;
    const requesterReference = document.getElementById('requesterReference').value;
    const reasonCode = document.getElementById('reasonCode').value;
    const reasonText = document.getElementById('reasonText').value;

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
        requester: {
            reference: requesterReference
        },
        reasonCode: [{
            coding: [{
                system: "http://terminology.hl7.org/CodeSystem/reason-code",
                code: reasonCode,
                display: reasonText
            }]
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
