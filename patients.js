document.addEventListener("DOMContentLoaded", function () {
    const patientsListContainer = document.getElementById("patients-list-container");
    const addPatientBtn = document.getElementById("add-patient-btn");
    
    // Add Modal Elements
    const addModal = document.getElementById("patient-modal");
    const closeAddModalBtn = document.querySelector(".close-modal"); // First one (add modal)
    
    // View Modal Elements
    const viewModal = document.getElementById("view-patient-modal");
    const closeViewModalBtn = document.querySelector(".close-view-modal");
    const viewDetailsContainer = document.getElementById("view-patient-details");

    const patientForm = document.getElementById("patient-form");
    const searchInput = document.getElementById("search-patient");

    // Seed Data if empty
    seedPatients();

    // Load patients on startup
    renderPatients();

    // Check for URL parameter (from Dashboard click)
    const urlParams = new URLSearchParams(window.location.search);
    const linkedPersonalId = urlParams.get('personalId');
    if (linkedPersonalId) {
        const patients = JSON.parse(localStorage.getItem("patients")) || [];
        const foundPatient = patients.find(p => p.personalId === linkedPersonalId);
        if (foundPatient) {
            openViewModal(foundPatient);
        }
    }

    // --- Add Patient Logic ---
    if (addPatientBtn) {
        addPatientBtn.addEventListener("click", () => {
            addModal.style.display = "block";
            document.body.style.overflow = "hidden";
        });
    }

    if (closeAddModalBtn) {
        closeAddModalBtn.addEventListener("click", () => {
            addModal.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    // --- View Patient Logic ---
    if (closeViewModalBtn) {
        closeViewModalBtn.addEventListener("click", () => {
            viewModal.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    // Close on outside click (both modals)
    window.addEventListener("click", (e) => {
        if (e.target === addModal) {
            addModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
        if (e.target === viewModal) {
            viewModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    // Handle Form Submission
    if (patientForm) {
        patientForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const consent = document.getElementById("consent").checked;
            if (!consent) {
                alert("Please sign the consent form to proceed.");
                return;
            }

            const newPatient = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                personalId: document.getElementById("personalId").value,
                dob: document.getElementById("dob").value,
                gender: document.getElementById("gender").value,
                citizenship: document.getElementById("citizenship").value,
                phone: document.getElementById("phone").value,
                addressActual: document.getElementById("addressActual").value,
                addressLegal: document.getElementById("addressLegal").value,
                email: document.getElementById("email").value,
                bloodGroup: document.getElementById("bloodGroup").value,
                allergies: document.getElementById("allergies").value,
                status: document.getElementById("status").value,
                familyDoctor: document.getElementById("familyDoctor").value,
                diagnosis: document.getElementById("diagnosis").value,
                insuranceCompany: document.getElementById("insuranceCompany").value,
                policyNumber: document.getElementById("policyNumber").value,
                insuranceType: document.getElementById("insuranceType").value,
                createdAt: new Date().toISOString()
            };

            if (!/^\d{11}$/.test(newPatient.personalId)) {
                alert("Personal ID must be exactly 11 digits.");
                return;
            }

            let patients = JSON.parse(localStorage.getItem("patients")) || [];
            if (patients.some(p => p.personalId === newPatient.personalId)) {
                alert("A patient with this Personal ID already exists.");
                return;
            }

            patients.push(newPatient);
            localStorage.setItem("patients", JSON.stringify(patients));

            patientForm.reset();
            addModal.style.display = "none";
            document.body.style.overflow = "auto";

            renderPatients();
            alert("Patient added successfully!");
        });
    }

    // Search Functionality
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderPatients(e.target.value);
        });
    }

    function renderPatients(searchTerm = "") {
        const patients = JSON.parse(localStorage.getItem("patients")) || [];
        patientsListContainer.innerHTML = "";

        if (patients.length === 0) {
            patientsListContainer.innerHTML = '<div class="no-data">No patients found. Click "Add Patient" to create one.</div>';
            return;
        }

        const filtered = patients.filter(p => 
            p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.personalId.includes(searchTerm)
        );

        if (filtered.length === 0) {
            patientsListContainer.innerHTML = '<div class="no-data">No matching patients found.</div>';
            return;
        }

        filtered.forEach(p => {
            const card = document.createElement("div");
            card.className = "patient-card";
            
            let statusColor = "#4caf50"; 
            if(p.status === "Inactive") statusColor = "#ff9800";
            if(p.status === "Deceased") statusColor = "#9e9e9e";

            card.innerHTML = `
                <div class="patient-header">
                    <div class="patient-avatar">${p.firstName[0]}${p.lastName[0]}</div>
                    <div class="patient-info-main">
                        <h3>${p.firstName} ${p.lastName}</h3>
                        <span class="patient-id">ID: ${p.personalId}</span>
                    </div>
                    <div class="patient-status" style="background-color: ${statusColor}">${p.status}</div>
                </div>
                <div class="patient-body">
                    <p><strong>Problem:</strong> ${p.diagnosis || "N/A"}</p>
                    <p><strong>Phone:</strong> ${p.phone || "N/A"}</p>
                </div>
                <div class="patient-footer">
                    <button class="view-btn">View Details</button>
                </div>
            `;
            
            // Attach Event Listener
            const viewBtn = card.querySelector(".view-btn");
            viewBtn.addEventListener("click", () => openViewModal(p));

            patientsListContainer.appendChild(card);
        });
    }

    function openViewModal(patient) {
        if (!viewDetailsContainer) return;

        viewDetailsContainer.innerHTML = `
            <div class="detail-group">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> ${patient.firstName} ${patient.lastName}</p>
                <p><strong>ID:</strong> ${patient.personalId}</p>
                <p><strong>DOB:</strong> ${patient.dob}</p>
                <p><strong>Gender:</strong> ${patient.gender}</p>
                <p><strong>Citizenship:</strong> ${patient.citizenship}</p>
            </div>
            <div class="detail-group">
                <h3>Contact</h3>
                <p><strong>Phone:</strong> ${patient.phone}</p>
                <p><strong>Email:</strong> ${patient.email || "N/A"}</p>
                <p><strong>Address (Actual):</strong> ${patient.addressActual}</p>
                <p><strong>Address (Legal):</strong> ${patient.addressLegal}</p>
            </div>
            <div class="detail-group">
                <h3>Medical</h3>
                <p><strong>Blood Group:</strong> ${patient.bloodGroup || "Unknown"}</p>
                <p><strong>Allergies:</strong> ${patient.allergies || "None"}</p>
                <p><strong>Status:</strong> ${patient.status}</p>
                <p><strong>Diagnosis:</strong> ${patient.diagnosis || "N/A"}</p>
                <p><strong>Family Doctor:</strong> ${patient.familyDoctor || "N/A"}</p>
            </div>
            <div class="detail-group">
                <h3>Insurance</h3>
                <p><strong>Company:</strong> ${patient.insuranceCompany || "N/A"}</p>
                <p><strong>Policy #:</strong> ${patient.policyNumber || "N/A"}</p>
                <p><strong>Type:</strong> ${patient.insuranceType || "None"}</p>
            </div>
        `;
        
        viewModal.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    function seedPatients() {
        if (!localStorage.getItem("patients")) {
            const samplePatients = [
                {
                    firstName: "Giorgi", lastName: "Beridze", personalId: "01020304050", dob: "1985-05-12", gender: "Male", citizenship: "Georgia",
                    phone: "599112233", addressActual: "Tbilisi, Rustaveli Ave 1", addressLegal: "Tbilisi, Rustaveli Ave 1", email: "giorgi@example.com",
                    bloodGroup: "A+", allergies: "Penicillin", status: "Active", familyDoctor: "Dr. Nino", diagnosis: "Hypertension",
                    insuranceCompany: "GPI", policyNumber: "GPI-12345", insuranceType: "Corporate", createdAt: new Date().toISOString()
                },
                {
                    firstName: "Nino", lastName: "Kapanadze", personalId: "11020304051", dob: "1990-08-20", gender: "Female", citizenship: "Georgia",
                    phone: "577445566", addressActual: "Batumi, Gorgiladze St 10", addressLegal: "Batumi, Gorgiladze St 10", email: "nino@example.com",
                    bloodGroup: "O+", allergies: "None", status: "Active", familyDoctor: "Dr. David", diagnosis: "Migraine",
                    insuranceCompany: "Imedi L", policyNumber: "IL-67890", insuranceType: "Individual", createdAt: new Date().toISOString()
                },
                {
                    firstName: "David", lastName: "Gelashvili", personalId: "21020304052", dob: "1978-02-14", gender: "Male", citizenship: "Georgia",
                    phone: "555778899", addressActual: "Kutaisi, Tsereteli St 5", addressLegal: "Kutaisi, Tsereteli St 5", email: "david@example.com",
                    bloodGroup: "B-", allergies: "Nuts", status: "Inactive", familyDoctor: "Dr. Ana", diagnosis: "Diabetes Type 2",
                    insuranceCompany: "Ardi", policyNumber: "ARD-11223", insuranceType: "Universal", createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem("patients", JSON.stringify(samplePatients));
        }
    }
});
