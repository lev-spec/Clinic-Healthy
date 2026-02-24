document.addEventListener("DOMContentLoaded", function () {
    const doctorsListContainer = document.getElementById("doctors-list-container");
    const addDoctorBtn = document.getElementById("add-doctor-btn");
    const doctorModal = document.getElementById("doctor-modal");
    const closeDoctorModalBtn = document.querySelector(".close-modal");
    const doctorForm = document.getElementById("doctor-form");
    const searchInput = document.getElementById("search-doctor");

    // --- Role Check ---
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const isAdmin = currentUser && currentUser.role === 'admin';

    // Seed Data if needed
    seedDoctors();
    renderDoctors();

    // --- Modal Logic ---
    if (addDoctorBtn) {
        if (!isAdmin) {
            addDoctorBtn.style.display = 'none';
        } else {
            addDoctorBtn.addEventListener("click", () => {
                document.querySelector("#doctor-modal h2").textContent = "ექიმის დამატება";
                document.querySelector("#doctor-form .submit-btn").textContent = "შენახვა";
                document.getElementById("doctor-edit-id").value = "";
                doctorForm.reset();
                doctorModal.style.display = "block";
                document.body.style.overflow = "hidden";
            });
        }
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
    if (doctorForm && isAdmin) {
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
                username: document.getElementById("docUsername").value,
                password: document.getElementById("docPassword").value,
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
                // Check if username exists
                if (doctors.some(d => d.username === newDoctor.username)) {
                     alert("ექიმი ამ მომხმარებლის სახელით უკვე არსებობს.");
                     return;
                }

                doctors.push(newDoctor);
                localStorage.setItem("doctors", JSON.stringify(doctors));
                alert("ექიმი წარმატებით დაემატა! ახლა მას შეუძლია ავტორიზაცია.");
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
        if (!isAdmin) return;
        if (confirm("დარწმუნებული ხართ, რომ გსურთ ამ ექიმის წაშლა?")) {
            let doctors = JSON.parse(localStorage.getItem("doctors")) || [];
            doctors = doctors.filter(d => d.id !== id);
            localStorage.setItem("doctors", JSON.stringify(doctors));
            renderDoctors(searchInput ? searchInput.value : "");
        }
    }

    // --- Edit Global Helper ---
    window.openEditDoctorModal = function(id) {
        if (!isAdmin) return;
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
            document.getElementById("docUsername").value = doctor.username || "";
            document.getElementById("docPassword").value = doctor.password || "";

            doctorModal.style.display = "block";
            document.body.style.overflow = "hidden";
        }
    }

    // --- Details Global Helper ---
    window.showDoctorDetails = function(id) {
        const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
        const doctor = doctors.find(d => d.id === id);
        if(!doctor) return;
        
        let content = `
            <div style="line-height: 1.6;">
                <p><strong>სახელი გვარი:</strong> ${doctor.firstName} ${doctor.lastName}</p>
                <p><strong>ID:</strong> ${doctor.id}</p>
                <p><strong>სპეციალობა:</strong> ${doctor.specialty}</p>
                <p><strong>ტელეფონი:</strong> ${doctor.phone || "N/A"}</p>
                <p><strong>ელ-ფოსტა:</strong> ${doctor.email || "N/A"}</p>
            </div>
        `;
        
        if (isAdmin) {
            content += `
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">
                <div style="background: #f9f9f9; padding: 10px; border-radius: 4px;">
                    <p><strong>მომხმარებელი:</strong> ${doctor.username || "N/A"}</p>
                    <p><strong>პაროლი:</strong> ${doctor.password || "N/A"}</p>
                </div>
            `;
        }
        
        // Use generic modal if available (defined in dashboard.js)
        if (window.showCustomModal) {
            window.showCustomModal("ექიმის დეტალები", content);
        } else {
            alert("დეტალები:\n" + content.replace(/<[^>]*>?/gm, ' '));
        }
    }

    function renderDoctors(searchTerm = "") {
        const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
        doctorsListContainer.innerHTML = "";

        if (doctors.length === 0) {
            doctorsListContainer.innerHTML = '<div class="no-data">ექიმები არ მოიძებნა.</div>';
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
            
            let buttonsHtml = '';
            if (isAdmin) {
                buttonsHtml = `
                    <button class="details-btn" style="flex: 1; background-color: #2196f3; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">დეტალები</button>
                    <button class="edit-btn" style="flex: 1; background-color: #ff9800; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">რედაქტირება</button>
                    <button class="delete-btn" style="flex: 1; background-color: #f44336; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">წაშლა</button>
                `;
            } else {
                buttonsHtml = `
                    <button class="details-btn" style="flex: 1; background-color: #2196f3; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">დეტალები</button>
                `;
            }

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
                    ${buttonsHtml}
                </div>
            `;
            
            // Attach Event Listeners
            const detailsBtn = card.querySelector(".details-btn");
            if(detailsBtn) detailsBtn.addEventListener("click", () => showDoctorDetails(d.id));

            if (isAdmin) {
                const editBtn = card.querySelector(".edit-btn");
                if(editBtn) editBtn.addEventListener("click", () => openEditDoctorModal(d.id));

                const deleteBtn = card.querySelector(".delete-btn");
                if(deleteBtn) deleteBtn.addEventListener("click", () => deleteDoctor(d.id));
            }

            doctorsListContainer.appendChild(card);
        });
    }

    function seedDoctors() {
        if (!localStorage.getItem("doctors")) {
            const sampleDoctors = [
                {
                    firstName: "ნინო", lastName: "ბერიძე", id: "DOC001", specialty: "კარდიოლოგია",
                    phone: "599111222", email: "nino@clinic.ge", username: "nino_beridze", password: "password123", createdAt: new Date().toISOString()
                },
                {
                    firstName: "გიორგი", lastName: "მაისურაძე", id: "DOC002", specialty: "პედიატრია",
                    phone: "577333444", email: "giorgi@clinic.ge", username: "giorgi_maisuradze", password: "password123", createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem("doctors", JSON.stringify(sampleDoctors));
        }
    }
});
