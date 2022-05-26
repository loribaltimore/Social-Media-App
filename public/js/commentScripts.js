let comment = document.querySelectorAll('.comment');
let commentLike = document.querySelectorAll('.comment-like');
let commentInput = document.querySelectorAll('.comment-input');
let allComments = document.querySelectorAll('.all-Comments');
let viewCommentsButton = document.querySelectorAll('.view-comments-btn');
let commentFormat = document.querySelectorAll('.comment-format')
let commentActionButton = document.querySelectorAll('.comment-action-button');
let commentActionDiv = document.querySelectorAll('.comment-action-div');
let commentDelete = document.querySelectorAll('.comment-delete');


for (let k = 0; k <= viewCommentsButton.length - 1; k++){
    viewCommentsButton[k].addEventListener('click', (event) => {
  
        if (allComments[k].classList.contains('visually-hidden')) {
            allComments[k].classList.remove('visually-hidden');
        } else {
            allComments[k].classList.add('visually-hidden');
        }
    })
}

for (let j = 0; j <= commentLike.length - 1; j++) {
    commentLike[j].addEventListener('click', async (event) => {
        let commentID = commentFormat[j].getAttribute('id');
        console.log('working')
        event.preventDefault();
        await axios.post(`http://localhost:3000/user/${activeUser_id}/comment/${commentID}/like`, {
        })
            .then(data => console.log(data))
            .catch(err => console.log(err));
    })
}
for (let l = 0; l < comment.length; l++){
    comment[l].addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log(event.path)
        await axios.post(`http://localhost:3000/user/${activeUser_id}/post/${comment[l].id}/comment`, {
            body: event.path[0][0].value,
            author: activeUser_id,
            post_id: comment[l].id
        })
            .then(data => console.log(data))
            .catch(err => console.log(err))
    });
}

if (commentActionButton) {
    for (let i = 0; i < commentActionButton.length; i++) {
        commentActionButton[i].addEventListener('click', async (event) => {
            commentActionDiv[i].classList.remove('visually-hidden');

        })
    }
};

 for (let div of commentActionDiv) {
     div.addEventListener('click', async (event) => {
         if (event.target.classList.contains('comment-delete')) {
             let post_id = event.path[2].getAttribute('id');
             let comment_id = event.path[3].getAttribute('id');
             let comment = document.getElementById(comment_id);
             comment.classList.add('visually-hidden');
             await axios.delete(`http://localhost:3000/user/${activeUser_id}/post/${post_id}/comment/${comment_id}`, {
             })
                 .then(data => { console.log(data); return data })
                 .catch(err => console.log(err));
             ///Work on what the user sees when they delete a comment. Comment should disapepar
             
         } else if (event.target.classList.contains('comment-edit')) {
             let post_id = event.path[2].getAttribute('id');
             let comment_id = event.path[3].getAttribute('id');
             let editForm = document.createElement('form');
             let editInput = document.createElement('input');
             let editBtn = document.createElement('button');
             editInput.setAttribute('name', 'body');
             editInput.classList.add('comment-edit-popup');
             editInput.appendChild(editBtn);
             editForm.appendChild(editInput);
             let parent = document.getElementById(comment_id);
             parent.appendChild(editForm);
             editForm.addEventListener('submit', async (event) => {
                 event.preventDefault();
                 await axios.put(`http://localhost:3000/user/${activeUser_id}/post/${post_id}/comment/${comment_id}`, {
                     body: event.path[0][0].value
                 })
                     .then(data => { console.log(data); return data })
                     .catch(err => console.log(err));
             })
         }
     });
}