document.addEventListener("DOMContentLoaded", function () {
    const servicesListContainer = document.getElementById("services-list-container");
    const addServiceBtn = document.getElementById("add-service-btn");
    const serviceModal = document.getElementById("service-modal");
    const closeServiceModalBtn = document.querySelector(".close-modal");
    const serviceForm = document.getElementById("service-form");
    const searchInput = document.getElementById("search-service");
    const performingDoctorSelect = document.getElementById("performingDoctor");

    // Populate Doctors Dropdown
    populateDoctors();

    // Load Services
    renderServices();

    // --- Modal Logic ---
    if (addServiceBtn) {
        addServiceBtn.addEventListener("click", () => {
            document.querySelector("#service-modal h2").textContent = "ახალი სერვისის დამატება";
            document.querySelector("#service-form .submit-btn").textContent = "შენახვა";
            document.getElementById("service-edit-id").value = "";
            serviceForm.reset();
            serviceModal.style.display = "block";
            document.body.style.overflow = "hidden";
        });
    }

    if (closeServiceModalBtn) {
        closeServiceModalBtn.addEventListener("click", () => {
            serviceModal.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === serviceModal) {
            serviceModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    // --- Form Submission ---
    if (serviceForm) {
        serviceForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const editId = document.getElementById("service-edit-id").value;
            const newService = {
                id: editId || Date.now().toString(),
                name: document.getElementById("serviceName").value,
                code: document.getElementById("serviceCode").value,
                cptCode: document.getElementById("cptCode").value,
                category: document.getElementById("category").value,
                price: document.getElementById("price").value,
                insuranceCompany: document.getElementById("insuranceCompany").value,
                duration: document.getElementById("duration").value,
                performingDoctor: document.getElementById("performingDoctor").value,
                serviceType: document.getElementById("serviceType").value,
                formIV100: document.getElementById("formIV100").checked,
                createdAt: new Date().toISOString()
            };

            let services = JSON.parse(localStorage.getItem("services")) || [];

            if (editId) {
                const index = services.findIndex(s => s.id === editId);
                if (index !== -1) {
                    services[index] = newService;
                    localStorage.setItem("services", JSON.stringify(services));
                    alert("სერვისი განახლდა!");
                }
            } else {
                services.push(newService);
                localStorage.setItem("services", JSON.stringify(services));
                alert("სერვისი წარმატებით დაემატა!");
            }

            serviceModal.style.display = "none";
            document.body.style.overflow = "auto";
            renderServices();
        });
    }

    // --- Search ---
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderServices(e.target.value);
        });
    }

    // --- Global Helpers ---
    window.deleteService = function(id) {
        if (confirm("დარწმუნებული ხართ, რომ გსურთ ამ სერვისის წაშლა?")) {
            let services = JSON.parse(localStorage.getItem("services")) || [];
            services = services.filter(s => s.id !== id);
            localStorage.setItem("services", JSON.stringify(services));
            renderServices(searchInput ? searchInput.value : "");
        }
    }

    window.openEditServiceModal = function(id) {
        const services = JSON.parse(localStorage.getItem("services")) || [];
        const service = services.find(s => s.id === id);
        
        if (service) {
            document.querySelector("#service-modal h2").textContent = "სერვისის რედაქტირება";
            document.querySelector("#service-form .submit-btn").textContent = "განახლება";
            document.getElementById("service-edit-id").value = service.id;

            document.getElementById("serviceName").value = service.name;
            document.getElementById("serviceCode").value = service.code;
            document.getElementById("cptCode").value = service.cptCode;
            document.getElementById("category").value = service.category;
            document.getElementById("price").value = service.price;
            document.getElementById("insuranceCompany").value = service.insuranceCompany;
            document.getElementById("duration").value = service.duration;
            document.getElementById("performingDoctor").value = service.performingDoctor;
            document.getElementById("serviceType").value = service.serviceType;
            document.getElementById("formIV100").checked = service.formIV100;

            serviceModal.style.display = "block";
            document.body.style.overflow = "hidden";
        }
    }

    function renderServices(searchTerm = "") {
        const services = JSON.parse(localStorage.getItem("services")) || [];
        servicesListContainer.innerHTML = "";

        if (services.length === 0) {
            servicesListContainer.innerHTML = '<div class="no-data">სერვისები არ მოიძებნა. დააჭირეთ "სერვისის დამატებას".</div>';
            return;
        }

        const filtered = services.filter(s => 
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            s.code.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filtered.length === 0) {
            servicesListContainer.innerHTML = '<div class="no-data">შესაბამისი სერვისები არ მოიძებნა.</div>';
            return;
        }

        filtered.forEach(s => {
            const card = document.createElement("div");
            card.className = "patient-card"; // Reuse patient card style
            
            card.innerHTML = `
                <div class="patient-header">
                    <div class="patient-avatar" style="background-color: #e0f2f1; color: #00695c;">
                        <i class="fa-solid fa-file-medical"></i>
                    </div>
                    <div class="patient-info-main">
                        <h3>${s.name}</h3>
                        <span class="patient-id">Code: ${s.code}</span>
                    </div>
                    <div class="patient-status" style="background-color: #009688;">${s.price} GEL</div>
                </div>
                <div class="patient-body">
                    <p><strong>კატეგორია:</strong> ${s.category || "N/A"}</p>
                    <p><strong>ტიპი:</strong> ${s.serviceType}</p>
                    <p><strong>ექიმი:</strong> ${getDoctorName(s.performingDoctor)}</p>
                </div>
                <div class="patient-footer" style="display: flex; gap: 10px;">
                    <button class="edit-btn" style="flex: 1; background-color: #ff9800; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">რედაქტირება</button>
                    <button class="delete-btn" style="flex: 1; background-color: #f44336; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">წაშლა</button>
                </div>
            `;
            
            // Attach Event Listeners
            const editBtn = card.querySelector(".edit-btn");
            editBtn.addEventListener("click", () => openEditServiceModal(s.id));

            const deleteBtn = card.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", () => deleteService(s.id));

            servicesListContainer.appendChild(card);
        });
    }

    function populateDoctors() {
        if (!performingDoctorSelect) return;
        const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
        doctors.forEach(doc => {
            const option = document.createElement("option");
            option.value = doc.id;
            option.textContent = `${doc.firstName} ${doc.lastName} (${doc.specialty})`;
            performingDoctorSelect.appendChild(option);
        });
    }

    function getDoctorName(id) {
        if (!id) return "N/A";
        const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
        const doc = doctors.find(d => d.id === id);
        return doc ? `${doc.firstName} ${doc.lastName}` : id;
    }
});
