<template>
  <div class="home-container">
    <div class="header">
      <img src="../assets/images/Departures.svg" alt="" />
      <h1>Depatures</h1>
    </div>

    <div class="depatures-container">
      <ul class="responsive-table">
        <li class="table-header">
          <div class="col col-1">Departure Time</div>
          <div class="col col-2">City Name</div>
          <div class="col col-3">Code</div>
          <div class="col col-4">Airline</div>
          <div class="col col-5">Gate</div>
          <div class="col col-6">Status</div>
        </li>
        <div class="" v-if="isLoading">
          <li
            class="table-row skeleton"
            v-for="departure in 10"
            :key="departure"
          >
            <div class="col col-1" data-label="Departure time"></div>
            <div class="col col-2" data-label="City Name"></div>
            <div class="col col-3" data-label="Code"></div>
            <div class="col col-4" data-label="Airline"></div>
            <div class="col col-5" data-label="Gate"></div>
            <div class="col col-6"></div>
          </li>
        </div>

        <li
          class="table-row"
          v-else
          v-for="departure in displayDep"
          :key="departure"
          @click="changeStatus(departure)"
        >
          <div class="col col-1" data-label="Departure time">
            {{ departure.scheduledDepartureDateTime | convertDateTimetoTime() }}
          </div>
          <div class="col col-2" data-label="City Name">
            {{ departure.arrivalAirport.cityName }}
          </div>
          <div class="col col-3" data-label="Code">
            {{ departure.airline.code }}
          </div>
          <div class="col col-4" data-label="Airline">
            {{ departure.airline.name }}
          </div>
          <div
            class="col col-5"
            data-label="Gate"
            v-if="departure.departureGate"
          >
            {{ departure.departureGate.number }}
          </div>
          <div class="col col-5" data-label="Gate" v-else></div>
          <div class="col col-6" data-label="Status">
            <!-- {{ departure.status | showCorrectStatusColor() }} -->
            {{ showCorrectStatusColor(departure.status) }}
          </div>
        </li>
      </ul>
      <div class="pagination">
        <jw-pagination
          :items="departures"
          :maxPages="30"
          @changePage="onChangePage"
          :styles="customStyles"
          :labels="customLabels"
        ></jw-pagination>
      </div>
    </div>

    <div class="form-container">
      <h1>Update Flight Status</h1>
      <p
        v-if="notificationMessage !== ''"
        :class="[{ success: isSuccessful }, { error: !isSuccessful }]"
      >
        {{ notificationMessage }}
      </p>
      <div class="depatures-container">
        <ul class="responsive-table">
          <li class="table-header">
            <div class="col col-1">Departure Time</div>
            <div class="col col-2">City Name</div>
            <div class="col col-3">Airline</div>
            <div class="col col-4">Current Status</div>
            <div class="col col-5">Update Status</div>
            <div class="col col-6"></div>
          </li>

          <div class=""  v-if="Object.keys(this.currentFlight).length == 0 ">
           <h4>Pick a flight to change status</h4>
          </div>

          <li class="table-row" v-else>
            <div class="col col-1" data-label="Departure time">
              {{
                currentFlight.scheduledDepartureDateTime
                  | convertDateTimetoTime()
              }}
            </div>
            <div
              class="col col-2"
              data-label="City Name"
              v-if="currentFlight.arrivalAirport"
            >
              {{ currentFlight.arrivalAirport.cityName }}
            </div>
            <div
              class="col col-3"
              data-label="Airline"
              v-if="currentFlight.airline"
            >
              {{ currentFlight.airline.name }}
            </div>

            <div class="col col-4" data-label="status">
              {{ currentFlight.status }}
            </div>

            <div class="col col-5" data-label="Update Status">
              <select
                name="update-status"
                id="update-status"
                v-model="newStatus"
              >
                <option value="default" default>New Status</option>
                <option value="Departed">Departed</option>
                <option value="Diverted">Diverted</option>
                <option value="Delayed">Delayed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <button class="col col-6" @click="updateStatus(currentFlight)">
              Update Status
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
const customStyles = {
  ul: {
    display: "flex",

    width: "100%",
  },
  li: {
    display: "inline-block",
    backgroundColor: "#dfc42e",
  },

  a: {
    color: "black",
    fontWeight: "700",
  },
};

const customLabels = {
  first: "",
  last: "",
  previous: "<",
  next: ">",
};

