document.getElementById('serviceRequestForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const identifier = document.getElementById('identifier').value;
    const status = document.getElementById('status').value;
    const intent = document.getElementById('intent').value;
    const priority = document.getElementById('priority').value;
    const patientRef = document.getElementById('patientRef').value;
    const requesterRef = document.getElementById('requesterRef').value;
    const code = document.getElementById('code').value;
    const reasonCode = document.getElementById('reasonCode').value;
    const category = document.getElementById('category').value;
    const doNotPerform = document.getElementById('doNotPerform').checked;
    const occurrence = document.getElementById('occurrence').value;
    const asNeeded = document.getElementById('asNeeded').value;
    const performer = document.getElementById('performer').value;
    const location = document.getElementById('location').value;
    const insurance = document.getElementById('insurance').value;
    const supportingInfo = document.getElementById('supportingInfo').value;
    const bodySite = document.getElementById('bodySite').value;
    const note = document.getElementById('note').value;

    // Crear el objeto ServiceRequest en formato FHIR
    const serviceRequest = {
        resourceType: "ServiceRequest",
        identifier: [{
            value: identifier
        }],
        status: status,
        intent: intent,
        priority: priority,
        subject: {
            reference: `Patient/${patientRef}`
        },
        requester: {
            reference: `Practitioner/${requesterRef}`
        },
        code: {
            coding: [{
                code: code,
                system: "http://snomed.info/sct" // SNOMED CT como sistema por defecto
            }]
        },
        reasonCode: [{
            text: reasonCode
        }],
        category: [{
            text: category
        }],
        doNotPerform: doNotPerform,
        occurrenceDateTime: occurrence,
        asNeededBoolean: asNeeded,
        performer: [{
            reference: `Practitioner/${performer}`
        }],
        locationReference: [{
            reference: `Location/${location}`
        }],
        insurance: [{
            reference: `Coverage/${insurance}`
        }],
        supportingInfo: [{
            reference: supportingInfo
        }],
        bodySite: [{
            text: bodySite
        }],
        note: [{
            text: note
        }]
    };

    // Enviar los datos usando Fetch API
    fetch('https://back-end-santiago.onrender.com/service', {
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
