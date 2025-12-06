const url = "http://localhost:5000";
const loginForm = document.querySelector("#loginForm");
const errorMessage = document.querySelector("#errorMessage");
const loginButton = document.querySelector("#loginButton");
const togglePassword = document.querySelector("#togglePassword");
const passwordInput = document.querySelector("#password");

// Toggle password visibility
togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    
    const icon = togglePassword.querySelector("i");
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
});

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value;
    
    // Hide previous error
    errorMessage.classList.remove("show");
    errorMessage.textContent = "";
    
    // Validate input
    if (!username || !password) {
        showError("Please fill in all fields");
        return;
    }
    
    // Show loading state
    loginButton.disabled = true;
    loginButton.classList.add("loading");
    
    try {
        const response = await axios.post(`${url}/api/auth/login`, {
            username,
            password
        });
        
        if (response.data.success) {
            // Store token in localStorage
            localStorage.setItem("adminToken", response.data.token);
            localStorage.setItem("adminData", JSON.stringify(response.data.admin));
            
            // Redirect to admin dashboard
            window.location.href = "index.html";
        } else {
            showError(response.data.message || "Login failed");
        }
    } catch (error) {
        console.error("Login error:", error);
        
        if (error.response) {
            // Server responded with error
            showError(error.response.data.message || "Invalid credentials");
        } else if (error.request) {
            // Request made but no response
            showError("Unable to connect to server. Please check your connection.");
        } else {
            // Something else happened
            showError("An unexpected error occurred");
        }
    } finally {
        // Remove loading state
        loginButton.disabled = false;
        loginButton.classList.remove("loading");
    }
});

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorMessage.classList.remove("show");
    }, 5000);
}

// Check if already logged in
window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("adminToken");
    if (token) {
        // Verify token is still valid
        axios.get(`${url}/api/auth/verify`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            // Token is valid, redirect to dashboard
            window.location.href = "index.html";
        })
        .catch(() => {
            // Token is invalid, clear it
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminData");
        });
    }
});

