// ===== REGISTER & LOGIN LOGIC =====
function register() {
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const error = document.getElementById("registerError");

  if (!username || !password) {
    error.textContent = "Please enter a username and password!";
    return;
  }

  // Check if username already exists
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const existingUser = users.find((u) => u.username === username);

  if (existingUser) {
    error.textContent = "Username already exists!";
    return;
  }

  // Save new user
  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));

  error.style.color = "#00f5d4";
  error.textContent = "Registration successful! You can now log in.";

  // Switch back to login tab automatically
  setTimeout(() => {
    showLogin();
    error.textContent = "";
  }, 1500);
}

function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const error = document.getElementById("loginError");

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const validUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (validUser) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUser", username);
    window.location.href = "dashboard.html";
  } else {
    error.textContent = "Invalid username or password!";
  }
}

// ===== TAB SWITCHING =====
function showLogin() {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginTab").classList.add("active");
  document.getElementById("registerTab").classList.remove("active");
}

function showRegister() {
  document.getElementById("registerForm").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerTab").classList.add("active");
  document.getElementById("loginTab").classList.remove("active");
}


// ===== DASHBOARD PAGE LOGIC =====
window.addEventListener("load", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const onDashboard = window.location.pathname.includes("dashboard.html");

  if (onDashboard && !isLoggedIn) {
    window.location.href = "index.html";
  }

  if (onDashboard) {
    applySavedTheme();
    displayPosts();
  }
});

function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "index.html";
}

// ===== ADD BLOG POST =====
function addPost() {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const imageFile = document.getElementById("imageUpload").files[0];

  if (!title || !content) {
    alert("Please fill in title and content!");
    return;
  }

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      savePost(title, content, e.target.result);
    };
    reader.readAsDataURL(imageFile);
  } else {
    savePost(title, content, null);
  }
}

function savePost(title, content, imageUrl) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const newPost = { id: Date.now(), title, content, imageUrl };
  posts.push(newPost);
  localStorage.setItem("posts", JSON.stringify(posts));

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  document.getElementById("imageUpload").value = "";

  displayPosts();
}

// ===== DISPLAY POSTS =====
function displayPosts() {
  const postsContainer = document.getElementById("posts");
  if (!postsContainer) return;

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");

  postsContainer.innerHTML = "";
  if (posts.length === 0) {
    postsContainer.innerHTML = "<p>No posts yet. Add one above!</p>";
    return;
  }

  posts.forEach((post) => {
    const div = document.createElement("div");
    div.classList.add("post");
    div.innerHTML = `
      ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Blog image" />` : ""}
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <button class="edit-btn" onclick="editPost(${post.id})">Edit</button>
      <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
    `;
    postsContainer.appendChild(div);
  });
}

// ===== EDIT POST =====
function editPost(id) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const post = posts.find((p) => p.id === id);
  if (!post) return;

  const newTitle = prompt("Edit title:", post.title);
  const newContent = prompt("Edit content:", post.content);

  if (newTitle && newContent) {
    post.title = newTitle;
    post.content = newContent;
    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts();
  }
}

// ===== DELETE POST =====
function deletePost(id) {
  let posts = JSON.parse(localStorage.getItem("posts") || "[]");
  posts = posts.filter((p) => p.id !== id);
  localStorage.setItem("posts", JSON.stringify(posts));
  displayPosts();
}

// ===== THEME TOGGLE =====
function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  document.getElementById("themeToggle").textContent = isLight ? "☀️" : "🌙";
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
    document.getElementById("themeToggle").textContent = "☀️";
  }
}
