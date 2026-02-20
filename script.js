document.addEventListener("DOMContentLoaded", function () {
    const sendBtn = document.getElementById("send_code");
    const form = document.getElementById("login_form");
    const result = document.getElementById("result");

    // SMS კოდის გაგზავნის იმიტაცია
    sendBtn.addEventListener("click", function () {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const phone = document.getElementById("phone_number").value.trim();

        if (!username || !password || !phone) {
            result.style.color = "red";
            result.innerText = "Username, password and phone are required!";
            return;
        }

        // შემთხვევითი 6-ნიშნა კოდი
        const smsCode = Math.floor(100000 + Math.random() * 900000).toString();

        // ვინახავთ დემო კოდს
        sessionStorage.setItem("demo_sms_code", smsCode);
        sessionStorage.setItem("demo_phone", phone);

        // 👇 ALERT-ში გამოჩენა
        alert("DEMO SMS Code: " + smsCode);

        result.style.color = "blue";
        result.innerText = "SMS code sent!";
    });

    // კოდის შემოწმება
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const phone = document.getElementById("phone_number").value.trim();
        const code = document.getElementById("code").value.trim();

        const savedCode = sessionStorage.getItem("demo_sms_code");
        const savedPhone = sessionStorage.getItem("demo_phone");

        if (!savedCode) {
            result.style.color = "red";
            result.innerText = "Please send SMS code first!";
            return;
        }

        if (phone === savedPhone && code === savedCode) {
            result.style.color = "green";
            result.innerText = "Login successful ✅";
            window.location.href = "dashboard.html";
        } else {
            result.style.color = "red";
            result.innerText = "Invalid verification code ❌";
        }
    });
});
