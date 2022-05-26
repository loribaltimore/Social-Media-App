
let likeCount = document.querySelectorAll('.like-count');
let postInput = document.querySelector('.post-input');
let postPopup = document.querySelector('.post-popup');
let postInputClose = document.querySelector('.post-input-close');
let likeForm = document.querySelectorAll('.like-form');
let likeInput = document.querySelectorAll('.like-input');
let likeBtn = document.querySelectorAll('.like-btn');
let postActionButton = document.querySelectorAll('.post-action-button');
let postActionDiv = document.querySelectorAll('.post-action-div')

if (postInput && postInputClose) {
    postInput.addEventListener('click', (event) => {
        postPopup.classList.remove('visually-hidden');
    });
    postInputClose.addEventListener('click', (event) => {
        postPopup.classList.add('visually-hidden');
    });
}

for (let i = 0; i < likeForm.length; i++){
    likeForm[i].onsubmit = async (event) => {
        event.preventDefault();
       await axios.post(`http://localhost:3000/user/${userId}/post/${likeInput[i].value}/like`, {
            post_id: likeInput[i].value
          })
          .then(function (response) {
            console.dir(response);
          })
          .catch(function (error) {
            console.log(error.response);
          });
    }
    likeBtn[i].addEventListener('click', function (event) {
        if (likeBtn[i].classList.contains('liked')) {
            likeBtn[i].classList.remove('liked');
            likeBtn[i].innerText = 'Like'
            
        } else {
            likeBtn[i].classList.add('liked');
            likeBtn[i].innerText = 'Liked';
        }
    });
};

if (postActionButton) {
    for (let i = 0; i < postActionButton.length; i++){
        postActionButton[i].addEventListener('click', async (event) => {
            postActionDiv[i].classList.remove('visually-hidden');
            postActionDiv[i].addEventListener('click', async(event) => {
                if (event.target.classList.contains('post-delete')) {
                    let post_id = event.path[5].getAttribute('id');
                    await axios.delete(`http://localhost:3000/user/${activeUser_id}/post/${post_id}`, {

                    })
                        .then(data => { console.log(data); return data })
                        .catch(err => console.log(err));
                } else if (event.target.classList.contains('post-edit')) {
                    let editPostForm = document.createElement('form');
                    let editPostInput = document.createElement('input');
                    editPostInput.setAttribute('name', 'text');
                    let editPostButton = document.createElement('button');
                    editPostButton.classList.add('visually-hidden');
                    editPostForm.appendChild(editPostInput);
                    editPostInput.appendChild(editPostButton);
                    event.path[2].appendChild(editPostForm);
                    editPostForm.addEventListener('submit', async (event) => {
                        event.preventDefault();
                        let post_id = event.path[3].getAttribute('id');
                        console.log(post_id);
                        await axios.put(`http://localhost:3000/user/${activeUser_id}/post/${post_id}`, {
                            text: event.path[0][0].value
                        })
                        editPostForm.classList.add('visually-hidden')
                    });

                    console.log('no error in friend script')
                }
            })
        })
    }
}


