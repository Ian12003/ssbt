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

            const studentRow = document.createElement('div');
            studentRow.className = 'student-row';

            header.addEventListener('click', () => {
                studentRow.classList.toggle('visible');
            });

            classGroups[className].forEach(student => {
                const card = document.createElement('div');
                card.className = 'student-card';

                const lat = student.last_lat;
                const lon = student.last_lon;
                const mapsUrl = lat && lon
                    ? `https://www.google.co.in/maps/place/${encodeURIComponent(lat)}+${encodeURIComponent(lon)}`
                    : null;

                card.innerHTML = `
                    <p><strong>Roll No:</strong> ${student.roll_no}</p>
                    <p>Name: <span contenteditable="false">${student.name}</span></p>
                    <p>Class: <span contenteditable="false">${student.class}</span></p>
                    <p>Contact: <span contenteditable="false">${student.contact}</span></p>
                    <p>Parent Email: <span contenteditable="false">${student.parent_email}</span></p>
                    ${mapsUrl
                        ? `<p><strong>Last Location:</strong> <a href="${mapsUrl}" target="_blank">View on Map</a></p>`
                        : `<p><strong>Last Location:</strong> Not available</p>`}

                    <button class="edit-btn">Edit</button>
                    <button class="save-btn" style="display:none;">Save</button>
                    <button class="delete-btn" style="margin-left: 10px; background-color: red; color: white;">Delete</button>
                `;

                const spans = card.querySelectorAll('span');
                const editBtn = card.querySelector('.edit-btn');
                const saveBtn = card.querySelector('.save-btn');
                const deleteBtn = card.querySelector('.delete-btn');

                // Edit
                editBtn.addEventListener('click', () => {
                    spans.forEach(span => span.contentEditable = "true");
                    editBtn.style.display = 'none';
                    saveBtn.style.display = 'inline';
                });

                // Save
                saveBtn.addEventListener('click', async () => {
                    const updatedStudent = {
                        name: spans[0].innerText.trim(),
                        class: spans[1].innerText.trim(),
                        contact: spans[2].innerText.trim(),
                        parent_email: spans[3].innerText.trim()
                    };

                    const response = await fetch(`http://localhost:5000/api/update-student/${student.roll_no}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedStudent)
                    });

                    if (response.ok) {
                        alert('Student updated successfully!');
                    } else {
                        alert('Failed to update student.');
                    }

                    spans.forEach(span => span.contentEditable = "false");
                    editBtn.style.display = 'inline';
                    saveBtn.style.display = 'none';
                });

                // Delete
                deleteBtn.addEventListener('click', async () => {
                    const confirmDelete = confirm(`Are you sure you want to delete Roll No ${student.roll_no}?`);
                    if (!confirmDelete) return;

                    const response = await fetch(`http://localhost:5000/api/delete-student/${student.roll_no}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        alert('Student deleted successfully.');
                        card.remove(); // remove from UI
                    } else {
                        alert('Failed to delete student.');
                    }
                });

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
