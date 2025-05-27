document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('serviceRequestForm');
    const searchBtn = document.getElementById('searchPatientBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Set default dates
    document.getElementById('serviceDate').valueAsDate = new Date();
    document.getElementById('requestDate').valueAsDate = new Date();

    // Patient search function
    searchBtn.addEventListener('click', async function() {
        const idType = document.getElementById('idType').value;
        const idNumber = document.getElementById('idNumber').value.trim();
        
        if (!idType || !idNumber) {
            showAlert('Error', 'Debe seleccionar tipo y número de documento', 'error');
            return;
        }
        
        
        try {
            searchBtn.disabled = true;
            searchBtn.innerHTML = '<span class="spinner"></span> Buscando...';
            
            const response = await fetch(`https://back-end-santiago.onrender.com/patient?system=${idType}&value=${idNumber}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'Paciente no encontrado');
            }
            
            const patientName = `${data.name[0].given[0]} ${data.name[0].family}`;
            document.getElementById('patientInfo').innerHTML = `
                <strong>Paciente encontrado:</strong> ${patientName}<br>
                <strong>Documento:</strong> ${idNumber}
            `;
            
        } catch (error) {
            showAlert('Error', error.message, 'error');
            document.getElementById('patientInfo').textContent = '';
        } finally {
            searchBtn.disabled = false;
            searchBtn.textContent = 'Buscar';
        }
    });
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Procesando...';
            
            // Verify patient was found
            if (!document.getElementById('patientInfo').textContent) {
                throw new Error('Debe buscar y validar el paciente primero');
            }
            
            // Build request object with required FHIR fields
            const requestData = {
                resourceType: "ServiceRequest",
                identifier: [{
                    system: "http://hospital.sistema/solicitudes",
                    value: document.getElementById('requestIdentifier').value.trim() || `SR-${Date.now()}`
                }],
                status: "active",  // Required field (draft|active|completed|cancelled)
                intent: "order",   // Required field (proposal|plan|order)
                subject: {
                    identifier: {
                        system: document.getElementById('idType').value,
                        value: document.getElementById('idNumber').value.trim()
                    }
                },
                priority: document.getElementById('priority').value || "routine",
                occurrenceDateTime: document.getElementById('serviceDate').value,
                authoredOn: document.getElementById('requestDate').value,
                requester: {
                    reference: document.getElementById('requester').value.trim() || "Practitioner/unknown"
                },
                performer: [{
                    reference: document.getElementById('performer').value.trim() || "Organization/unknown"
                }],
                note: document.getElementById('notes').value.trim() ? 
                    [{ text: document.getElementById('notes').value.trim() }] : []
            };
            
            // Submit to backend
            const response = await fetch('https://back-end-santiago.onrender.com/servicerequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'Error al crear la solicitud');
            }
            
            showAlert('Éxito', 'Solicitud registrada correctamente', 'success');
            form.reset();
            document.getElementById('patientInfo').textContent = '';
            // Reset dates to today
            document.getElementById('serviceDate').valueAsDate = new Date();
            document.getElementById('requestDate').valueAsDate = new Date();
            
        } catch (error) {
            showAlert('Error', error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="button-text">Registrar Solicitud</span>';
        }
    });
    
    function showAlert(title, text, icon) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({ 
                title, 
                text, 
                icon,
                confirmButtonText: 'OK',
                confirmButtonColor: '#3498db'
            });
        } else {
            alert(`${title}\n\n${text}`);
        }
    }
});