let db = firebase.firestore()

window.addEventListener('DOMContentLoaded', async function(event) {

  document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault()
    let postUsername = document.querySelector('#username').value
    let postImageUrl = document.querySelector('#image-url').value
    let postNumberOfLikes = 0

    let docRef = await db.collection('posts').add({
      username: postUsername,
      imageUrl: postImageUrl,
      likes: postNumberOfLikes
    })
    
    // use .insertAdjacentHTML to add the newly created post to the page
    // use the newly created document's ID to uniqueley identify the new like button
    let postId = docRef.id
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
    
    // attach an event listener to the specific like button using the .post-* selector
    document.querySelector(`.post-${postId} .like-button`).addEventListener('click', async function(event) {
      event.preventDefault()
      
      // ensure that each like button click is unique by logging the output of the clicked postId
      console.log(`post ${postId} like button clicked!`)
      
      // get the existing number of likes from the "likes" element
      let existingNumberOfLikes = document.querySelector(`.post-${postId} .likes`).innerHTML
      
      // increment the number of likes (converting to an Integer first) by 1
      let newNumberOfLikes = parseInt(existingNumberOfLikes) + 1
      
      // modify the number of likes displayed in the html
      document.querySelector(`.post-${postId} .likes`).innerHTML = newNumberOfLikes
      
      // update the number of likes for the given post in the Firestore collection using .update()
      await db.collection('posts').doc(postId).update({ likes: newNumberOfLikes })
  })

  let querySnapshot = await db.collection('posts').get()
  let posts = querySnapshot.docs
  
  for (let i=0; i<posts.length; i++) {  
    let postId = posts[i].id
    let postData = posts[i].data()
    let postUsername = postData.username
    let postImageUrl = postData.imageUrl
    let postNumberOfLikes = postData.likes
        
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
      // console.log(`post ${postId} like button clicked!`)
      let existingNumberOfLikes = document.querySelector(`.post-${postId} .likes`).innerHTML
      let newNumberOfLikes = parseInt(existingNumberOfLikes) + 1
      document.querySelector(`.post-${postId} .likes`).innerHTML = newNumberOfLikes

      await db.collection('posts').doc(postId).update({ likes: newNumberOfLikes })
    })
  }
})