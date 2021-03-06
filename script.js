'use strict';

import "core-js/stable";
import "regenerator-runtime";

////////////////////////////////////////////////////////////////////
// ----- API URL
const url = 'https://jsonplaceholder.typicode.com/posts';

////////////////////////////////////////////////////////////////////
// ----- HTML ELEMENTS
const loadSpin = document.querySelector('.lds-dual-ring');
const postsHolder = document.querySelector('.post--holder');
const postsList = document.querySelector('.posts__list');

const newTitle = document.querySelector('.newPost__section--title');
const newMessage = document.querySelector('.newPost__section--message');
const submitBtn = document.querySelector('.newPost__section--submit');
const searchInput = document.querySelector('.post__search--input');

////////////////////////////////////////////////////////////////////
// ----- MISC

let dataList;
let number = Math.trunc(Math.random() * 20) + 1;
let addedList = [];


////////////////////////////////////////////////////////////////////
// ----- API CONNECTION

// ----- LOADING DATA FROM API
const getData = async function () {
    loadSpin.style.display = "block";
    try {
        const data = await fetch(url).then(response => response.json()).then(
            (json) => {
                return json;
            }
        );
        loadSpin.style.display = "none";
        return data;
    }
    catch (error) {
        renderError('Something went wrong. Please try again shortly.')
        console.error(error);
    }
}

// ----- POSTING NEW DATA
// userID, title, message are all recieved from API object
const submitData = async function (userId, title, message) {
    await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            body: message,
            userId: userId,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => insertNewPost(json));

    loadSpin.style.display = "none";
    newTitle.value = '';
    newMessage.value = '';
    searchInput.value = '';
}

//  ----- DELETING DATA and REMOVING IT FROM HTML LIST
// ID is recieved to compare ID added to div with ID from API
const deleteData = async function (id) {
    try {
        await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: 'DELETE',
        });
    }
    catch (error) {
        renderError(error);
        alert(error);
    }
    finally {
        const index = dataList.findIndex(function (obj) {
            return obj.id == id;
        })
        if (index) dataList.splice(index, 1);
        renderData(dataList);
    }
}

////////////////////////////////////////////////////////////////////
// ----- RENDERING HTML MESSAGE LIST WITH NEW DATA
// data recieved is data from API
const renderData = function (data) {
    // clear all existing html 
    postsList.innerHTML = '';
    // generate new html template for new data
    data.forEach(function (el) {
        const html = `
            <div id=${el.id} class="posts__list--item" >
                <p title="Show/Hide Toggle" class="posts__list--title">${el.title}</p>
                <div class="posts__list--message hidden">${el.body}</div>
                <span class="posts__list--delete" title="Remove">???</span>
            </div>
        `;
        postsList.insertAdjacentHTML('afterbegin', html);
    })

    // select element target for delete button
    const msgDivs = document.querySelectorAll('.posts__list--delete');
    msgDivs.forEach(el => el.addEventListener('click', event => {
        event.stopPropagation();
        // Ask user if suer to proceed with delete
        if (confirm('Are you sure?')) {
            const parent = el.closest('.posts__list--item');
            deleteData(parent.id);
        }
    }))

    messageToggle();
};

// ---- DISPLAYING NEW POST
const insertNewPost = async function (json) {
    // clear list before inserting new post
    postsList.innerHTML = '';

    // check if title and message are not empty inputs
    if (json.title != '' && json.message != '') {
        try {
            // gets POST response and adds it to datalist
            const res = await getData();
            [...dataList] = res;

            // will make sure that post id is at least lenght of actual list + lenght of list of added posts + 1, for no conflict
            json.id = res.length + addedList.length + 1;
            addedList.push(json);

            // will push addedList objectts to dataList
            for (let i = 0; i < addedList.length; i++) {
                dataList.push(addedList[i]);
            }
            renderData(dataList);
        }
        catch (error) {
            renderError(error);
        }
    }
}

// ---- SELECT DIV and Elements to APPLY TOGGLE (show/hide message)
const messageToggle = function () {
    const msgDivs = document.querySelectorAll('.posts__list--item');
    msgDivs.forEach(el => el.addEventListener('click', event => {
        document.getElementById(el.id).getElementsByTagName('div')[0].classList.toggle('hidden');
        document.getElementById(el.id).getElementsByTagName('p')[0].classList.toggle('invert');
    }))
};

// ---- RENDERING AND SHOWING ERROR MESSAGE
const renderError = function (msg) {
    const html = `
            <div class="posts__list--error" >
                ${msg}
            </div>
        `;

    postsHolder.insertAdjacentHTML('beforebegin', html);
    // Error message will dissapear after 5 seconds
    setTimeout(() => {
        document.querySelector('.posts__list--error').style.display = 'none';
    }, 5000);
}

////////////////////////////////////////////////////////////////
/// ---- APP 

async function App() {
    // Clear all input fields at start of new app
    searchInput.value = '';
    newTitle.value = '';
    newMessage.value = '';

    // Select all async created HTML and apply Toggle and Delete Event selectors
    messageToggle();

    // load API data and Render it to DOM
    dataList = await getData();
    renderData(dataList);

    // Submit data event listener for submit button click
    submitBtn.addEventListener('click', async function (e) {
        try {
            // select and take input values for title and message body
            const title = newTitle.value;
            const message = newMessage.value;

            // Check if the title and message fields are not empty
            if (title === '' || message === '') {
                alert('Please insert proper message.');
                throw new Error('Can\'t submit empty message.')
            }
            // submit data function with random id number
            await submitData(number, title, message);
        }
        catch (error) {
            renderError(error);
        }
    });
    // change data event listener for search input
    searchInput.addEventListener('keyup', function () {
        // ~200ms is average human typing speed
        setTimeout(() => {
            const searchValue = searchInput.value;
            const searchArray = dataList.filter(val => val.title.includes(searchValue));
            renderData(searchArray);

        }, 200);
    })

}
App();




