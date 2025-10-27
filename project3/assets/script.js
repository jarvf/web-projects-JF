// 1. GLOBAL VARIABLES
let postContainer
// 2. wait for window to load

window.onload = () => {
    postContainer = document.getElementById('posts')

    getMessages()
}
async function getMessages (){
    let response = await fetch('/all-messages')
    console.log(response)

    let json = await response.json()
    console.log(json.notes)

    for(let n of json.notes){
        let newElement = document.createElement('div')
        let title = document.createElement('h3')
        title.textContent = n.username
        let paragraph = document.createElement('p')
        paragraph.textContent += 'says ' + n.message + ' at ' + n.date

        newElement.appendChild(title)
        newElement.appendChild(paragraph)

        postContainer.appendChild(newElement)
}

// 3. helper functions