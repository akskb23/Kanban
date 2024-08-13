const addBtn = document.querySelector(".add-btn");
const popupCont = document.querySelector(".popup-container");
const mainCont = document.querySelector(".main-container");
const textArea = document.querySelector(".textArea-container");
const allPriorityColors = document.querySelectorAll(".priority-color");
const removeBtn = document.querySelector(".remove-btn");
const toolBoxColors = document.querySelectorAll(".color")


let popupPriorityColor = "blue";
let addTaskFlag = false;
let removeTaskFlag = false;
const lockClose = "fa-lock";
const lockOpen = "fa-lock-open";
const colors = ["red","green","yellow","blue"];
const ticketsArr = JSON.parse(localStorage.getItem("tickets")) || [];



toolBoxColors.forEach(function(colorEle){
    colorEle.addEventListener("click",function(){
       // console.log("color clicked", colorEle.classList[0]);
       const selectedColor = colorEle.classList[0];
       const allTickets = document.querySelectorAll(".ticket-container");

       allTickets.forEach(function(ticket){
        const ticketColorBand = ticket.querySelector(".ticket-color");
        if(ticketColorBand.style.backgroundColor == selectedColor){
            ticket.style.display = "block";
        }else{
            ticket.style.display = "none"
        }
       });
    });

    colorEle.addEventListener("dblclick", function(){
        const allTickets = document.querySelectorAll(".ticket-container");
        allTickets.forEach(function(ticket){
            ticket.style.display = "block";
        })
    })
});


addBtn.addEventListener("click", function(){
   addTaskFlag=!addTaskFlag;
   if(addTaskFlag){
      popupCont.style.display = "flex";
     }else{
      popupCont.style.display = "none";

    }
});

removeBtn.addEventListener("click", function (){
    removeTaskFlag=!removeTaskFlag;
    if(removeTaskFlag){
        alert("Delete Button Activated");
        removeBtn.style.color= "red";
     }else{
        removeBtn.style.color= "white";
        }

});

function handleRemoval(ticket) {
    ticket.addEventListener("click", function () {
      if (!removeTaskFlag) return;
      else {
        ticket.remove();
      }
    });
}

function handleLock(ticket){
    const ticketLockEle = ticket.querySelector(".ticket-lock");
    const ticketLockIcon = ticketLockEle.children[0];
    const ticketTaskArea = ticket.querySelector(".ticket-task")
    const id = ticket.querySelector(".ticket-id").innerText;

    ticketLockIcon.addEventListener("click", function(){
        const ticketIdx = getTicketIdx(id);
        if(ticketLockIcon.classList.contains(lockClose)){
            ticketLockIcon.classList.remove(lockClose);
            ticketLockIcon.classList.add(lockOpen);
            ticketTaskArea.setAttribute("contenteditable", "true");
        }else{
            ticketLockIcon.classList.remove(lockOpen);
            ticketLockIcon.classList.add(lockClose);
            ticketTaskArea.setAttribute("contenteditable", "false");

        }
        ticketsArr[ticketIdx].taskContent = ticketTaskArea.innerText;
        updateLocalStorage();
    });
}
 

function colorHandle(ticket){
    const ticketColorBand = ticket.querySelector(".ticket-color");
    const id = ticket.querySelector(".ticket-id").innerText;
    ticketColorBand.addEventListener("click", function(){
      const ticketIdx = getTicketIdx(id);  
      let currentColor = ticketColorBand.style.backgroundColor;
      let currentColorIdx = colors.findIndex(function(color){
        return currentColor == color;
      });
      currentColorIdx++;
      const newTicketColorIdx = currentColorIdx % colors.length; // currentindexofcolor % 4
      const newTicketColor = colors[newTicketColorIdx];
      ticketColorBand.style.backgroundColor = newTicketColor;
      ticketsArr[ticketIdx].ticketColor = newTicketColor;
      updateLocalStorage();
      
    });

}

function init(){
    if(localStorage.getItem("tickets")){
        ticketsArr.forEach(function(ticket){
            createTicket(ticket.ticketColor, ticket.taskContent, ticket.ticketId)
        });
    }
}

init();


function getTicketIdx(id){
    const ticketIdx = ticketsArr.findIndex(function(ticket){
        return ticket.ticketId == id;
    });
   
    return ticketIdx;
}

function createTicket(ticketColor, ticketTask, ticketId){
const ticketCont= document.createElement("div");
ticketCont.setAttribute("class", "ticket-container");
ticketCont.innerHTML = 
`<div class="ticket-container">
    <div class="ticket-color" style="background-color:${ticketColor}"></div>
    <div class="ticket-id">${ticketId}</div>
    <div class="ticket-task">${ticketTask}</div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>`;
    mainCont.appendChild(ticketCont);
    handleRemoval(ticketCont);
    handleLock(ticketCont);
    colorHandle(ticketCont);

}

// ADD listener on popup

popupCont.addEventListener("keydown", function(e){
    const key = e.key;
    if(key == "Shift"){
        const taskContent = textArea.value;
        //const ticketId = shortid();
        const ticketId = Math.random().toString(36).substring(2,8);
        createTicket(popupPriorityColor,taskContent, ticketId);
        popupCont.style.display = "none";
        textArea.value = "";
        addTaskFlag = false;
        ticketsArr.push({ticketId, taskContent, ticketColor:popupPriorityColor})
        updateLocalStorage();
    }
});


// ADD listener on priority colors

// for(let i = 0; i<allPriorityColors.length; i++){
//     allPriorityColors[i].addEventListener("click", function){
//         // some fuctionality
//     }
// }

allPriorityColors.forEach(function(colorEle){
    // some fuctionality
     colorEle.addEventListener("click", function(e){
            // some fuctionality
            // remove active class from all priority colors
         allPriorityColors.forEach(function(priorityEle){
           priorityEle.classList.remove("active");
         })
        // add active class to clicked colorElement.
        colorEle.classList.add("active");
         popupPriorityColor = colorEle.classList[0];
     })
})



function updateLocalStorage(){
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
}