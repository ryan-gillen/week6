document.addEventListener('DOMContentLoaded', async function(event) {
  let db = firebase.firestore()
  // Step 1: Make the world's tiniest to-do app


  let form = document.querySelector('form')

  document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault()
    //console.log('to-do submitted')

    let todoText = document.querySelector('#todo').value 
    console.log(todoText)

    if(todoText.length > 0 ) {
      let todoList = document.querySelector('.todos')
      todoList.insertAdjacentHTML('beforeend', `
        <div class="py-4 text-xl border-b-2 border-purple-500 w-full">
          ${todoText}
        </div>
      `)

      document.querySelector('#todo').value = ''

      let docRef = await db.collection('todos'). add({
        text: todoText
      })

      let todoId = docRef.id
      console.log(`new todo created: ${todoID}`)
    }




  })

  // Step 2: Read existing to-dos from Firestore

  let querySnapshot = await db.collection('todos').get()
  console.log(querySnapshot.size)

  let todos = querySnapshot.docs
  //console.log(todos)

  for (let i = 0; i < todos.length; i++) {
    let todo = todos[i]
    //console.log(todo)
    let todoID = todo.id 
    //console.log(todoID)
    let todoData = todo.data()
    console.log(todoData)
    let todoText = todoData.text

    let todoList = document.querySelector('.todos')
    todoList.insertAdjacentHTML('beforeend', `
      <div class="todo-${todoID}py-4 text-xl border-b-2 border-purple-500 w-full">
        <a class="done p-2 text-sm bg-green-500 text-white">☑️</a>
        ${todoText}
      </div>
    `)

    document.querySelector('.done')


  }




  // Step 3: Add code to Step 1 to add todo to Firestore
  // Step 4: Add code to allow completing todos



})