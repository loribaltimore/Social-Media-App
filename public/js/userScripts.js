let denyRequest = document.querySelectorAll('.deny-request-form');
let notificationPopup = document.querySelector('.notification-popup');
let notificationButton = document.querySelector('.notification-button')
let approveRequest = document.querySelectorAll('.approve-request-form');
let notification = document.querySelectorAll('.notification');
let editProfileBtn = document.querySelector('.edit-profile-button');
let editProfilePopup = document.querySelector('.edit-profile-popup');
let profilePhotosButton = document.querySelector('.profile-photos-button');
let profilePhotosPopup = document.querySelector('.profile-photos-popup');
let profilePictureForm = document.querySelectorAll('.profile-picture-form');
let profilePicturesInput = document.querySelectorAll('.profile-picture-input');
let profilePhotoHolder = document.querySelector('.profile-photo-holder');
let uploadCoverButton = document.querySelector('.upload-cover-button');
let coverPhotosPopup = document.querySelector('.cover-photo-popup');
let coverPhotoHolder = document.querySelector('.cover-photo-holder');
let editProfileClose = document.querySelector('.edit-profile-close');
let allPhotosHolder = document.querySelector('.all-photos-holder');
let userAllPhotosDiv = document.querySelector('.user-all-photos-div')
let photoDeleteCheckbox = document.querySelectorAll('.photo-delete-checkbox');
let photoDeleteBtn = document.querySelector('.photo-delete-btn');
let addPhotosForm = document.querySelector('#add-photos-form');

if (notificationButton) {
    notificationButton.addEventListener('click', (event) => {
        if (notificationPopup.classList.contains('visually-hidden') === true) {
        notificationPopup.classList.remove('visually-hidden')
        } else {
            notificationPopup.classList.add('visually-hidden')
        };
    
    
    })
}

if (approveRequest) {
    for (let approval of approveRequest) {
        approval.addEventListener('submit', async (event) => {
            setTimeout(() => {
                event.path[4].remove();
            }, 1000);
            event.preventDefault();
            let friend_id = approval.getAttribute('id');
            await axios.put(`http://localhost:3000/user/${activeUser_id}/friends/${friend_id}`, {
                notification_id: event.path[3].getAttribute('id')
            })
                .then(data => { console.log(data); return data })
                .catch(err => console.log(err));
            
        });
       
    }
    for (let denial of denyRequest) {
        denial.addEventListener('submit', async (event) => {
            setTimeout(() => {
                event.path[4].remove();
            }, 1000);
            event.preventDefault();
            console.log(event.path[3])
            let friend_id = denial.getAttribute('id');
            await axios.put(`http://localhost:3000/user/${activeUser_id}/friends/${friend_id}/dismiss`, {
                notification_id: event.path[3].getAttribute('id')
            })
                .then(data => { console.log(data); return data })
                .catch(err => console.log(err));
            
        });
       
    }
};

if (editProfileBtn) {
    editProfileBtn.addEventListener('click', (event) => {
        if (editProfilePopup.classList.contains('visually-hidden')) {
            editProfilePopup.classList.remove('visually-hidden');
        } else {
            editProfilePopup.classList.add('visually-hidden');
        };
        editProfileClose.addEventListener('click', (event) => {
            editProfilePopup.classList.add('visually-hidden');
        });
        console.log('editProfile button is working')
    });
   
    profilePhotosButton.addEventListener('click', (event) => {
        if (profilePhotosPopup.classList.contains('visually-hidden')) {
            profilePhotosPopup.classList.remove('visually-hidden');
        } else {
            profilePhotosPopup.classList.add('visually-hidden');
        }
    })
    uploadCoverButton.addEventListener('click', (event) => {
        if (coverPhotosPopup.classList.contains('visually-hidden')) {
            coverPhotosPopup.classList.remove('visually-hidden');
        } else {
            coverPhotosPopup.classList.add('visually-hidden');
        }
    });
    if (userAllPhotosDiv) {
        let photosToDelete = [];
        userAllPhotosDiv.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-photo-button')) {
                photoDeleteBtn.addEventListener('click', async (event) => {
                    await axios.put(`http://localhost:3000/user/${activeUser_id}`, {
                        deletePhotos: photosToDelete.map(function (element) {
                            return element.filename;
                        })
                    })
                        .then(data => { console.log(data); return data })
                        .catch(err => console.log(err))
                });
                for (let box of photoDeleteCheckbox) {
                    box.removeAttribute('hidden');
                }
                allPhotosHolder.addEventListener('click', (event) => {
                    if (event.target.classList.contains('photo-delete-checkbox')) {
                        if (photoDeleteBtn.getAttribute('hidden') !== null) {
                            photoDeleteBtn.removeAttribute('hidden')
                        } else if (photosToDelete.length === 0) {
                            photoDeleteBtn.setAttribute('hidden', true)
                        };
                        
                        if (
                            photosToDelete.filter(function (element) {
                                if (element.filename === event.target.id) {
                                    return element
                                }
                            }).length === 0
                        ) {
                            photosToDelete.push({ filename: event.target.id, count: 1 });
                            console.log(photosToDelete.length);
                        } else {
                            console.log('DUPLICATE')
                            for (let photo of photosToDelete) {
                                if (photo.filename === event.target.id) {
                                    photo.count++;
                                }
                            }
                        };

                        photosToDelete = photosToDelete.sort(function (a, b) {
                            return b.count - a.count
                        });
                        if (photosToDelete[0].count > 1) {
                            photosToDelete.shift();
                        }
                        
                    }
                
                })
            } else if (event.target.classList.contains('add-photo-button')) {
                console.log('YEAHH BUDDY')
                addPhotosForm.removeAttribute('hidden');
            }
        })
    }
}
if (profilePhotoHolder) {
    profilePhotoHolder.addEventListener('click', async(event) => {
        if (event.target.classList.contains('profile-photo-thumbnails')) {
            console.log(event.path[1][0].value)
            await axios.put(`http://localhost:3000/user/${activeUser_id}`, {
                profile_picture: { filename: event.path[1][0].value.split('::')[0], path: event.path[1][0].value.split('::')[1]}
            }) 
    }
    })
}
if (coverPhotoHolder) {
    coverPhotoHolder.addEventListener('click', async(event) => {
        if (event.target.classList.contains('cover-photo-thumbnails')) {
            console.log(event.path[1][0].value)
            await axios.put(`http://localhost:3000/user/${activeUser_id}`, {
                cover_picture: { filename: event.path[1][0].value.split('::')[0], path: event.path[1][0].value.split('::')[1]}
            }) 
    }
    })
}


(function () {
    'use strict'
    var forms = document.querySelectorAll('.needs-validation')
 
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
})()
  
console.log('no errors in user script')

//update this to delegate the events down from the navbar menu dropdown
///working on deleting photos. how can we pull the filenames from User.img array? mongoose pull operator