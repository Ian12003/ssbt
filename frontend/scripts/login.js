document.addEventListener("DOMContentLoaded", () => {
    const showLoginBtn = document.getElementById("showLogin");
    const showSignupBtn = document.getElementById("showSignup");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    // Toggle between Login and Signup forms
    showLoginBtn.addEventListener("click", () => {
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
    });

    showSignupBtn.addEventListener("click", () => {
        signupForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
    });

    // Handle Admin Login
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = loginForm.querySelector("input[type='email']").value;
        const password = loginForm.querySelector("input[type='password']").value;

        const response = await fetch("http://localhost:5000/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token); // Store token
            alert("Login successful!");
            window.location.href = "admin-dashboard.html"; // Redirect to dashboard
        } else {
            alert(data.message || "Unauthorized. Please sign up.");
        }
    });

    // Handle Admin Signup
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = signupForm.querySelector("input[placeholder='Full Name']").value;
        const email = signupForm.querySelector("input[placeholder='Email']").value;
        const password = signupForm.querySelector("input[placeholder='Password']").value;

        const response = await fetch("http://localhost:5000/api/admin/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Signup successful! Please log in.");
        } else {
            alert(data.message || "Signup failed.");
        }
    });
});
