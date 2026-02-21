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
            result.innerText = "მომხმარებლის სახელი, პაროლი და ტელეფონი სავალდებულოა!";
            return;
        }

        // შემთხვევითი 6-ნიშნა კოდი
        const smsCode = Math.floor(100000 + Math.random() * 900000).toString();

        // ვინახავთ დემო კოდს
        sessionStorage.setItem("demo_sms_code", smsCode);
        sessionStorage.setItem("demo_phone", phone);

        // 👇 ALERT-ში გამოჩენა
        alert("დემო SMS კოდი: " + smsCode);

        result.style.color = "blue";
        result.innerText = "SMS კოდი გაიგზავნა!";
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
            result.innerText = "ჯერ გააგზავნეთ SMS კოდი!";
            return;
        }

        if (phone === savedPhone && code === savedCode) {
            result.style.color = "green";
            result.innerText = "ავტორიზაცია წარმატებულია ✅";
            window.location.href = "dashboard.html";
        } else {
            result.style.color = "red";
            result.innerText = "არასწორი ვერიფიკაციის კოდი ❌";
        }
    });
});
