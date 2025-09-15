// this is a comment in javascript      

// this is loading event with anon function
//use THIS specific format for DOM loading
window.onload = () => {
    // alert("page is loaded");
    console.log ("page is fully loaded");

    // gives us an array, collection of variables
    //harder to manipulate
    let allMyParagraphs = document.getElementsByTagName('p')
    console.log(allMyParagraphs);

    // more specific, but still an array
    let blueParagraphs = document.getElementsByClassName('blue-paragraph')
    console.log(blueParagraphs);

    // we don't want to manipulate an array, harder to retrieve data
    //arrays are comprised of a series of data IN ORDER
    // #1 element = 0, #2 element = 1
    console.log(allMyParagraphs[0])

    // ids are the best way to retrieve individual elements on a page  
    let importantParagraph = document.getElementById('important-paragraph')
    console.log(importantParagraph);
    // modify content with js
    importantParagraph.innerHTML ="this is my new paragraph text <span> this is in a span </span>"

    importantParagraph.style.color ="violet"

    importantParagraph.classList.add('red-paragraph')
    importantParagraph.classList.add("second-class")

    let button = document.getElementById('click')
    button.addEventListener("click", () => {  
        //create a variable that is an instance of the element
        let newElement = document.createElement('p')
        // add content to element
        newElement.textContent = "hi"
        newElement.classList.add('greetings')
        // reference to where we are adding the element
        let container = document.body //body has a shorthand because used often
        // add the element to the page
        container.appendChild(newElement)

        let byeButton = document.getElementById('bye')
        byeButton.addEventListener('click', () => {
            //retrieving all paragraphs that contain greetrings
            let allMyGreetings = document.getElementsByClassName('greetings')
            console.log(allMyGreetings);
            allMyGreetings[0].remove()
    })
   // button.onclick
    });
};
