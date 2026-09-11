
// =========================
// SHARED MENU
// =========================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");

        if (navLinks.classList.contains("active")) {
            menuToggle.textContent = "✖";
        } else {
            menuToggle.textContent = "☰";
        }
    });
}


// =========================
// REGISTER
// =========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    const fullName = document.getElementById("name");
    const email = document.getElementById("email");
    const passWord = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");

    const confirmPasswordError = document.getElementById("confirmPassError");

    const mailError = document.getElementById("emailError");

    const nameError = document.getElementById("fullNameError");

    const passError = document.getElementById("passwordError");

    const successMessage = document.getElementById("success-message");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = fullName.value.trim();
        const mail = email.value.trim();
        const password = passWord.value;
        const confirmPass = confirmPassword.value;

        let hasError = false;

        // Clear previous messages

        nameError.textContent = "";
        mailError.textContent = "";
        passError.textContent = "";
        confirmPasswordError.textContent = "";
        successMessage.textContent = "";

        // Validate name

        if (name === "") {
            nameError.textContent = "Please enter your fullname";
            hasError = true;
        }


        // Validate email

        if (mail === "") {
            mailError.textContent = "Please enter your email";
            hasError = true;
        }

        // Validate password

        if (password === "") {
            passError.textContent = "Please enter your password";
            hasError = true;
        }

        // Validate confirm password

        if (confirmPass === "") {
            confirmPasswordError.textContent = "Please confirm your password";

            hasError = true;

        } else if (password !== confirmPass) {
            confirmPasswordError.textContent = "Passwords do not match";

            hasError = true;
        }

        // Stop if there are errors

        if (hasError) {
            return;
        }

        // Create user

        const user = {
            name: name,
            email: mail,
            password: password
        };

        // Get existing users

        const storedUsers = localStorage.getItem("users");

        let users = [];

        if (storedUsers) {
            users = JSON.parse(storedUsers);
        }


        // Check if email already exists

        const emailExists = users.some(existingUser => existingUser.email === mail);

        if (emailExists) {
            mailError.textContent = "An account with this email already exists";

            return;
        }


        // Save new user

        users.push(user);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        // Success

        successMessage.textContent = "Account created successfully!";
        window.location.href = "login.html";
    });
}


// =========================
// LOGIN
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    const userEmail = document.getElementById("email");
    const userPassword = document.getElementById("password");

    const userEmailError = document.getElementById("emailErrors");

    const userPassError = document.getElementById("passwordErrors");

    const successLogin = document.getElementById("success-login");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = userEmail.value.trim();
        const password = userPassword.value;
        let hasErrors = false;

        // Clear previous messages

        userEmailError.textContent = "";
        userPassError.textContent = "";
        successLogin.textContent = "";

        // Validate email

        if (email === "") {
            userEmailError.textContent = "Please enter your email";

            hasErrors = true;
        }


        // Validate password

        if (password === "") {
            userPassError.textContent = "Please enter your password";

            hasErrors = true;
        }


        // Stop if there are errors

        if (hasErrors) {
            return;
        }


        // Get stored users

        const storedUsers = localStorage.getItem("users");

        let users = [];

        if (storedUsers) {
            users = JSON.parse(storedUsers);
        }


        // Find matching user

        const existingUser = users.find(existingUser =>existingUser.email === email &&
                existingUser.password === password
        );


        // Invalid login

        if (!existingUser) {
            userPassError.textContent = "Invalid email or password";

            return;
        }


        // Save current user

        localStorage.setItem("currentUser", JSON.stringify(existingUser)
        );

        // Success

        successLogin.textContent = "Login successful!";
        window.location.href = "dashboard.html";
    });
}


// =========================
// DASHBOARD ELEMENTS
// =========================

const dashboardUserName = document.getElementById("dashboardUserName");

const totalTasks = document.getElementById("totalTasks");

const completedTasksElement = document.getElementById("completedTasks");

const remainingTasks = document.getElementById("remainingTasks");

const tasksForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const pendingList = document.getElementById("pendingList");

const completedList = document.getElementById("completedList");

const pendingCount = document.getElementById("pendingCount");

const completedCount = document.getElementById("completedCount");

const emptyState = document.getElementById("emptyState");

const logoutBtn = document.getElementById("logoutBtn");

const userName = document.querySelector(".user-name");

const userMail = document.querySelector(".user-email");


// =========================
// DASHBOARD
// =========================

