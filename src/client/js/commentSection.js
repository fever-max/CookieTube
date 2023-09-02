import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

//퍼그와 동일하게 생성되는 댓글
const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";

  const icon = document.createElement("i");
  icon.className = "fas fa-comment";

  const span = document.createElement("span");
  span.innerText = ` ${text}`;

  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.style.float = "right";
  span2.style.alignItems = "center";

  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "" || text.trim() === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

const handleDelete = async (event) => {
  const commentElement = event.target.closest(".video__comment");
  const commentId = commentElement.dataset.id;

  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });

  if (response.status === 200) {
    commentElement.remove();
  }
};

document.addEventListener("click", async (event) => {
  if (event.target.matches(".video__comment span")) {
    await handleDelete(event);
    window.location.reload();
  }
});

const avatar = document.createElement("img");
avatar.className = "video__comment-avatar";
avatar.src = currentUser.avatarUrl;
avatar.alt = "commenter's avatar";
console.log(currentUser.avatarUrl);
