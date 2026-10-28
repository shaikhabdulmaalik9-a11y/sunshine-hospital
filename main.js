// ============================================
// SUNSHINE MULTI-SPECIALITY CENTER
// Main JavaScript File
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Sunshine Hospital website loaded successfully!");

    // --------------------------------------------
    // 1. HIGHLIGHT THE CURRENT NAVIGATION LINK
    // --------------------------------------------

    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".navbar nav a").forEach(function (link) {

        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }

    });


    // --------------------------------------------
    // 2. MOBILE NAVIGATION MENU
    // --------------------------------------------

    const nav = document.querySelector(".navbar nav");
    const navbar = document.querySelector(".navbar");

    if (nav && navbar) {

        let menuButton = document.querySelector(".menu-toggle");

        if (!menuButton) {

            menuButton = document.createElement("button");
            menuButton.className = "menu-toggle";
            menuButton.type = "button";
            menuButton.textContent = "☰";
            menuButton.setAttribute("aria-label", "Toggle navigation menu");

            navbar.insertBefore(menuButton, nav);

        }

        menuButton.addEventListener("click", function () {
            nav.classList.toggle("nav-open");

            const isOpen = nav.classList.contains("nav-open");
            menuButton.setAttribute("aria-expanded", isOpen);
            menuButton.textContent = isOpen ? "✕" : "☰";
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("nav-open");
                menuButton.textContent = "☰";
                menuButton.setAttribute("aria-expanded", "false");
            });
        });

    }


    // --------------------------------------------
    // 3. DOCTOR SEARCH
    // Works if doctors.html has a search input
    // with id="doctorSearch"
    // --------------------------------------------

    const doctorSearch = document.getElementById("doctorSearch");
    const doctorCards = document.querySelectorAll(".doctor-card");

    if (doctorSearch && doctorCards.length > 0) {

        doctorSearch.addEventListener("input", function () {

            const searchText = doctorSearch.value.toLowerCase().trim();

            doctorCards.forEach(function (card) {

                const cardText = card.textContent.toLowerCase();

                card.style.display = cardText.includes(searchText)
                    ? ""
                    : "none";

            });

        });

    }


    // --------------------------------------------
    // 4. DEPARTMENT SEARCH
    // Works if departments.html has an input
    // with id="departmentSearch"
    // --------------------------------------------

    const departmentSearch = document.getElementById("departmentSearch");
    const departmentCards = document.querySelectorAll(".department-card");

    if (departmentSearch && departmentCards.length > 0) {

        departmentSearch.addEventListener("input", function () {

            const searchText = departmentSearch.value.toLowerCase().trim();

            departmentCards.forEach(function (card) {

                const cardText = card.textContent.toLowerCase();

                card.style.display = cardText.includes(searchText)
                    ? ""
                    : "none";

            });

        });

    }


    // --------------------------------------------
// --------------------------------------------
// 5. APPOINTMENT FORM AND MONGODB CONNECTION
// --------------------------------------------

const appointmentForm = document.getElementById("appointmentForm");

if (appointmentForm) {
    const dateInput = appointmentForm.querySelector('[name="date"]');

    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        dateInput.min = `${year}-${month}-${day}`;
    }

    appointmentForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!appointmentForm.checkValidity()) {
            appointmentForm.reportValidity();
            return;
        }

        const formData = {
            name: appointmentForm.querySelector('[name="name"]').value.trim(),
            email: appointmentForm.querySelector('[name="email"]').value.trim(),
            phone: appointmentForm.querySelector('[name="phone"]').value.trim(),
            department: appointmentForm.querySelector('[name="department"]').value,
            date: appointmentForm.querySelector('[name="date"]').value,
            message: appointmentForm.querySelector('[name="message"]').value.trim()
        };

        if (formData.name.length < 2) {
            alert("Please enter your full name.");
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone)) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        const selectedDate = new Date(formData.date + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert("Please select today or a future date.");
            return;
        }

        const submitButton = appointmentForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = "Booking...";

        try {
            const response = await fetch("http://localhost:3000/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });


         const responseText = await response.text();
console.log("Appointment API response:", response.status, responseText);

let result;

try {
    result = JSON.parse(responseText);
} catch (error) {
    throw new Error(
        "Server se JSON ke badle HTML mila. Backend Terminal check karo."
    );
}   
if (!response.ok) {
    throw new Error(result.message || "Appointment booking failed.");
}

alert("✅ Appointment Booked Successfully!");
appointmentForm.reset();

} catch (error) {
    console.error("Appointment booking error:", error);
    alert(error.message || "Booking failed.");
} finally {
    submitButton.disabled = false;
    submitButton.textContent = "Book Appointment";
}
});
}
    // --------------------------------------------
    // 6. CONTACT FORM VALIDATION
    // --------------------------------------------

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            alert(
                "Your contact form passed validation. " +
                "Message sending is not connected to the server yet."
            );

        });

    }


    // --------------------------------------------
    // 7. FOOTER CURRENT YEAR
    // Works if an element has id="currentYear"
    // --------------------------------------------

    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

});

// Load doctors from Sunshine Hospital backend
async function loadDoctorsFromAPI() {
    const doctorsContainer = document.querySelector(
        "#doctors-container, .doctors-container, .doctors-grid"
    );

    if (!doctorsContainer) {
        console.log("Doctors container nahi mila.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/doctors");

        if (!response.ok) {
            throw new Error("Doctors load nahi ho paaye.");
        }

        const doctors = await response.json();

        if (doctors.length === 0) {
            doctorsContainer.innerHTML = "<p>Abhi doctors ki details available nahi hain.</p>";
            return;
        }

        doctorsContainer.innerHTML = doctors.map(doctor => `
            <div class="doctor-card">
                <h3>${doctor.name}</h3>
                <p>${doctor.specialization}</p>
            </div>
        `).join("");

    } catch (error) {
        console.error("Doctors API error:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadDoctorsFromAPI);