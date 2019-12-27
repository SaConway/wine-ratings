firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

new Vue({
  el: "#app",
  data: {
    wines: [],
    form: {
      name: null,
      kind: null,
      rate: null,
      price: null
    },
    showForm: false,
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

      if (!this.validate()) return;

      const img = this.$refs.imgFile.files[0];
      const storageRef = firebase.storage().ref("wine-images/" + img.name);
      const uploadTask = storageRef.put(img);

      uploadTask
        .on("state_changed", null, null, _ => {
          uploadTask.snapshot.ref.getDownloadURL().then(imgURL => {
            this.addWine(imgURL);
            this.resetForm();
            this.getWines();
          }); //getDownloadURL
        })
        .bind(this); //state_changed
    }, // add wine function
    addWine(imgURL) {
      db.collection("wines").add({
        name: this.form.name,
        kind: this.form.kind,
        rate: this.form.rate,
        price: this.form.price,
        img: imgURL
      });
    },
    validate() {
      return (
        this.form.name &&
        this.form.kind &&
        this.form.rate &&
        this.form.price &&
        this.$refs.imgFile.files[0]
      );
    },
    onCancel(event) {
      event.preventDefault();
      this.resetForm();
    },
    onShowForm() {
      this.showForm = true;
    },
    onFileChange() {
      this.fileName = this.$refs.imgFile.files[0].name;
    },
    resetForm() {
      this.form = {
        name: null,
        kind: null,
        rate: null,
        price: null
      };

      this.showForm = false;
      this.fileName = null;
    }
  }
});
