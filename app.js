 // Initialize Firebase
 
  var config = {
    apiKey: "AIzaSyCPSY8Pg1qNMPree8jyizkAf-gZiimYJps",
    authDomain: "trainscheduler-541f9.firebaseapp.com",
    databaseURL: "https://trainscheduler-541f9.firebaseio.com",
    projectId: "trainscheduler-541f9",
    storageBucket: "trainscheduler-541f9.appspot.com",
    messagingSenderId: "294324400899"
  };
  firebase.initializeApp(config);

var dataRef = firebase.database().ref();

//Add Time function (add the frequency to the initial time.)
// var addTime = 
// function(hour, minutes, amPM, frequency){
//           var hoursAdded = Math.floor((frequency+minutes)/60);
//           var newMinutes = (frequency+minutes) % 60;
//           var newHour;
//           var dt = new Date();
//           if(hour + hoursAdded>12){
//             newHour = hour+hoursAdded-12;
//             // console.log(amPM);
//             var newAMPM = amPM === "pm" ? "am": "pm";
//             // console.log(newAMPM);
//             if (newMinutes == 0){
//             newMinutes = "00"
//             }
//             console.log(newHour+":"+newMinutes+newAMPM)}

//             else{newHour = hour+hoursAdded
//               if (newMinutes == 0){
//               newMinutes = "00"
//               }
//             console.log(newHour+":"+newMinutes+amPM);
//             };
            
//         }
//Get Train schedule and aplly to DOM Function
function getSchedule(){
  $("#theSchedule").empty();
  dataRef.once("value").then(function(snapshot) {
  var trains = snapshot.val();
  // var newRow = $("<tr>")
  // console.log(trains);
    for (var key in trains) {
      // console.log(trains[key])
      var obj = trains[key];
      for (var prop in obj) {
        //new row variable
        var newRow = $("<tr>")
        var eachTrain = obj[prop];
        var parseTime = eachTrain.InitialTime.split(":")
        //Separate hours and minutes and change to Int
        var hour = parseInt(parseTime[0]);
        var minutes = parseInt(parseTime[1].substring(0, 2));
        var amPM = parseTime[1].substring(2, 4);
        //Calculate for Am or Pm
        if(amPM === "pm"){hour += 12}
        var frequency = parseInt(eachTrain.Frequency);
        //Get Current Epoch time of today's midnight
        var midnight = new Date().setHours(0,0,0,0);
        // console.log(midnight);
        // console.log(hour);
        var todayInitialTime = midnight + (hour*3600000)+(minutes*60000);
        var currentTime = new Date();
        console.log(currentTime)
        //Find Next Arrvial Time
        while(todayInitialTime < currentTime){
          todayInitialTime += (frequency*60000)
        }
        // console.log(todayInitialTime)
        var nextArrivalTime = todayInitialTime
        // console.log(nextArrivalTime)
        var minuteTilArrival = Math.floor((nextArrivalTime - currentTime)/60000)
        nextArrivalTime = new Date(nextArrivalTime)
        if(minuteTilArrival === 0){
          minuteTilArrival = "Boarding Now";
        }
        

        newRow.append(
          `<td>${eachTrain.TrainName}</td>
          <td>${eachTrain.Destination}</td>
          <td>${eachTrain.InitialTime}</td>
          <td>${eachTrain.Frequency}</td>
          <td>${nextArrivalTime}</td>
          <td>${minuteTilArrival}</td>`);
        $("#theSchedule").append(newRow);
      }

    }
  });
};

getSchedule();
setInterval(getSchedule, 60000)

//On Click Event for Submit
$("#submit-button").click(function(event){
  //Get values from DOM
  event.preventDefault();
  var trainName = $("#TrainName").val();
  var destination = $("#Destination").val();
  var firstTrainTime = $("#First_Train_Time").val();
  var frequency = $("#Frequency").val();


//User Validation
  if(trainName === ""){
  $("#TrainName").attr("style", "min-width: 100%; border-color: red; border-width: 6px")
  setTimeout(function(){
    $("#TrainName").attr("style", "min-width: 100%; ");}, 2000);}
  else if(destination === ""){
    $("#Destination").attr("style", "min-width: 100%; border-color: red; border-width: 6px")
    setTimeout(function(){
    $("#Destination").attr("style", "min-width: 100%; ");}, 2000);}
  else if(firstTrainTime === ""){
    $("#First_Train_Time").attr("style", "min-width: 100%; border-color: red; border-width: 6px")
    setTimeout(function(){
    $("#First_Train_Time").attr("style", "min-width: 100%; ");}, 2000);}
  else if(frequency === ""){
    $("#Frequency").attr("style", "min-width: 100%; border-color: red; border-width: 6px")
    setTimeout(function(){
    $("#First_Train_Time").attr("style", "min-width: 100%; ");}, 2000);}
  else{
  
  
    dataRef.child("trains").push({
      TrainName: trainName,
      Destination: destination,
      InitialTime: firstTrainTime,
      Frequency: frequency
    });
  }
  $("#TrainName").val("");
  $("#Destination").val("");
  $("#First_Train_Time").val("");
  $("#Frequency").val("");
  getSchedule();
})

$(function() {
  $('#First_Train_Time').timepicker({ 'scrollDefault': 'now' });
});
// $('#First_Train_Time').timepicker({ 'scrollDefault': 'now' });


