const datee = require("../config/date_conf");
const KKK = require("../firebase/firebaseconnection");
exports.inscription = (a, b, c, d, e) => {
  return new Promise((resolve, reject) => {
    // return_id_if_exist(a).catch((n)=>{
    console.log("slmslms");
    db.collection("Clinet")
      .add({
        Fname: a,
        Lname: b,
        age: c,
        adress: d,
        tel: e,
        enter_time: time.formatDate(new Date()),
      })
      .then((docRef) => {
        // console.log("Document written with ID: ", docRef.id);
        resolve(
          "operation affected under the id " +
            docRef.id +
            " check firebase cloud "
        );
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        reject("we have an error with the connection to the firebase cloud");
      });
    // }).then((ss)=>{
    // reject("")
    // })
    // resolve("data enter in firebase");
  });
};
exports.inscription_bloc = (a, b, end_mem) => {
  return new Promise((resolve, reject) => {
    // return_id_if_exist(a).catch((n)=>{
    console.log("slmslms");
    db.collection("enter_or_not")
      .add({
        id_client: a,
        id_bloc: b,
        end_memberchip: time.formatDate(new Date()),
      })
      .then((docRef) => {
        // console.log("Document written with ID: ", docRef.id);
        resolve(
          "operation affected under the id " +
            docRef.id +
            "the client now can access to the bloc id" +
            b
        );
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        reject("we have an error with the connection to the firebase cloud");
      });
    // }).then((ss)=>{
    // reject("")
    // })
    // resolve("data enter in firebase");
  });
};