if (tasksForm) {

    const storedCurrentUser =
        localStorage.getItem("currentUser");

    // Protect dashboard

    if (!storedCurrentUser) {
        window.location.href = "login.html";

    } else {
        const currentUser = JSON.parse(storedCurrentUser);


        // Display user information

        userName.textContent = currentUser.name;

        userMail.textContent = currentUser.email;

        dashboardUserName.textContent = currentUser.name;


        // =========================
        // TASKS
        // =========================

        let tasks = [];

        const getTasks = localStorage.getItem("tasks");
        if (getTasks) {
            tasks = JSON.parse(getTasks);
        }


        // =========================
        // COMPLETE TASK
        // =========================

        function completeTask(taskId) {
            const task = tasks.find(task => task.id === taskId);
            if (task) {task.completed = true;
                localStorage.setItem( "tasks", JSON.stringify(tasks));
                renderTasks();
            }
        }


        // =========================
        // DELETE TASK
        // =========================

        function deleteTask(taskId) {

            tasks = tasks.filter(task => task.id !== taskId);
            localStorage.setItem("tasks", JSON.stringify(tasks));

            renderTasks();
        }


        // =========================
        // EDIT TASK
        // =========================

        function editTask(taskId) {

            const task = tasks.find(task => task.id === taskId);

            if (task) { const newText =
                    prompt("Edit your task:",task.text);


                if (newText !== null && newText.trim() !== "") {

                    task.text =newText.trim();
                    localStorage.setItem("tasks", JSON.stringify(tasks));

                    renderTasks();
                }
            }
        }


        // =========================
        // RENDER TASKS
        // =========================

        function renderTasks() {

            pendingList.innerHTML = "";
            completedList.innerHTML = "";

            // Separate tasks

            const pendingTaskList = tasks.filter(task => !task.completed);
            const completedTaskList =tasks.filter(task => task.completed);


            // =========================
            // PENDING TASKS
            // =========================

            pendingTaskList.forEach(task => {
                const li = document.createElement("li");
                li.classList.add("task-item");

                // Task content

                const content = document.createElement("div");
                content.classList.add("task-content");

                // Task text

                const text = document.createElement("span");
                text.textContent = task.text;
                text.classList.add("task-text");

                // Task time

                const time = document.createElement("small");

                time.textContent = new Date(task.id);

                time.classList.add("task-time");


                content.appendChild(text);
                content.appendChild(time);


                // =========================
                // ACTION BUTTONS
                // =========================

                const actions = document.createElement("div");

                actions.classList.add("task-actions");

                // Complete button

                const completeBtn = document.createElement("button");

                completeBtn.textContent ="Complete";

                completeBtn.addEventListener("click", function () {
                         completeTask(task.id);
                    }
                );


                // Edit button

                const editBtn = document.createElement("button");

                editBtn.textContent = "Edit";

                editBtn.addEventListener("click", function () {
                        editTask(task.id);
                    }
                );


                // Delete button

                const deleteBtn = document.createElement("button");

                deleteBtn.textContent = "Delete";

                deleteBtn.addEventListener("click", function () {
                        deleteTask(task.id);
                    }
                );


                // Add buttons

                actions.appendChild(completeBtn);

                actions.appendChild(editBtn);

                actions.appendChild(deleteBtn);


                // Add everything to task

                li.appendChild(content);
                li.appendChild(actions);

                pendingList.appendChild(li);

            });


            // =========================
            // COMPLETED TASKS
            // =========================

            completedTaskList.forEach(task => {

                const li = document.createElement("li");

                li.classList.add( "task-item");

                const text = document.createElement("span");

                text.textContent = task.text;

                text.classList.add("task-text");

                li.appendChild(text);

                completedList.appendChild(li);

            });


            // =========================
            // COUNTS
            // =========================

            totalTasks.textContent = tasks.length;

            completedTasksElement.textContent = completedTaskList.length;

            remainingTasks.textContent = pendingTaskList.length;

            pendingCount.textContent = pendingTaskList.length;

            completedCount.textContent = completedTaskList.length;


            // =========================
            // EMPTY STATE
            // =========================

            if (tasks.length === 0) {
                emptyState.style.display =
                    "block";

            } else {

                emptyState.style.display =
                    "none";
            }
        }


        // =========================
        // ADD TASK
        // =========================

        tasksForm.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();

                const taskText =
                    taskInput.value.trim();

                // Prevent empty task

                if (taskText === "") {
                    return;
                }

                // Create new task

                const newTask = {
                    id: Date.now(),
                    text: taskText,
                    completed: false
                };

                // Add task

                tasks.push(newTask);


                // Save tasks

                localStorage.setItem("tasks", JSON.stringify(tasks));


                // Clear input

                taskInput.value = "";

                // Update dashboard

                renderTasks();
            }
        );

        renderTasks();


        // =========================
        // LOGOUT
        // =========================

        logoutBtn.addEventListener("click", function () {
                localStorage.removeItem("currentUser");
                window.location.href = "login.html";
            }
        );
    }
}

        // =========================
        // FORGOT PASSWORD
        // =========================

        const forgotPassForm = document.getElementById("forgotPasswordForm");
const email = document.getElementById("email");
const newPassword = document.getElementById("newPassword");
const confirmPass = document.getElementById("confirmPassword");

const emailError = document.getElementById("emailError");
const newPasswordError = document.getElementById("newPasswordError");
const confirmPassError = document.getElementById("confirmPasswordError");
const resetSuccess = document.getElementById("resetSuccess");

if (forgotPassForm) {
    forgotPassForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const mail = email.value.trim();
        const newPass = newPassword.value.trim();
        const confirmNewPass = confirmPass.value.trim();

        let hasError = false;

        emailError.textContent = "";
        newPasswordError.textContent = "";
        confirmPassError.textContent = "";
        resetSuccess.textContent = "";

        // Validate email
        if (mail === "") {
            emailError.textContent = "Please enter your email";
            hasError = true;
        }

        // Validate new password
        if (newPass === "") {
            newPasswordError.textContent = "Please enter a new password";
            hasError = true;
        }

        // Validate confirm password
        if (confirmNewPass === "") {
            confirmPassError.textContent = "Please confirm your new password";
            hasError = true;
        } else if (newPass !== confirmNewPass) {
            confirmPassError.textContent = "Passwords do not match";
            hasError = true;
        }

        // Stop if there is a validation error
        if (hasError) {
            return;
        }

        // Get registered users from localStorage
        const storedUsers = localStorage.getItem("users");

        let users = [];

        if (storedUsers) {
            users = JSON.parse(storedUsers);
        }

        // Find the account with the entered email
        const existingUser = users.find(
            user => user.email === mail
        );

        // Check if the email exists
        if (!existingUser) {
            emailError.textContent = "No account found with this email";
            return;
        }

        // Update the user's password
        existingUser.password = newPass;

        // Save the updated users back to localStorage
        localStorage.setItem("users", JSON.stringify(users));

        // Show success message
        resetSuccess.textContent = "Password reset successfully!";

        // Return to login page
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    });
}