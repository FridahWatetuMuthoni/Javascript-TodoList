const todos = document.getElementById('todos')
const todo_form = document.getElementById("todo-form")
const total_tasks = document.getElementById("total")
const completed_tasks = document.getElementById("finished")
const pending_tasks = document.getElementById("pending")
const todo_value = document.getElementById("todo_value")
let tasks = JSON.parse(localStorage.getItem("tasks")) || []

todos.addEventListener("click", handleClick)
todos.addEventListener("input",handleInputs)
todo_form.addEventListener("submit", addTodo)
todos.addEventListener('keydown',e=>{
    if(e.keyCode === 13){
        e.preventDefault()

        //removes the focus from an element
        e.target.blur()
    }
})

if(localStorage.getItem('tasks')){
    tasks.map((task)=>{
        createTask(task)
    })
}

function handleClick(e){
    if(e.target.classList.contains('delete')){

        const todo_element = e.target.parentElement.parentElement
        const input_element = todo_element.children[0].children[0]
        const taskId = input_element.getAttribute('id')
        handleDelete(taskId)
    }
}

function handleInputs(e){
        const element = e.target.parentElement.children[0]
        const taskId = element.getAttribute('id')
        updateTask(taskId, e.target)
}

function handleDelete(taskId){
    //updating the localstorage
    tasks = tasks.filter((task)=>{
        return task.id != parseInt(taskId)
    })
    localStorage.setItem('tasks',JSON.stringify(tasks))

    //removing the task from the document
    let element = document.getElementById(taskId).parentElement.parentElement
    element.remove()
    countTask()
}

function updateTask(taskId, element){
    let task = tasks.find(task=>{
        return parseInt(task.id) == taskId
    })
    console.log()
    if(element.classList.contains('todo-radio')){
        task.isCompleted = !task.isCompleted
        let p_element = element.parentElement.children[1]
        let main_element = p_element.parentElement.parentElement

        if(task.isCompleted){
            p_element.removeAttribute('contenteditable')
            main_element.classList.add('completed')
        }
        else{
            p_element.setAttribute('contenteditable','true')
            main_element.classList.remove('completed')
        }
    }
    else{
        let value = element.textContent.trim()
        task.name = value
    }

    localStorage.setItem('tasks',JSON.stringify(tasks))
    countTask()
}

function addTodo(e){
    e.preventDefault()

    let value = todo_value.value

    if(value.trim() == ""){
        return
    }

    let task = {
        id: new Date().getTime(),
        name: value,
        isCompleted: false
    }
    
    tasks.push(task)
    localStorage.setItem('tasks',JSON.stringify(tasks))
    createTask(task)
    todo_form.reset()
    todo_value.focus()
}


function createTask(task){
    const section = document.createElement("section")
    section.setAttribute('id','todo')
    section.setAttribute('class','todo')

    if(task.isCompleted){
        section.classList.add('completed')
    }

    let element = `
            <section>
                <input type="checkbox" name="todo2" ${task.isCompleted ? 'checked': ''} id=${task.id} class="todo-radio">
                <p ${!task.isCompleted ? 'contenteditable':''} id="editable">${task.name}</p>
            </section>
            <section>
                <h3 class="delete" id="delete">&times;</h3>
            </section>
    `
    section.innerHTML = element
    todos.appendChild(section)

    countTask()
}


function countTask(){
    const completed_tasks_array = tasks.filter(task=>{
        return task.isCompleted == true
    })
    total_tasks.innerText = tasks.length
    completed_tasks.innerText = completed_tasks_array.length
    pending_tasks.innerText  = tasks.length - completed_tasks_array.length
}