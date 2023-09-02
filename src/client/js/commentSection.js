import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

//퍼그와 동일하게 생성되는 댓글
const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";

  const avatar = document.createElement("img");
  avatar.className = "video__comment-avatar";
  avatar.src = currentUser.avatarUrl;
  avatar.alt = "commenter's avatar";

  const commentContent = document.createElement("div");
  commentContent.className = "video__comment-content";

  const commentHeader = document.createElement("div");
  commentHeader.className = "video__comment-header";

  const usernameSpan = document.createElement("span");
  usernameSpan.className = "video__comment-username";
  usernameSpan.innerText = currentUser.name;

  const deleteCommentBtn = document.createElement("span");
  deleteCommentBtn.className = "deleteCommentBtn";
  deleteCommentBtn.dataset.id = id;
  deleteCommentBtn.innerText = "❌";

  const commentText = document.createElement("p");
  commentText.className = "video__comment-text";
  commentText.innerText = ` ${text}`;

  commentContent.appendChild(commentHeader);
  commentContent.appendChild(commentText);

  newComment.appendChild(avatar);
  newComment.appendChild(commentContent);
  commentHeader.appendChild(usernameSpan);
  commentHeader.appendChild(deleteCommentBtn);

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

  if (response.status === 204) {
    commentElement.remove();
  }
};

document.addEventListener("click", async (event) => {
  if (event.target.matches(".deleteCommentBtn")) {
    await handleDelete(event);
  }
});
