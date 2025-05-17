document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch('http://localhost:5000/api/students');
        const students = await res.json();

        const container = document.getElementById('studentCards');

        // Group by class
        const classGroups = {};
        students.forEach(student => {
            if (!classGroups[student.class]) {
                classGroups[student.class] = [];
            }
            classGroups[student.class].push(student);
        });

        for (const className in classGroups) {
            const classRow = document.createElement('div');
            classRow.className = 'class-row';

            const header = document.createElement('div');
            header.className = 'class-header';
            header.textContent = `Class ${className}`;
            header.addEventListener('click', () => {
                studentRow.classList.toggle('visible');
            });
            

            const studentRow = document.createElement('div');
            studentRow.className = 'student-row';

            classGroups[className].forEach(student => {
                const card = document.createElement('div');
                card.className = 'student-card';
                card.innerHTML = `
                    <h3>${student.name}</h3>
                    <p><strong>Roll No:</strong> ${student.roll_no}</p>
                    <p><strong>Class:</strong> ${student.class}</p>
                    <p><strong>Parent Contact:</strong> ${student.contact}</p>
                `;
                studentRow.appendChild(card);
            });

            classRow.appendChild(header);
            classRow.appendChild(studentRow);
            container.appendChild(classRow);
        }

    } catch (err) {
        console.error('Failed to load students:', err);
    }
});
