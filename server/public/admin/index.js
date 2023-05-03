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

function addTableRow(id, name) {
  const tableBody = document.querySelector("#table tbody");
  const newRow = document.createElement("tr");
  const idCell = document.createElement("td");
  const nameCell = document.createElement("td");
  const scoreCell = document.createElement("td");

  idCell.textContent = id;
  nameCell.textContent = name;
  scoreCell.textContent = 166;

  newRow.appendChild(idCell);
  newRow.appendChild(nameCell);
  //newRow.appendChild(scoreCell);

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

//if click on any row, download the file
//add event listener to the table
const tableBody = document.querySelector("#table tbody");
tableBody.addEventListener("click", (event) => {
  //check if the click was on a row
  if (event.target.tagName === "TD") {
    //get the row
    const row = event.target.parentNode;

    //get the cell under the column Filename
    const filenameCell = row.children[1].textContent;

    //make a get request to the server to get the file
    // alert("making req to " + endpoint + "/download/" + filenameCell);
    axios
      .get(endpoint + "/download/" + filenameCell)
      .then((response) => {
        console.log(response.data);
        //alert(response.data);
        //download the file
        const element = document.createElement("a");
        const file = new Blob([response.data], {
          type: "text/plain",
        });
        element.href = URL.createObjectURL(file);
        element.download = filenameCell + ".csv";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      })
      .catch((error) => {
        alert(error);
      });
  }
});
