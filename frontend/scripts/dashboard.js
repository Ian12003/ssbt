document.getElementById("logoutButton").addEventListener("click", function () {
    localStorage.clear(); // Remove stored data
    window.location.href = "login.html"; // Redirect to login page

    // Prevent going back to the dashboard after logout
    history.pushState(null, null, "login.html");
    window.addEventListener("popstate", function () {
        history.pushState(null, null, "login.html");
    });
});

document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    if (!token) {
        // If no token is found, redirect to the login page
        window.location.href = "login.html";
    }

    try {
        const res = await fetch('http://localhost:5000/api/students');
        const students = await res.json();

        const container = document.getElementById('studentCards');
        students.forEach(student => {
            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `
                <h3>${student.name}</h3>
                <p><strong>Roll No:</strong> ${student.roll_no}</p>
                <p><strong>Class:</strong> ${student.class}</p>
                <p><strong>Parent Contact:</strong> ${student.contact}</p>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error('Failed to load students:', err);
    }
});
