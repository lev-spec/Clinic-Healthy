document.addEventListener("DOMContentLoaded", function () {
    const doctorsListContainer = document.getElementById("doctors-list-container");
    const addDoctorBtn = document.getElementById("add-doctor-btn");
    const doctorModal = document.getElementById("doctor-modal");
    const closeDoctorModalBtn = document.querySelector(".close-modal");
    const doctorForm = document.getElementById("doctor-form");
    const searchInput = document.getElementById("search-doctor");

    // Seed Data
    seedDoctors();
    renderDoctors();

    // --- Modal Logic ---
    if (addDoctorBtn) {
        addDoctorBtn.addEventListener("click", () => {
            document.querySelector("#doctor-modal h2").textContent = "ექიმის დამატება";
            document.querySelector("#doctor-form .submit-btn").textContent = "შენახვა";
            document.getElementById("doctor-edit-id").value = "";
            doctorForm.reset();
            doctorModal.style.display = "block";
            document.body.style.overflow = "hidden";
        });
    }

    if (closeDoctorModalBtn) {
        closeDoctorModalBtn.addEventListener("click", () => {
            doctorModal.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === doctorModal) {
            doctorModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    // --- Form Submission ---
    if (doctorForm) {
        doctorForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const editId = document.getElementById("doctor-edit-id").value;
            const newDoctor = {
                firstName: document.getElementById("docFirstName").value,
                lastName: document.getElementById("docLastName").value,
                id: document.getElementById("docId").value,
                specialty: document.getElementById("docSpecialty").value,
                phone: document.getElementById("docPhone").value,
                email: document.getElementById("docEmail").value,
                createdAt: editId ? undefined : new Date().toISOString()
            };

            let doctors = JSON.parse(localStorage.getItem("doctors")) || [];

            if (editId) {
                // Edit Mode
                if (editId !== newDoctor.id && doctors.some(d => d.id === newDoctor.id)) {
                    alert("ექიმი ამ ID-ით უკვე არსებობს.");
                    return;
                }

                const index = doctors.findIndex(d => d.id === editId);
                if (index !== -1) {
                    newDoctor.createdAt = doctors[index].createdAt;
                    doctors[index] = newDoctor;
                    localStorage.setItem("doctors", JSON.stringify(doctors));
                    alert("ექიმის მონაცემები განახლდა!");
                }
            } else {
                // Add Mode
                if (doctors.some(d => d.id === newDoctor.id)) {
                    alert("ექიმი ამ ID-ით უკვე არსებობს.");
                    return;
                }
                doctors.push(newDoctor);
                localStorage.setItem("doctors", JSON.stringify(doctors));
                alert("ექიმი წარმატებით დაემატა!");
            }

            doctorModal.style.display = "none";
            document.body.style.overflow = "auto";
            renderDoctors();
        });
    }

    // --- Search ---
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderDoctors(e.target.value);
        });
    }

    // --- Delete Global Function ---
    window.deleteDoctor = function(id) {
        if (confirm("დარწმუნებული ხართ, რომ გსურთ ამ ექიმის წაშლა?")) {
            let doctors = JSON.parse(localStorage.getItem("doctors")) || [];
            doctors = doctors.filter(d => d.id !== id);
            localStorage.setItem("doctors", JSON.stringify(doctors));
            renderDoctors(searchInput ? searchInput.value : "");
        }
    }

    // --- Edit Global Helper ---
    window.openEditDoctorModal = function(id) {
        const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
        const doctor = doctors.find(d => d.id === id);
        
        if (doctor) {
            document.querySelector("#doctor-modal h2").textContent = "ექიმის რედაქტირება";
            document.querySelector("#doctor-form .submit-btn").textContent = "განახლება";
            document.getElementById("doctor-edit-id").value = doctor.id;

            document.getElementById("docFirstName").value = doctor.firstName;
            document.getElementById("docLastName").value = doctor.lastName;
            document.getElementById("docId").value = doctor.id;
            document.getElementById("docSpecialty").value = doctor.specialty;
            document.getElementById("docPhone").value = doctor.phone || "";
            document.getElementById("docEmail").value = doctor.email || "";

            doctorModal.style.display = "block";
            document.body.style.overflow = "hidden";
        }
    }

    function renderDoctors(searchTerm = "") {
        const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
        doctorsListContainer.innerHTML = "";

        if (doctors.length === 0) {
            doctorsListContainer.innerHTML = '<div class="no-data">ექიმები არ მოიძებნა. დააჭირეთ "ექიმის დამატებას".</div>';
            return;
        }

        const filtered = doctors.filter(d => 
            d.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            d.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.id.includes(searchTerm) ||
            d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filtered.length === 0) {
            doctorsListContainer.innerHTML = '<div class="no-data">შესაბამისი ექიმები არ მოიძებნა.</div>';
            return;
        }

        filtered.forEach(d => {
            const card = document.createElement("div");
            card.className = "patient-card"; // Reusing patient card style
            
            card.innerHTML = `
                <div class="patient-header">
                    <div class="patient-avatar" style="background-color: #e3f2fd; color: #1976d2;">
                        <i class="fa-solid fa-user-doctor"></i>
                    </div>
                    <div class="patient-info-main">
                        <h3>${d.firstName} ${d.lastName}</h3>
                        <span class="patient-id">ID: ${d.id}</span>
                    </div>
                    <div class="patient-status" style="background-color: #1a73e8;">${d.specialty}</div>
                </div>
                <div class="patient-body">
                    <p><strong>ტელეფონი:</strong> ${d.phone || "N/A"}</p>
                    <p><strong>ელ-ფოსტა:</strong> ${d.email || "N/A"}</p>
                </div>
                <div class="patient-footer" style="display: flex; gap: 10px;">
                    <button class="edit-btn" style="flex: 1; background-color: #ff9800; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">რედაქტირება</button>
                    <button class="delete-btn" style="flex: 1; background-color: #f44336; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">წაშლა</button>
                </div>
            `;
            
            // Attach Event Listeners
            const editBtn = card.querySelector(".edit-btn");
            editBtn.addEventListener("click", () => openEditDoctorModal(d.id));

            const deleteBtn = card.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", () => deleteDoctor(d.id));

            doctorsListContainer.appendChild(card);
        });
    }

    function seedDoctors() {
        if (!localStorage.getItem("doctors")) {
            const sampleDoctors = [
                {
                    firstName: "ჯონ", lastName: "დოუ", id: "DOC001", specialty: "კარდიოლოგია",
                    phone: "599000000", email: "john@clinic.ge", createdAt: new Date().toISOString()
                },
                {
                    firstName: "ჯეინ", lastName: "სმიტი", id: "DOC002", specialty: "პედიატრია",
                    phone: "577000000", email: "jane@clinic.ge", createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem("doctors", JSON.stringify(sampleDoctors));
        }
    }
});
