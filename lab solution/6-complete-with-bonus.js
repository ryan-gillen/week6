let db = firebase.firestore()

// move all the insertAdjacentHTML and event listener code into a function for easy reuse
async function renderPost(postId, postUsername, postImageUrl, postNumberOfLikes) {
  document.querySelector('.posts').insertAdjacentHTML('beforeend', `
    <div class="post-${postId} md:mt-16 mt-8 space-y-8">
      <div class="md:mx-0 mx-4">
        <span class="font-bold text-xl">${postUsername}</span>
      </div>
  
      <div>
        <img src="${postImageUrl}" class="w-full">
      </div>
  
      <div class="text-3xl md:mx-0 mx-4">
        <button class="like-button">❤️</button>
        <span class="likes">${postNumberOfLikes}</span>
      </div>
    </div>
  `)
  document.querySelector(`.post-${postId} .like-button`).addEventListener('click', async function(event) {
    event.preventDefault()
    console.log(`post ${postId} like button clicked!`)
    let existingNumberOfLikes = document.querySelector(`.post-${postId} .likes`).innerHTML
    let newNumberOfLikes = parseInt(existingNumberOfLikes) + 1
    document.querySelector(`.post-${postId} .likes`).innerHTML = newNumberOfLikes
    await db.collection('posts').doc(postId).update({
      likes: firebase.firestore.FieldValue.increment(1)
    })
  })
}

window.addEventListener('DOMContentLoaded', async function(event) {
  document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault()
    let postUsername = document.querySelector('#username').value
    let postImageUrl = document.querySelector('#image-url').value
    let postNumberOfLikes = 0

    // when adding the new post, assign the created field with the current time
    let docRef = await db.collection('posts').add({
      username: postUsername,
      imageUrl: postImageUrl,
      likes: postNumberOfLikes,
      created: firebase.firestore.FieldValue.serverTimestamp()
    })

    let postId = docRef.id
    renderPost(postId, postUsername, postImageUrl, postNumberOfLikes)
  })

  // use .orderBy() to return the posts ordered chronologically by the created field timestamp
  let querySnapshot = await db.collection('posts').orderBy('created').get()
  let posts = querySnapshot.docs
  
  for (let i=0; i<posts.length; i++) {  
    let postId = posts[i].id
    let postData = posts[i].data()
    let postUsername = postData.username
    let postImageUrl = postData.imageUrl
    let postNumberOfLikes = postData.likes
    
    // use the new function which replaces the repetitive insertAdjacentHTML and event listener code
    renderPost(postId, postUsername, postImageUrl, postNumberOfLikes)
  }
})
