document.addEventListener("DOMContentLoaded", function () {
    // Sidebar toggle logic
    const toggleBtn = document.createElement("button");
    toggleBtn.innerHTML = "☰";
    toggleBtn.className = "sidebar-toggle";
    document.body.appendChild(toggleBtn);

    const sidebar = document.querySelector(".left_main_container");
    const overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);

    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", function () {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    });

    // Active menu highlighting
    const menuItems = document.querySelectorAll(".menu-item a");
    const currentPage = window.location.pathname.split("/").pop();

    menuItems.forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage && (linkPage === currentPage || (currentPage === "" && linkPage === "index.html"))) {
            link.parentElement.classList.add("active");
        } else {
            link.parentElement.classList.remove("active");
        }
    });

    // DYNAMIC DATA UPDATE
    let patients = JSON.parse(localStorage.getItem("patients"));

    // Seed if empty (consistent with patients.js)
    if (!patients || patients.length === 0) {
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
        patients = samplePatients;
    }

    const totalPatients = patients.length;

    // Update Card
    const patientCountElement = document.getElementById("total-patients-count") || document.querySelector(".dashboard-card.patients .poi");
    if (patientCountElement) {
        patientCountElement.innerText = totalPatients;
    }

    // Update other cards with mock dynamic data based on patient count
    const appointmentsCount = totalPatients + 2; 
    const todayPatientsCount = Math.ceil(totalPatients * 0.3);
    const labTestsCount = Math.ceil(totalPatients * 0.8);

    const appointmentsEl = document.getElementById("appointments-count");
    if (appointmentsEl) appointmentsEl.innerText = appointmentsCount;

    const todayPatientsEl = document.getElementById("today-patients-count");
    if (todayPatientsEl) todayPatientsEl.innerText = todayPatientsCount;

    const labTestsEl = document.getElementById("lab-tests-count");
    if (labTestsEl) labTestsEl.innerText = labTestsCount;

    // Render Recent Patients Table
    const tableBody = document.getElementById("dashboard-patients-table-body");
    if (tableBody) {
        tableBody.innerHTML = "";
        // Show last 5 patients
        const recentPatients = patients.slice().reverse().slice(0, 5);
        
        recentPatients.forEach(p => {
            const tr = document.createElement("tr");
            tr.style.cursor = "pointer";
            tr.onclick = function() {
                window.location.href = `patients.html?personalId=${p.personalId}`;
            };

            // Determine status class
            let statusClass = "confirmed"; // Default/Active (greenish)
            let statusText = p.status;
            if (p.status === "Inactive") statusClass = "pending"; // Yellowish
            if (p.status === "Deceased") statusClass = "cancelled"; // Red/Grey

            tr.innerHTML = `
                <td>${p.firstName} ${p.lastName}</td>
                <td>${p.personalId}</td>
                <td>${p.phone}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // CHARTS IMPLEMENTATION
    
    // 1. Patients Statistics (Line Chart)
    const patientsChartCanvas = document.getElementById('patientsChart');
    if (patientsChartCanvas) {
        const ctxPatients = patientsChartCanvas.getContext('2d');
        
        // Update last data point to match total
        // We'll adjust the curve slightly to look realistic based on the total
        const patientData = [Math.max(0, totalPatients - 50), Math.max(0, totalPatients - 30), Math.max(0, totalPatients - 10), Math.max(0, totalPatients - 5), totalPatients];

        new Chart(ctxPatients, {
            type: 'line',
            data: {
                labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun'], // Adjusted labels
                datasets: [{
                    label: 'Total Patients',
                    data: patientData,
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                }
            }
        });
    }

    // 2. Department Distribution (Doughnut Chart)
    const departmentsChartCanvas = document.getElementById('departmentsChart');
    if (departmentsChartCanvas) {
        const ctxDepartments = departmentsChartCanvas.getContext('2d');
        new Chart(ctxDepartments, {
            type: 'doughnut',
            data: {
                labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Dermatology'],
                datasets: [{
                    data: [35, 25, 25, 15],
                    backgroundColor: ['#f44336', '#2196f3', '#ff9800', '#9c27b0'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                }
            }
        });
    }
});
