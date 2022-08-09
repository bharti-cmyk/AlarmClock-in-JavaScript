
const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hour");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#ampm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarm-container");

//update dropdownList 
window.addEventListener("DOMContentLoaded", function() {
  
    dropDownList(1, 12, setHours);
   
    dropDownList(0, 59, setMinutes);
  
    dropDownList(0, 59, setSeconds);

    setInterval(getCurrentTime, 1000);

    renderAlarm();
});

//
function dropDownList(start, end, element) {
    for (let i = start; i <= end; i++) {
      const dropDown = document.createElement("option");
      dropDown.value = i < 10 ? "0" + i : i;
      dropDown.innerHTML = i < 10 ? "0" + i : i;
      element.appendChild(dropDown);  // used to add element at the end
    }
  }

  function getCurrentTime() {
    let date = new Date();
    const options = {hour: "numeric", minute: "numeric", second: "numeric", hour12: true,}; //hour12 is to set time in 12 hour range
    let time = date.toLocaleTimeString("en-US", options); //en-US to set “dd-mm-yyyy” as their date format
    currentTime.innerHTML = time;
  
    return time;
  }

  //Displaying all Alarms on index.html
function renderAlarm() {
    const alarms = listOfAlarm();
  
    alarms.forEach((t) => {
      insertAlarm(t, true);
    });
  }

  //bring the list of time stored in local storage in the form of array
function listOfAlarm() {
    let alarms = [];
    const isNotEmpty = sessionStorage.getItem("alarms");
    
      if(isNotEmpty){
        alarms = JSON.parse(isNotEmpty);
      } 
      // JSON.parse to retrieve data from the sessionStorage and convert to an object again:

  
    return alarms;
  }


  //renders html code for all alarm 
  function insertAlarm(time, rendering = false) {
    //Every time page is refreshed a timer is assigned toevery alarm which checks after every 50 ms that the saved alarm time is equal to current time 
    const id = setInterval(function(){
      if (time === getCurrentTime()) {
        alert("Alarm Ringing");
      }
      console.log("running");
    }, 500);
  
    addHtmlCode(time,id);

    if (!rendering)  {
      saveAlarm(time);
    }
  }

  // Alarms set by user Dislayed in HTML
function addHtmlCode(time,serialId) {
    const alarm = document.createElement("div");

    alarm.classList.add();

    alarm.innerHTML = `
                <div><h3>${time}</h3></div>
                <button class="delete-alarm" data-id=${serialId}>Delete</button>
                `;
    const deleteButton = alarm.querySelector(".delete-alarm");

    deleteButton.addEventListener("click",function(event){

      deleteAlarm(event,time,serialId);

    });
  
    alarmContainer.prepend(alarm);//add element at the front
  }
  

  
  
  // save alarm to local storage
  function saveAlarm(time) {
    const alarms = listOfAlarm();
  
    alarms.push(time);
    //sessionStorage stores key-value pairs. So to store a entire javascript object we need to serialize it first with JSON.stringify
    sessionStorage.setItem("alarms", JSON.stringify(alarms));
  }

  setAlarmButton.addEventListener("click", getInput);


//fetch time of new alarm being created
  function getInput(event) {
    event.preventDefault();
    const hourValue = setHours.value;
    const minuteValue = setMinutes.value;
    const secondValue = setSeconds.value;
    const amPmValue = setAmPm.value;
  
    const alarmTime = `${parseInt(hourValue)}:${minuteValue}:${secondValue} ${amPmValue}`;
     
    insertAlarm(alarmTime);
  }


//deletes alarm from html page
  function deleteAlarm(event,time,id) {
    
  
    clearInterval(id);
    const alarm = event.target.parentElement;//access to its own parent container
    deleteAlarmFromLocal(time);
    alarm.remove();
  }
  
  //delete alarm from local storage
  function deleteAlarmFromLocal(time) {
    const alarms = listOfAlarm();
  
    const index = alarms.indexOf(time);
    alarms.splice(index,1);
    sessionStorage.setItem("alarms",JSON.stringify(alarms));//update alarms array in localStorage after deleting specified alarm
  }