document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('serviceRequestForm');
    const searchBtn = document.getElementById('searchPatientBtn');
    
    // Patient search function
    searchBtn.addEventListener('click', async function() {
        const system = document.getElementById('patientIdentifierSystem').value;
        const value = document.getElementById('patientIdentifierValue').value;
        
        if (!system || !value) {
            alert('Por favor complete ambos campos de identificación');
            return;
        }
        
        try {
            const response = await fetch(`https://back-end-santiago.onrender.com/patient/identifier/${system}/${value}`);
            const data = await response.json();
            
            if (response.ok) {
                const patientName = `${data.name[0].given[0]} ${data.name[0].family}`;
                document.getElementById('patientInfo').textContent = `Paciente encontrado: ${patientName}`;
            } else {
                throw new Error(data.detail || 'Paciente no encontrado');
            }
        } catch (error) {
            alert(error.message);
            document.getElementById('patientInfo').textContent = '';
        }
    });
    
    // Form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Get form values
        const requestData = {
            identifier: {
                system: "http://hospital.sistema/solicitudes",
                value: document.getElementById('identifierValue').value
            },
            subject: {
                identifier: {
                    system: document.getElementById('patientIdentifierSystem').value,
                    value: document.getElementById('patientIdentifierValue').value
                }
            },
            priority: document.getElementById('priority').value,
            occurrenceDateTime: document.getElementById('occurrenceDate').value,
            authoredOn: document.getElementById('authoredOn').value,
            requester: {
                reference: document.getElementById('requesterReference').value
            },
            performer: [{
                reference: document.getElementById('performerReference').value || ''
            }],
            note: document.getElementById('noteText').value ? 
                [{ text: document.getElementById('noteText').value }] : []
        };
        
        try {
            const response = await fetch('https://back-end-santiago.onrender.com/servicerequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Solicitud creada exitosamente!');
                form.reset();
                document.getElementById('patientInfo').textContent = '';
            } else {
                throw new Error(data.detail || 'Error al crear la solicitud');
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
});