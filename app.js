const firebaseConfig = {
  apiKey: "AIzaSyBNu-fqk3LCoAzuLRlFWiLGZQT4q2TuKNU",
  authDomain: "wine-ratings-9e466.firebaseapp.com",
  databaseURL: "https://wine-ratings-9e466.firebaseio.com",
  projectId: "wine-ratings-9e466",
  storageBucket: "wine-ratings-9e466.appspot.com",
  messagingSenderId: "79568498449",
  appId: "1:79568498449:web:7cb72b478b66d3e2cea6b0",
  measurementId: "G-85N6ND361L"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

new Vue({
  el: "#app",
  data: {
    wines: [],
    showForm: false,
    form: {
      name: null,
      kind: null,
      rate: null,
      price: null
    },
    fileName: null
  },
  mounted() {
    this.getWines();
  },
  methods: {
    getWines() {
      let wines = [];

      db.collection("wines")
        .orderBy("rate", "desc")
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            wines.push(doc.data());
          });

          this.wines = wines;
        });
    },
    onAddWine(event) {
      event.preventDefault();

      const img = this.$refs.imgFile.files[0];

      const storageRef = firebase.storage().ref("wine-images/" + img.name);

      var uploadTask = storageRef.put(img);

      uploadTask
        .on("state_changed", null, null, _ => {
          uploadTask.snapshot.ref.getDownloadURL().then(imgURL => {
            if (
              this.form.name &&
              this.form.kind &&
              this.form.rate &&
              this.form.price
            ) {
              db.collection("wines").add({
                name: this.form.name,
                kind: this.form.kind,
                rate: this.form.rate,
                price: this.form.price,
                img: imgURL
              });

              this.form = {
                name: null,
                kind: null,
                rate: null,
                price: null
              };

              this.showForm = false;
              this.fileName = null;

              this.getWines();
            }
          }); //getDownloadURL
        })
        .bind(this); //state_changed
    }, // add wine function
    onCancel(event) {
      event.preventDefault();
      this.showForm = false;
      this.fileName = null;
    },
    onShowForm() {
      this.showForm = true;
    },
    onFileChange() {
    console.log("Log: onFileChange -> event", this.$refs.imgFile.files[0].name);
        this.fileName = this.$refs.imgFile.files[0].name;
    }
  }
});
