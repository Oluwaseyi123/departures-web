<template>
  <main class="home-container">
    <div class="header">
      <img src="../assets/images/Departures.svg" alt="airplane icon" />
      <h1>Depatures</h1>
    </div>

    <section class="depatures-container">
      <ul class="responsive-table">
        <li class="table-header">
          <div class="col col-1">Departure Time</div>
          <div class="col col-2">City Name</div>
          <div class="col col-3">Code</div>
          <div class="col col-4">Airline</div>
          <div class="col col-5">Gate</div>
          <div class="col col-6">Status</div>
        </li>

        <p v-if="isErrorFetchingDeparture">Error Fetching departures</p>
        <template v-if="isLoading && departures.length === 0">
          <skeleton-loader></skeleton-loader>
        </template>

        <template v-else>
          <li
          class="table-row test"
          data-test="departures"
          v-for="departure in displayDeparture"
          :key="departure"
          @click="changeStatus(departure)"
        >
          <div class="col col-1 departure-time" data-label="Departure time">
            {{ departure.scheduledDepartureDateTime | convertDateTimetoTime() }}
          </div>
          <div class="col col-2" data-label="City Name">
            {{ departure.arrivalAirport.cityName }},
            {{ departure.arrivalAirport.countryName }}
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
          <div class="col col-6 departure-status" data-label="Status" >
          
            <div
              class="color-container"
              :class="showStatusColor(departure.status)"
            ></div>
            <p :class="showStatusColor(departure.status)" >{{ departure.status }}</p>
          </div>
        </li>
        </template>
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
    </section>

    <section class="form-container" id="form-container">
      <h1>Update Flight Status</h1>
      <p
        class="msg-p"
        v-if="notificationMsg !== ''"
        :class="[{ success: isSuccessful }, { error: !isSuccessful }]"
      >
        {{ notificationMsg }}
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
          <li class="change-status" v-if="Object.keys(this.currentFlight).length === 0">
            Pick a flight to change status
          </li>
          <template v-else>
            <li class="table-row update-flight__status">
            <div class="col col-1" data-label="Departure time">
              {{ currentFlight.scheduledDepartureDateTime | convertDateTimetoTime() }}
            </div>
            <div class="col col-2"  data-label="City Name"  v-if="currentFlight.arrivalAirport">
              {{ currentFlight.arrivalAirport.cityName }},
              {{ currentFlight.arrivalAirport.countryName }}
            </div>
            <div class="col col-3" data-label="Airline" v-if="currentFlight.airline" >
              {{ currentFlight.airline.name }}
            </div>

            <div class="col col-4" data-label="status">
              {{ currentFlight.status }}
            </div>

            <div class="col col-5" data-label="Update Status">
              <select name="update-status" id="update-status"  v-model="newStatus" >
                <option value="default" disabled selected hidden>New Status</option>
                <option  v-for="option in options" :key="option" :value="option">{{option}}</option>
              </select>
              <input type="text" name="othername" v-model="newStatusInput" v-if="newStatus === 'Other'" placeholder="Enter flight status"/>
            </div>
            <button class="col col-6 update-btn" @click="updateStatus(currentFlight)">
              Update Status
            </button>
          </li>
          </template>
         
        </ul>
      </div>
    </section>
  </main>
</template>

