/* =================================================
   DAILY LEVEL UP — 30 DAY TRACKER
================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const TOTAL_DAYS = 30;

  let profile = JSON.parse(
    localStorage.getItem("dailyLevelUpProfile")
  );

  let trackerData = JSON.parse(
    localStorage.getItem("dailyLevelUp30")
  ) || {};

  let currentDay = 1;


  /* =================================================
     ELEMENT HELPER
  ================================================= */

  function $(id) {
    return document.getElementById(id);
  }


  /* =================================================
     MAIN SCREENS
  ================================================= */

  const setupScreen = $("setupScreen");
  const trackerScreen = $("trackerScreen");
  const startBtn = $("startTrackerBtn");


  /* =================================================
     DEFAULT DATE
  ================================================= */

  if ($("startDate") && !$("startDate").value) {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    $("startDate").value =
      `${year}-${month}-${day}`;
  }


  /* =================================================
     START 30 DAYS
  ================================================= */

  if (startBtn) {

    startBtn.addEventListener(
      "click",
      startTracker
    );

  }


  function startTracker() {

    const name =
      $("profileName")?.value.trim();

    const startDate =
      $("startDate")?.value;

    const weight =
      $("profileWeight")?.value || "";

    const height =
      $("profileHeight")?.value || "";


    if (!name) {

      alert("Please enter your name.");

      $("profileName")?.focus();

      return;
    }


    if (!startDate) {

      alert("Please select your starting date.");

      return;
    }


    /* SAVE PROFILE */

    profile = {

      name: name,

      startDate: startDate,

      weight: weight,

      height: height

    };


    localStorage.setItem(
      "dailyLevelUpProfile",
      JSON.stringify(profile)
    );


    /* ONLY CREATE NEW DATA
       IF THERE IS NO DATA YET */

    if (!trackerData) {
      trackerData = {};
    }


    localStorage.setItem(
      "dailyLevelUp30",
      JSON.stringify(trackerData)
    );


    showTracker();

  }


  /* =================================================
     SHOW TRACKER
  ================================================= */

  function showTracker() {

    if (setupScreen) {

      setupScreen.classList.add(
        "hidden"
      );

    }


    if (trackerScreen) {

      trackerScreen.classList.remove(
        "hidden"
      );

    }


    loadProfile();

    loadDay(currentDay);

  }


  /* =================================================
     PROFILE
  ================================================= */

  function loadProfile() {

    if (!profile) return;


    if ($("profileNameDisplay")) {

      $("profileNameDisplay").textContent =
        profile.name;

    }


    if ($("weightDisplay")) {

      $("weightDisplay").textContent =
        profile.weight
          ? profile.weight + " kg"
          : "—";

    }


    if ($("heightDisplay")) {

      $("heightDisplay").textContent =
        profile.height
          ? profile.height + " cm"
          : "—";

    }

  }


  /* =================================================
     DATE
  ================================================= */

  function getDateForDay(day) {

    const date = new Date(
      profile.startDate + "T00:00:00"
    );

    date.setDate(
      date.getDate() + day - 1
    );

    return date;

  }


  function formatDate(date) {

    return date.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );

  }


  function formatShortDate(date) {

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric"
      }
    );

  }


  /* =================================================
     DAY DATA
  ================================================= */

  function getDayData(day) {

    if (!trackerData[day]) {

      trackerData[day] = {

        workouts: [],

        running: null,

        sleep: null,

        completed: false

      };

    }


    /* SAFETY FOR OLD DATA */

    if (!Array.isArray(
      trackerData[day].workouts
    )) {

      trackerData[day].workouts = [];

    }


    return trackerData[day];

  }


  function saveData() {

    localStorage.setItem(
      "dailyLevelUp30",
      JSON.stringify(trackerData)
    );

  }


  /* =================================================
     LOAD DAY
  ================================================= */

  function loadDay(day) {

    if (!profile) return;


    currentDay = Math.max(
      1,
      Math.min(TOTAL_DAYS, day)
    );


    const data =
      getDayData(currentDay);

    const date =
      getDateForDay(currentDay);


    if ($("selectedDay")) {

      $("selectedDay").textContent =
        currentDay;

    }


    if ($("currentDayText")) {

      $("currentDayText").textContent =
        currentDay;

    }


    if ($("dateDisplay")) {

      $("dateDisplay").textContent =
        formatDate(date);

    }


    if ($("previousBtn")) {

      $("previousBtn").disabled =
        currentDay === 1;

    }


    if ($("nextBtn")) {

      $("nextBtn").disabled =
        currentDay === TOTAL_DAYS;

    }


    updateStatus(data);

    displayWorkouts(data);

    displayRunning(data);

    displaySleep(data);

    displayHistory();

    updateProgress();

  }


  /* =================================================
     STATUS
  ================================================= */

  function updateStatus(data) {

    const status = $("dayStatus");

    if (!status) return;


    if (data.completed) {

      status.textContent =
        "✓ COMPLETED";

      status.classList.add(
        "completed"
      );

    } else {

      status.textContent =
        "NOT COMPLETED";

      status.classList.remove(
        "completed"
      );

    }

  }


  /* =================================================
     ADD WORKOUT
  ================================================= */

  if ($("addWorkoutBtn")) {

    $("addWorkoutBtn").addEventListener(
      "click",
      addWorkout
    );

  }


  function addWorkout() {

    const name =
      $("workoutName")?.value.trim();

    const set1 =
      $("set1")?.value || 0;

    const set2 =
      $("set2")?.value || 0;

    const set3 =
      $("set3")?.value || 0;


    if (!name) {

      alert(
        "Enter the workout name."
      );

      return;

    }


    const data =
      getDayData(currentDay);


    data.workouts.push({

      name: name,

      set1: set1,

      set2: set2,

      set3: set3

    });


    saveData();


    $("workoutName").value = "";
    $("set1").value = "";
    $("set2").value = "";
    $("set3").value = "";


    displayWorkouts(data);

    displayHistory();

  }


  /* =================================================
     DISPLAY WORKOUTS
  ================================================= */

  function displayWorkouts(data) {

    const table =
      $("workoutTable");

    if (!table) return;


    table.innerHTML = "";


    if (data.workouts.length === 0) {

      table.innerHTML = `

        <tr>

          <td colspan="5">
            No workouts added yet.
          </td>

        </tr>

      `;

      return;

    }


    data.workouts.forEach(
      function (workout, index) {

        const row =
          document.createElement("tr");


        row.innerHTML = `

          <td>
            <strong>
              ${escapeHTML(workout.name)}
            </strong>
          </td>

          <td>
            ${workout.set1} reps
          </td>

          <td>
            ${workout.set2} reps
          </td>

          <td>
            ${workout.set3} reps
          </td>

          <td>

            <button
              class="delete-btn"
              data-index="${index}">

              DELETE

            </button>

          </td>

        `;


        row
          .querySelector(".delete-btn")
          .addEventListener(
            "click",
            function () {

              deleteWorkout(index);

            }
          );


        table.appendChild(row);

      }
    );

  }


  /* =================================================
     DELETE WORKOUT
  ================================================= */

  function deleteWorkout(index) {

    const data =
      getDayData(currentDay);


    data.workouts.splice(
      index,
      1
    );


    saveData();

    displayWorkouts(data);

    displayHistory();

  }


  /* =================================================
     RUNNING
  ================================================= */

  if ($("saveRunBtn")) {

    $("saveRunBtn").addEventListener(
      "click",
      saveRun
    );

  }


  function saveRun() {

    const running =
      $("running")?.value || "NO";

    const kilometres =
      $("kilometres")?.value || 0;

    const time =
      $("runTime")?.value.trim() || "—";


    const data =
      getDayData(currentDay);


    data.running = {

      running: running,

      kilometres: kilometres,

      time: time

    };


    saveData();

    displayRunning(data);

    displayHistory();

  }


  /* =================================================
     DISPLAY RUNNING
  ================================================= */

  function displayRunning(data) {

    if (
      !data.running
    ) {

      if ($("runStatus"))
        $("runStatus").textContent = "—";

      if ($("runDistance"))
        $("runDistance").textContent = "—";

      if ($("runTimeDisplay"))
        $("runTimeDisplay").textContent = "—";

      return;

    }


    if ($("runStatus"))
      $("runStatus").textContent =
        data.running.running;


    if ($("runDistance"))
      $("runDistance").textContent =
        data.running.kilometres + " KM";


    if ($("runTimeDisplay"))
      $("runTimeDisplay").textContent =
        data.running.time;

  }


  /* =================================================
     DELETE RUN
  ================================================= */

  if ($("deleteRunBtn")) {

    $("deleteRunBtn").addEventListener(
      "click",
      function () {

        const data =
          getDayData(currentDay);

        data.running = null;

        saveData();

        displayRunning(data);

        displayHistory();

      }
    );

  }


  /* =================================================
     SLEEP
  ================================================= */

  if ($("saveSleepBtn")) {

    $("saveSleepBtn").addEventListener(
      "click",
      saveSleep
    );

  }


  function saveSleep() {

    const hours =
      $("sleepHours")?.value;

    const quality =
      $("sleepQuality")?.value ||
      "Not selected";


    if (!hours) {

      alert(
        "Enter your sleep hours."
      );

      return;

    }


    const data =
      getDayData(currentDay);


    data.sleep = {

      hours: hours,

      quality: quality

    };


    saveData();

    displaySleep(data);

    displayHistory();

  }


  /* =================================================
     DISPLAY SLEEP
  ================================================= */

  function displaySleep(data) {

    if (!data.sleep) {

      if ($("sleepDisplay"))
        $("sleepDisplay").textContent = "—";

      if ($("qualityDisplay"))
        $("qualityDisplay").textContent = "—";

      return;

    }


    if ($("sleepDisplay"))
      $("sleepDisplay").textContent =
        data.sleep.hours + " hours";


    if ($("qualityDisplay"))
      $("qualityDisplay").textContent =
        data.sleep.quality;

  }


  /* =================================================
     DELETE SLEEP
  ================================================= */

  if ($("deleteSleepBtn")) {

    $("deleteSleepBtn").addEventListener(
      "click",
      function () {

        const data =
          getDayData(currentDay);

        data.sleep = null;

        saveData();

        displaySleep(data);

        displayHistory();

      }
    );

  }


  /* =================================================
     COMPLETE DAY
  ================================================= */

  if ($("completeDayBtn")) {

    $("completeDayBtn").addEventListener(
      "click",
      function () {

        const data =
          getDayData(currentDay);

        data.completed =
          !data.completed;

        saveData();

        updateStatus(data);

        displayHistory();

        updateProgress();

      }
    );

  }


  /* =================================================
     HISTORY
  ================================================= */

  function displayHistory() {

    const history =
      $("historyGrid");

    if (!history) return;


    history.innerHTML = "";


    for (
      let day = 1;
      day <= TOTAL_DAYS;
      day++
    ) {

      const data =
        getDayData(day);

      const date =
        getDateForDay(day);


      const card =
        document.createElement("button");


      card.type = "button";

      card.className =
        "history-day";


      if (data.completed) {

        card.classList.add(
          "completed"
        );

      }


      if (day === currentDay) {

        card.classList.add(
          "active"
        );

      }


      let status = "○";


      if (data.completed) {

        status = "✓";

      } else if (

        data.workouts.length > 0 ||
        data.running ||
        data.sleep

      ) {

        status = "•";

      }


      card.innerHTML = `

        <span class="history-number">
          DAY ${day}
        </span>

        <span class="history-date">
          ${formatShortDate(date)}
        </span>

        <span class="history-status">
          ${status}
        </span>

      `;


      card.addEventListener(
        "click",
        function () {

          loadDay(day);

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

        }
      );


      history.appendChild(card);

    }

  }


  /* =================================================
     PROGRESS
  ================================================= */

  function updateProgress() {

    let completed = 0;


    for (
      let day = 1;
      day <= TOTAL_DAYS;
      day++
    ) {

      if (
        trackerData[day] &&
        trackerData[day].completed
      ) {

        completed++;

      }

    }


    const percentage =
      Math.round(
        completed /
        TOTAL_DAYS *
        100
      );


    if ($("progressFill")) {

      $("progressFill").style.width =
        percentage + "%";

    }


    if ($("progressPercent")) {

      $("progressPercent").textContent =
        percentage + "%";

    }


    if ($("progressText")) {

      $("progressText").textContent =
        completed +
        " of " +
        TOTAL_DAYS +
        " days completed";

    }

  }


  /* =================================================
     PREVIOUS
  ================================================= */

  if ($("previousBtn")) {

    $("previousBtn").addEventListener(
      "click",
      function () {

        if (currentDay > 1) {

          loadDay(
            currentDay - 1
          );

        }

      }
    );

  }


  /* =================================================
     NEXT
  ================================================= */

  if ($("nextBtn")) {

    $("nextBtn").addEventListener(
      "click",
      function () {

        if (
          currentDay < TOTAL_DAYS
        ) {

          loadDay(
            currentDay + 1
          );

        }

      }
    );

  }


  /* =================================================
     SETTINGS
  ================================================= */

  if ($("settingsBtn")) {

    $("settingsBtn").addEventListener(
      "click",
      function () {

        if (!profile) return;


        $("profileName").value =
          profile.name || "";

        $("startDate").value =
          profile.startDate || "";

        $("profileWeight").value =
          profile.weight || "";

        $("profileHeight").value =
          profile.height || "";


        trackerScreen.classList.add(
          "hidden"
        );

        setupScreen.classList.remove(
          "hidden"
        );


        startBtn.textContent =
          "SAVE SETTINGS 🔥";

      }
    );

  }


  /* =================================================
     RESET
  ================================================= */

  if ($("resetBtn")) {

    $("resetBtn").addEventListener(
      "click",
      function () {

        const answer =
          confirm(
            "RESET EVERYTHING?\n\n" +
            "All 30 days, workouts, " +
            "running and sleep data " +
            "will be deleted."
          );


        if (!answer) return;


        localStorage.removeItem(
          "dailyLevelUpProfile"
        );

        localStorage.removeItem(
          "dailyLevelUp30"
        );


        profile = null;

        trackerData = {};

        currentDay = 1;


        location.reload();

      }
    );

  }


  /* =================================================
     ESCAPE HTML
  ================================================= */

  function escapeHTML(text) {

    const div =
      document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

  }


  /* =================================================
     INITIAL SCREEN
  ================================================= */

  if (profile) {

    showTracker();

  } else {

    if (setupScreen)
      setupScreen.classList.remove(
        "hidden"
      );

    if (trackerScreen)
      trackerScreen.classList.add(
        "hidden"
      );

  }

});