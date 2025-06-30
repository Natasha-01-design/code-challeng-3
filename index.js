
const API_URL = "http://localhost:3000/posts";

const postListDiv = document.getElementById("post-list");
const postDetailDiv = document.getElementById("post-detail");
const newPostForm = document.getElementById("new-post-form");
const editPostForm = document.getElementById("edit-post-form");
const cancelEditBtn = document.getElementById("cancel-edit");

let selectedPostId = null;

// Fetch and render all posts
function fetchPosts() {
  fetch(API_URL)
    .then((res) => res.json())
    .then(renderPostList)
    .catch((err) => console.error("Failed to load posts", err));
}

// Render posts
function renderPostList(posts) {
  postListDiv.innerHTML = "<h2>All Posts</h2>";
  const list = document.createElement("ul");

  posts.forEach((post) => {
    const li = document.createElement("li");
    li.textContent = `${post.title} (by ${post.author})`;
    li.style.cursor = "pointer";
    li.onclick = () => showPostDetail(post);
    list.appendChild(li);
  });

  postListDiv.appendChild(list);
}

// Show post details
function showPostDetail(post) {
  selectedPostId = post.id;
  postDetailDiv.innerHTML = `
    <h2>${post.title}</h2>
    <p><strong>Author:</strong> ${post.author}</p>
    ${post.image ? `<img src="${post.image}" alt="Post image" style="max-width:200px;">` : ""}
    <p>${post.content}</p>
    <button id="edit-btn">Edit</button>
  `;
  document.getElementById("edit-btn").onclick = () => startEditing(post);
}

// Submit new post
newPostForm.onsubmit = function (e) {
  e.preventDefault();
  const formData = new FormData(newPostForm);
  const post = {
    title: formData.get("title"),
    author: formData.get("author"),
    image: formData.get("image"),
    content: formData.get("content"),
  };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
    .then(() => {
      newPostForm.reset();
      fetchPosts();
      postDetailDiv.innerHTML = "<h2>Select a post to see details</h2>";
    })
    .catch((err) => console.error("Failed to add post", err));
};

// Start editing
function startEditing(post) {
  editPostForm.classList.remove("hidden");
  newPostForm.classList.add("hidden");

  editPostForm.querySelector('[name="title"]').value = post.title;
  editPostForm.querySelector('[name="author"]').value = post.author;
  editPostForm.querySelector('[name="image"]').value = post.image;
  editPostForm.querySelector('[name="content"]').value = post.content;

  selectedPostId = post.id;
}

// Submit edit
editPostForm.onsubmit = function (e) {
  e.preventDefault();
  if (!selectedPostId) return;

  const updatedPost = {
    title: editPostForm.querySelector('[name="title"]').value,
    author: editPostForm.querySelector('[name="author"]').value,
    image: editPostForm.querySelector('[name="image"]').value,
    content: editPostForm.querySelector('[name="content"]').value,
  };

  fetch(`${API_URL}/${selectedPostId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPost),
  })
    .then(() => {
      editPostForm.reset();
      editPostForm.classList.add("hidden");
      newPostForm.classList.remove("hidden");
      fetchPosts();
      postDetailDiv.innerHTML = "<h2>Post updated. Select one to see details.</h2>";
    })
    .catch((err) => console.error("Failed to update post", err));
};

// Cancel editing
cancelEditBtn.onclick = () => {
  editPostForm.classList.add("hidden");
  newPostForm.classList.remove("hidden");
  editPostForm.reset();
};

// Initial load
fetchPosts();