<script>
import SkeletonLoader from '@/components/SkeletonLoader.vue';

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
  components: { SkeletonLoader },
  data() {
    return {
      departures: [],
      displayDeparture: [],
      isLoading: false,
      customStyles,
      customLabels,
      currentFlight: {},
      newStatus:'default',
      newStatusInput: '',
      notificationMsg: '',
      isSuccessful: false,
      isErrorFetchingDepartures: false,
      options: ['Departed','Diverted','Delayed', 'Cancelled', 'Other'],
      reds: ['final', 'diverted', 'cancelled', 'delayed', 'hijacked']
    };
  },

  async created() {
    this.isLoading = true;
    const res = await fetch("https://6315ae3e5b85ba9b11e4cb85.mockapi.io/departures/Flightdata");
    if (res.status === 200) {
      const resJSON = await res.json();
      this.departures = resJSON.allDepartures;
      this.isLoading = false;
      this.isErrorFetchingDepartures = false;
    } else {
      this.isLoading = false;
      this.isErrorFetchingDepartures = true;
    }
  },

  filters: {
    convertDateTimetoTime(dateTime) {
      let newDate = new Date(dateTime);
      let time = newDate.toLocaleTimeString();
      time = time.substring(0, time.length - 3);
      time = time.replace(":", ".");
      return time;
    },
  },

  methods: {
    showStatusColor(status){
      if (status.toLocaleLowerCase().includes('departed') ) {
        return 'departed'
      }else if (status.toLocaleLowerCase().includes('departing')) {
        return 'departing'
      }else if (this.reds.some(red => status.toLocaleLowerCase().includes(red))) {
        return 'final'
      }else if (status.toLocaleLowerCase().includes('go to gate')) {
        return 'go-to-gate'
      }else if (status.toLocaleLowerCase().includes('wait')) {
        return 'wait-in-lounge'
      }else if (status.toLocaleLowerCase().includes('scheduled')) {
        return 'scheduled'
      }else {
        return 'extra'
      }
    },

    onChangePage(departure) {
      this.displayDeparture = departure;
    },

    changeStatus(departure) {
      this.currentFlight = departure;
      const element = document.getElementById("form-container");
      element.scrollIntoView({ behavior: "smooth" });
    },

    updateStatus(flight) {
      switch (this.newStatus) {
        case "default":
          this.clearMsg(false, 'Error updating flight status. Please pick a correct status' );
          break;

        case "Other":
          flight.status = this.newStatusInput;
          this.clearMsg(true, 'Flight status updated');
          break;

        default:
          flight.status = this.newStatus;
          this.clearMsg(true,  'Flight status updated');
      }
    },

    clearMsg(validity, msg) {
      this.isSuccessful = validity
      this.notificationMsg = msg
      setTimeout(() => {
        this.notificationMsg = '';
      }, 3000);
    },
  },
};
</script>

<style lang="scss">
  .departed {
    color: #D67B27;
    background-color: #D67B27;
  }
  .departing {
    color: #000000;
    background-color: #F5D836;
  }
  .final {
    color: #d8000c;
    background-color: #d8000c;
  }
  .go-to-gate{
    background-color: #3677F5;
    color: #000000;
  }

  .wait-in-lounge{
    background-color: pink;
  }
  .scheduled{
    background-color: #1EA945;
    color: #1EA945;
  }
  .extra{
    background-color: pink;
    color: #000000;
  }

.home-container {
  display: flex;
  flex-direction: column;
  background: linear-gradient(90deg, #464646 0%, #000000 100%);
  width: 90%;
  max-width: 1200px;
  margin: 4em auto;
  border-radius: 5px;

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
}

  .header {
  display: flex;
  background: radial-gradient(81.65% 10898.53% at 18.35% 50%,#ffef97 0%,#dfc42e 100% );
  padding: 20px 30px;
  img {
    margin-right: 30px;
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
        color: #ffffff;
        text-align: left;
        font-weight: 700;
        [data-label="City Name"],
        [data-label="Gate"] {
          color: #f5d836;
        }
        [data-label="Status"] {
          background-color: #ffffff;
          display: flex;
          align-items: center;
          padding: 10px 10px 10px 15px;
          border-radius: 0 20px 20px 0;
          position: relative;
          p{
            background-color: #ffffff;
          }
          div {
            width: 12px;
            height: 100%;
            position: absolute;
            left: 0;
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
      .col-1,
      .col-2, 
      .col-3, 
      .col-4, 
      .col-5, 
      .col-6 {
        flex-basis: 17%;
      }

      @media all and (max-width: 767px) {
        .table-header {
          display: none;
        }
        li {
          display: block;
        }
    
        .col {
          padding: 10px 0;
          &:before {
            color: white;
            padding-right: 10px;
            content: attr(data-label);
            text-align: right;
          }
        }
      }
    }
    .pagination {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      @media all and (max-width: 767px) {
       justify-content: center;
      }
    }
  }

  .form-container {
    margin-top: 3em;
    padding: 20px 0px;
    h1,
    p {
      padding: 0 30px;
      color: #ffffff;
    }
    p {
      color: #000000;
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
    input {
      border: none;
      border-bottom: 1px solid #dfc42e;
      outline: none;
      display: block;
      background-color: transparent;
      color: #ffffff;
      margin-top: 10px;
      padding: 5px;
    }
    .change-status {
      color: #ffffff;
    }
  }
</style>
