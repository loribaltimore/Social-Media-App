let deleteFriendForm = document.querySelector('.delete-friend-form');
let deleteFriendButton = document.querySelector('.delete-friend-button');
let addFriendButton = document.querySelector('.add-friend-button');
let addFriendForm = document.querySelector('.add-friend-form');

let addFriendFormFunc = async function (event) {
    event.preventDefault();
    await axios.post(`http://localhost:3000/user/${activeUser_id}/friends/${friend_id}`, {
    })
        .then(data => console.log(data))
        .catch(err => console.log(err));
        addFriendButton.innerText = 'Unfollow';
        addFriendForm.removeEventListener('submit', addFriendFormFunc);
};
let deleteFriendFormFunc = async function (event) {
        event.preventDefault();
        await axios.delete(`http://localhost:3000/user/${activeUser_id}/friends/${friend_id}`, {
        })
            .then(data => console.log(data))
            .catch(err => console.log(err));
    deleteFriendButton.innerText = 'Follow';
    deleteFriendForm.removeEventListener('submit', deleteFriendFormFunc);
}

if (addFriendForm) {
    addFriendForm.addEventListener('submit', addFriendFormFunc); 
} else if (deleteFriendForm) {
    deleteFriendForm.addEventListener('submit', deleteFriendFormFunc);
};