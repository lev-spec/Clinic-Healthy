document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("login_form");
    const result = document.getElementById("result");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) {
                result.style.color = "red";
                result.innerText = "გთხოვთ შეავსოთ ყველა ველი";
                return;
            }

            // Hardcoded Admin Credentials
            if (username === "levan_shiukashvili" && password === "levan_shiukashvili01852013521") {
                const adminUser = {
                    role: "admin",
                    firstName: "ლევან",
                    lastName: "შიუკაშვილი",
                    username: "levan_shiukashvili"
                };
                localStorage.setItem("currentUser", JSON.stringify(adminUser));
                window.location.href = "dashboard.html";
                return;
            }

            // Check Doctors from LocalStorage
            const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
            // Find doctor with matching credentials
            const foundDoctor = doctors.find(d => d.username === username && d.password === password);

            if (foundDoctor) {
                const user = {
                    role: "doctor",
                    firstName: foundDoctor.firstName,
                    lastName: foundDoctor.lastName,
                    username: foundDoctor.username,
                    id: foundDoctor.id
                };
                localStorage.setItem("currentUser", JSON.stringify(user));
                window.location.href = "dashboard.html";
                return;
            }

            result.style.color = "red";
            result.innerText = "არასწორი მომხმარებელი ან პაროლი";
        });
    }
});
