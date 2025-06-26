document.addEventListener("DOMContentLoaded", main);
<link rel="stylesheet" href="css/styles.css" />


function main() {
  displayPosts();
  addNewPostListener();
}
function displayPosts() {
  fetch("http://localhost:3000/posts")
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";
      posts.forEach(post => {
        const div = document.createElement("div");
        div.textContent = post.title;
        div.addEventListener("click", () => handlePostClick(post.id));
        postList.appendChild(div);
      });
    });
}
function handlePostClick(id) {
  fetch(`http://localhost:3000/posts/${id}`)
    .then(res => res.json())
    .then(post => {
      const detail = document.getElementById("post-detail");
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <p><strong>Author:</strong> ${post.author}</p>
        <img src="${post.image}" alt="Post image" />
        <button onclick="showEditForm(${post.id})">Edit</button>
        <button onclick="deletePost(${post.id})">Delete</button>
      `;
    });
}
function addNewPostListener() {
  document.getElementById("new-post-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    const author = e.target.author.value;

    const newPost = { title, content, author, image: "https://via.placeholder.com/150" };

    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        e.target.reset();
        displayPosts(); // Refresh the list
      });
  });
}
let first = true;
posts.forEach(post => {
  // Existing div logic
  if (first) {
    handlePostClick(post.id);
    first = false;
  }
});
function showEditForm(id) {
  fetch(`http://localhost:3000/posts/${id}`)
    .then(res => res.json())
    .then(post => {
      const form = document.getElementById("edit-post-form");
      form.classList.remove("hidden");
      document.getElementById("edit-title").value = post.title;
      document.getElementById("edit-content").value = post.content;

      form.onsubmit = (e) => {
        e.preventDefault();
        const updatedPost = {
          title: document.getElementById("edit-title").value,
          content: document.getElementById("edit-content").value
        };

        fetch(`http://localhost:3000/posts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPost)
        })
          .then(() => {
            form.classList.add("hidden");
            displayPosts();
            handlePostClick(id);
          });
      };

      document.getElementById("cancel-edit").onclick = () => {
        form.classList.add("hidden");
      };
    });
}
function deletePost(id) {
  fetch(`http://localhost:3000/posts/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      displayPosts();
      document.getElementById("post-detail").innerHTML = "<p>Select a post to view its details</p>";
    });
}
