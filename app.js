document.getElementById('serviceRequestForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get form values
    const formData = {
        identifierSystem: document.getElementById('identifierSystem').value,
        identifierValue: document.getElementById('identifierValue').value,
        status: document.getElementById('status').value,
        intent: document.getElementById('intent').value,
        priority: document.getElementById('priority').value,
        patientIdentifierSystem: document.getElementById('patientIdentifierSystem').value,
        patientIdentifierValue: document.getElementById('patientIdentifierValue').value,
        occurrenceDate: document.getElementById('occurrenceDate').value,
        authoredOn: document.getElementById('authoredOn').value.split('T')[0], // Date only
        requesterReference: document.getElementById('requesterReference').value,
        performerReference: document.getElementById('performerReference').value,
        noteText: document.getElementById('noteText').value
    };

    // Build ServiceRequest FHIR resource
    const serviceRequest = {
        resourceType: "ServiceRequest",
        identifier: [{
            system: formData.identifierSystem,
            value: formData.identifierValue
        }],
        status: formData.status,
        intent: formData.intent,
        priority: formData.priority,
        subject: {
            identifier: {
                system: formData.patientIdentifierSystem,
                value: formData.patientIdentifierValue
            }
        },
        occurrenceDateTime: formData.occurrenceDate,
        authoredOn: formData.authoredOn,
        requester: {
            reference: formData.requesterReference
        },
        performer: [{
            reference: formData.performerReference
        }],
        note: formData.noteText ? [{ text: formData.noteText }] : []
    };

    try {
        const response = await fetch('https://back-end-santiago.onrender.com/servicerequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(serviceRequest)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Error al crear la solicitud');
        }

        alert('¡Solicitud de servicio creada exitosamente!');
        this.reset();
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
});

// Patient identifier lookup function
async function searchPatient() {
    const system = document.getElementById('patientIdentifierSystem').value;
    const value = document.getElementById('patientIdentifierValue').value;

    if (!system || !value) {
        alert('Por favor ingrese sistema y valor de identificación');
        return;
    }

    try {
        const response = await fetch(`https://back-end-santiago.onrender.com/patient/identifier/${system}/${value}`);
        const data = await response.json();

        if (response.ok) {
            document.getElementById('patientInfo').textContent = 
                `Paciente: ${data.name[0].given[0]} ${data.name[0].family}`;
        } else {
            throw new Error(data.detail || 'Paciente no encontrado');
        }
    } catch (error) {
        alert(error.message);
    }
}