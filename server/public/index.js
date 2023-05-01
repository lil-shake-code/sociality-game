const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const statusText = document.getElementById("status");
var seconds = 0;
var isRecording = false;

setInterval(() => {
  if (isRecording) {
    seconds++;
    //set <p id="status"> text to "Recording for these many seconds"
    statusText.textContent = "Recording for " + seconds + " seconds";
  }
}, 1000);

const endpoint = "https://the-sociality-game.uk.r.appspot.com";

startBtn.addEventListener("click", () => {
  isRecording = true;
  statusText.textContent = "Recording";
  startBtn.disabled = true;
  stopBtn.disabled = false;
  axios
    .get(endpoint + "/record")
    .then((response) => {
      console.log(response.data);
      alert(response.data);
    })
    .catch((error) => {
      alert(error);
    });
});

stopBtn.addEventListener("click", () => {
  axios
    .get(endpoint + "/stop")
    .then((response) => {
      console.log(response.data);
      alert(response.data);
      //clear the table
      const tableBody = document.querySelector("#table tbody");
      tableBody.innerHTML = "";
      //add the new rows
      axios
        .get(endpoint + "/recordings")
        .then((response) => {
          console.log(response.data);
          // alert(response.data);
          for (let i in response.data) {
            addTableRow(i, response.data[i], 0);
          }
        })
        .catch((error) => {
          alert(error);
        });
    })
    .catch((error) => {
      alert(error);
    });

  seconds = 0;
  isRecording = false;
  statusText.textContent = "Not Recording";
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

function addTableRow(id, name, score) {
  const tableBody = document.querySelector("#table tbody");
  const newRow = document.createElement("tr");
  const idCell = document.createElement("td");
  const nameCell = document.createElement("td");
  const scoreCell = document.createElement("td");

  idCell.textContent = id;
  nameCell.textContent = name;
  scoreCell.textContent = score;

  newRow.appendChild(idCell);
  newRow.appendChild(nameCell);
  newRow.appendChild(scoreCell);

  tableBody.appendChild(newRow);
}

//ask the server for already recorded files
//make a get request to the server and alert the output

axios
  .get(endpoint + "/recordings")
  .then((response) => {
    console.log(response.data);
    //alert(response.data);
    for (let i in response.data) {
      addTableRow(i, response.data[i], 0);
    }
  })
  .catch((error) => {
    alert(error);
  });
