import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update, increment } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
	databaseURL: "https://playground-f78df-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")

const commentInputEl = document.getElementById("comment-input")
const fromInputEl = document.getElementById("from-input")
const toInputEl = document.getElementById("to-input")

const publishBtn = document.getElementById("publish-btn")
const endorsementsContainer = document.getElementById("endorsement-container")

publishBtn.addEventListener("click", function() {
    let commentValue = commentInputEl.value
    let fromValue = fromInputEl.value
    let toValue = toInputEl.value
    
    if (commentValue.trim().length === 0 || fromValue.trim().length === 0 || toValue.trim().length === 0) {
        alert("Empty")
    } else {
        let endorsement = {
            'comment': commentValue,
            'from': fromValue,
            'to': toValue,
            'likes': 0
        }
    
        push(endorsementsInDB, endorsement)
        clearInputFields()
    }
})

function clearInputFields() {
    commentInputEl.value = fromInputEl.value = toInputEl.value = ""
}

onValue(endorsementsInDB, function(snapshot) {
    if(snapshot.exists()) {
        let endorsementsArray = Object.entries(snapshot.val())
        clearEndorsements()
        for (let i = 0; i < endorsementsArray.length; i++) {
            renderEndorsement(endorsementsArray[i])
        }
        addEvents()
    } else {
        console.log("Nothing")
    }
})

function clearEndorsements() {
    endorsementsContainer.innerHTML = ""
}

function renderEndorsement(endorsement) {
    console.log(endorsement)
    endorsementsContainer.innerHTML += `
            <div class="endorsement">
                    <p class="bold-txt">To ${endorsement[1].to}</p>
                    <p class="msg-txt">${endorsement[1].comment}</p>
                    <div class="endorsement-footer">
                        <p class="bold-txt">From ${endorsement[1].from}</p>
                        <span id="${endorsement[0]}" class="likeBtn">❤️ ${endorsement[1].likes}</span>
                    </div>
                </div>`
}

function addEvents() {
    let likeBtns = document.querySelectorAll(".likeBtn")
    for (let i = 0; i < likeBtns.length; i++) {
        let idVal = likeBtns[i].getAttribute("id")
        
        if(localStorage.getItem(idVal)) {
            likeBtns[i].classList.add("liked")
        }
        
        likeBtns[i].addEventListener("click", function() {
            if (!localStorage.getItem(idVal)) {
                let likeRef = ref(database, `endorsements/${idVal}`)
                update(likeRef, {
                    'likes': increment(1)
                })
                localStorage.setItem(idVal, "true")
                likeBtns[i].classList.add("liked")
            } else {
                alert("You've already liked this endorsement")
            }
        })
    }
}