export default {
  name: "HomePage",
  data() {
    return {
      departures: [],
      displayDep: [],
      statusColor: "",
      isLoading: false,
      isActive: true,
      customStyles,
      customLabels,
      currentFlight: {},
      newStatus: "default",
      notificationMessage: "",
      notificationColor: "",
      isSuccessful: false,
    };
  },

  async created() {
    this.isLoading = true;
    const res = await fetch(
      "https://6315ae3e5b85ba9b11e4cb85.mockapi.io/departures/Flightdata"
    );
    const resJSON = await res.json();
    this.departures = resJSON.allDepartures;
    this.isLoading = false;
    this.showCorrectStatusColor();
  },
  computed: {
    getFirstTwentyDepartures() {
      return this.departures.slice(0, 10);
    },
  },
  filters: {
    convertDateTimetoTime(dateTime) {
      let newDate = new Date(dateTime);
      let time = newDate.toLocaleTimeString();
      return time;
    },
  },

  methods: {
    showCorrectStatusColor(status) {
      if (status.toLocaleLowerCase().includes("final call")) {
        this.statusColor = "pink";
        //return status
      }
      if (status.toLocaleLowerCase().includes("go to gate")) {
        //this.statusColor = 'red'
      } else if (status.toLocaleLowerCase().includes("departing at")) {
        // console.log("detarting at");
      } else {
        // console.log(status);
      }

      return status;
    },

    onChangePage(departure) {
      this.displayDep = departure;
    },

    changeStatus(departure) {
      this.currentFlight = departure;
    },

    updateStatus(flight) {
      if (this.newStatus === "default") {
        this.notificationMessage =
          "Error updating flight status. Please pick a correct status";
        this.isSuccessful = false;
        setTimeout(() => {
          this.notificationMessage = "";
        }, 3000);
      } else {
        flight.status = this.newStatus;
        this.notificationMessage = "Flight status updated";
        this.notificationColor = "green";
        this.isSuccessful = true;

        setTimeout(() => {
          this.notificationMessage = "";
        }, 3000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: auto;
  background: linear-gradient(90deg, #464646 0%, #000000 100%);
  width: 90%;
  max-width: 1200px;
  margin: 4em auto;
  border-radius: 5px;

  .header {
    display: flex;
    background: radial-gradient(
      81.65% 10898.53% at 18.35% 50%,
      #ffef97 0%,
      #dfc42e 100%
    );
    padding: 20px 30px;
    img {
      margin-right: 30px;
    }
  }

  @keyframes skeleton-loading {
    0% {
      border: 2px solid hsl(200, 20%, 70%);
    }
    100% {
      border: 2px solid hsl(200, 20%, 95%);
    }
  }

  @keyframes skeleton-loading-div {
    0% {
      background-color: hsl(200, 20%, 70%);
    }
    100% {
      background-color: hsl(200, 20%, 95%);
    }
  }

  .depatures-container {
    padding: 10px 30px;
    .responsive-table {
      .skeleton {
        animation: skeleton-loading 0.5s linear infinite alternate;
        div {
          margin-right: 10px;
          padding: 10px;
          animation: skeleton-loading-div 0.5s linear infinite alternate;
        }
      }
      li {
        border-radius: 10px;
        padding: 25px 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 25px;
      }
      .table-header {
        font-weight: 700;
        letter-spacing: 0.03em;
        background: linear-gradient(90deg, #ffffff 0%, #aebcca 100%);
        border-radius: 10px;
      }
      .table-row {
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.1);
        color: white;
        text-align: left;
        font-weight: 700;
        [data-label="City Name"],
        [data-label="Gate"] {
          color: #f5d836;
        }
        [data-label="Status"] {
          background-color: white;
          color: black;
          display: flex;
          align-items: center;
          padding: 10px 10px 10px 15px;
          border-radius: 0 20px 20px 0;
          position: relative;
          &:before {
            content: "";
            position: absolute;
            width: 10px;
            height: 100%;
            background-color: v-bind(statusColor);
            left: 0;
            border-radius: 0 -5px -5px 0;
          }
        }
        button {
          width: 100%;
          padding: 10px;
          text-align: center;
          background-color: #f5d836;
          border: none;
          font-weight: 700;
          cursor: pointer;
        }
      }
      .col-1 {
        flex-basis: 17%;
      }
      .col-2 {
        flex-basis: 17%;
      }
      .col-3 {
        flex-basis: 17%;
      }
      .col-4 {
        flex-basis: 17%;
      }
      .col-5 {
        flex-basis: 17%;
      }
      .col-6 {
        flex-basis: 17%;
      }

      @media all and (max-width: 767px) {
        .table-header {
          display: none;
        }
        .table-row {
        }
        li {
          display: block;
        }
        .col {
          flex-basis: 100%;
        }
        .col {
          //  display: flex;
          padding: 10px 0;
          &:before {
            color: #6c7a89;
            padding-right: 10px;
            content: attr(data-label);
            flex-basis: 50%;
            text-align: right;
          }
        }
      }
    }
    .pagination {
      display: flex;
      // align-items: center;
      justify-content: end;
      width: 100%;
      // max-width: 400px;
      @media all and (max-width: 767px) {
      }
    }
  }

  .form-container {
    // background-color: white;
    margin-top: 3em;
    padding: 20px 0px;
    h1,
    p {
      padding: 0 30px;
      color: white;
    }
    p {
      // background-color: pink;
      color: black;
      font-weight: 700;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      padding: 10px;
      text-align: center;
    }
    .success {
      color: #270;
      background-color: #dff2bf;
    }
    .error {
      color: #d8000c;
      background-color: #ffbaba;
    }
    select {
      border: 2px solid white;
      outline: none;
      background-color: transparent;
      width: 90%;
      font-weight: 700;
      padding: 5px;
      color: white;
    }
    h4{
      color: white;
    }
  }
}
</style>
