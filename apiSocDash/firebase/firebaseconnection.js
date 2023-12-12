const firebase = require("firebase");
const app = require("express");
const time = require("../config/date_conf");
const { get } = require("express/lib/response");
const ser = app();
// ser.use(app.bodyParser());
ser.use(app.json());

const firebaseConfig = {
  apiKey: "AIzaSyDshWmD1lUXX3BKpQrkjzQVN4CzBuMnM2c",
  authDomain: "soc-1-82d16.firebaseapp.com",
  projectId: "soc-1-82d16",
  storageBucket: "soc-1-82d16.appspot.com",
  messagingSenderId: "472670886997",
  appId: "1:472670886997:web:9b6636b09397078baf88dc"
};
// console.log("slmslm");
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// const AAA = db.collection("present");
// module.exports = db;
// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
return_id_if_exist = (a) => {
  return new Promise(async (resolve, reject) => {
    var ids = [];
    var l = await db.collection("present").get();
    // var data = [];
    var l1 = l.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // console.log(l1);
    // console.log(data);
    let i = 0;
    while (i < l1.length && l1[i].id_client != a) {
      i++;
      // console.log(i);
    }
    if (i >= l1.length) {
      reject("the client has the id " + a + " is not exist");
    } else {
      resolve(l1[i].id);
    }
  });
};
getTheIdOfDay = (a) => {
  return new Promise(async (resolve, reject) => {
    const l = await db.collection("daily_his").where("day", "==", a).get();
    const l1 = l.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // console.log(l1);
    // console.log(l1[0].id);
    if (l1.length != 0) {
      resolve(l1[0].id);
    } else {
      reject("there is an error");
    }
  });
};
getRealClientPresent = (a) => {
  return new Promise(async (resolve, reject) => {
    getCientPresent(a)
      .then(async (r) => {
        let ids = [];
        for (i = 0; i < r.length; i++) {
          ids.push(r[i].id_client);
        }
        // console.log(ids);
        // const collectionRef = db.collection("Client");

        const l = await db
          .collection("Client")
          // .whereIn(admin.firestore.FieldPath.documentId(), ids)
          .get();
        const l1 = l.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        let ss = [];
        for (i = 0; i < l1.length; i++) {
          k = 0;
          while (k < ids.length && ids[k] != l1[i].id) {
            k++;
          }
          if (k < ids.length) {
            ss.push(l1[i]);
          }
        }
        if (ss.length == 0) {
          reject(ss);
        } else {
          resolve(ss);
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
};
getAllBlocs = () => {
  return new Promise(async (resolve, reject) => {
    const collectionRef = db.collection("Bloc");
    const l = await collectionRef
      // .where("id_client", "==", id_client)
      // .where("id_day", "==", idDay)
      .get();
    const l1 = l.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (l1.length == 0) {
      reject([]);
    } else {
      resolve(l1);
    }
  });
};
addnewBloc = (name, des) => {
  return new Promise(async (resolve, reject) => {
    await db
      .collection("Bloc")
      .add({
        Name: name,
        Description: des,
      })
      .then((docRef) => {
        // console.log("Document written with ID: ", docRef.id);
        resolve("operation affected under the id " + docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        reject("we have an error with the connection to the firebase cloud");
      });
  });
};
getCientPresent = (a) => {
  return new Promise((resolve, reject) => {
    // console.log("slmsl1");
    getTheIdOfDay(a)
      .then(async (id) => {
        // console.log("slmsl1");
        console.log(id);
        const l = await db
          .collection("time")
          .where("id_day", "==", id)
          .where("leave_time", "==", null)
          .get();
        const l1 = l.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        resolve(l1);
      })
      .catch((l) => {
        console.log("slmsl21");
        reject(l);
      });
  });
};
getTheClientListIns = () => {
  return new Promise(async (resolve, reject) => {
    const l = await db.collection("Client").get();
    const l1 = l.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (l1.length != 0) {
      resolve(l1);
    } else {
      reject("their is no inscription");
    }
  });
};
getTheClientById = (id) => {
  return new Promise(async (resolve, reject) => {
    const l = await db
      .collection("Client")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve({ id: doc.id, ...doc.data() });
          // console.log(doc.data()); // outputs the document data
        } else {
          reject("there is no client with this id");
        }
      });
  });
};
searchIdTimeIn = (id_client) => {
  return new Promise(async (resolve, reject) => {
    getTheIdOfDay(time.dayWithoutTime()).then(async (idDay) => {
      const collectionRef = db.collection("time");
      const l = await collectionRef
        .where("id_client", "==", id_client)
        .where("id_day", "==", idDay)
        .get();
      const l1 = l.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (l1.length == 0) {
        reject("we have an error in the prevously connection");
      } else {
        resolve(l1[0].id);
      }
    });
  });
};
insertTimeOut = (id_client) => {
  return new Promise((resolve, reject) => {
    searchIdTimeIn(id_client)
      .then(async (rep) => {
        const collectionRef = db.collection("time");
        const query2 = collectionRef.doc(rep);
        await query2
          .update({
            leave_time: time.formatDate(new Date()).slice(11),
          })
          .then(() => {
            resolve("operation affected with succes");
          })
          .catch((error) => {
            reject("there is an error to connect to the firebase");
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
};
insertTheInTime = (id_client) => {
  return new Promise(async (resolve, reject) => {
    getTheIdOfDay(time.dayWithoutTime())
      .then((idDay) => {
        db.collection("time")
          .add({
            id_client: id_client,
            enter_time: time.formatDate(new Date()).slice(11),
            id_day: idDay,
            leave_time: null,
          })
          .then((docRef) => {
            // console.log("Document written with ID: ", docRef.id);
            resolve(
              "operation affected under the id " +
                docRef.id +
                " check firebase cloud the time of " +
                id_client +
                " in is saved"
            );
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
            reject(
              "we have an error with the connection to the firebase cloud"
            );
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
};
getToGym = (id) => {
  return new Promise(async (resolve, reject) => {
    const collectionRef = db.collection("enter_or_not");

    const query = collectionRef.where("id_client", "==", id);
    const data = [];
    await query
      .get()
      .then((querySnapshot) => {
        // Handle the retrieved data here
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        console.log(data);
        if (data.length == 0) {
          reject("their is no client with this is");
        } else {
          let i = 0;
          let n = data.length;
          let dateNow = new Date(time.formatDate(new Date()));
          while (i < n && dateNow > new Date(data[i].end_memberchip)) {
            i++;
          }
          if (i >= n) {
            // const date2 = new Date();
            reject("can not access to to the Gym");
          } else {
            resolve(data);
          }
        }
      })
      .catch((error) => {
        // Handle errors here
        console.error(error);
        reject(error);
      });
  });
};
getToRoom = (client, b) => {
  return new Promise(async (resolve, reject) => {
    const collectionRef = db.collection("enter_or_not");

    const query = collectionRef
      .where("id_bloc", "==", b)
      .where("id_client", "==", client);
    const data = [];
    await query;
    query
      .get()
      .then((querySnapshot) => {
        // Handle the retrieved data here
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        if (data.length == 0) {
          reject("can not access");
        } else {
          let dateEnd = new Date(data[0].end_memberchip);
          let dateNow = new Date(time.formatDate(new Date()));
          if (dateEnd > dateNow) {
            resolve(data);
          } else {
            reject("can not access");
          }
        }
      })
      .catch((error) => {
        // Handle errors here
        console.error(error);
        reject(error);
      });
  });
};
leave_form_the_firebase_pr = (id) => {
  return new Promise(async (resolve, reject) => {
    await db
      .collection("present")
      .doc(id)
      .delete()
      .then((zz) => {
        resolve("deleted");
      })
      .catch((zz1) => {
        reject("we can not deleted");
      });
  });
};
enter_to_firebase_pre = (a) => {
  return new Promise((resolve, reject) => {
    // return_id_if_exist(a).catch((n)=>{

    db.collection("present")
      .add({
        id_client: a,
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
testF = (a) => {
  // console.log(a);
  // console.log(
  //   testString(a.fname) &&
  //     a.age != "" &&
  //     testString(a.lname) &&
  //     typeof parseInt(a.age) == typeof 1 &&
  //     typeof parseInt(a.Tel) == typeof 1 &&
  //     parseInt(a.age) < 90 &&
  //     a.Tel.length > 7 &&
  //     parseInt(a.Tel) > 0 &&
  //     parseInt(a.age) > 0 &&
  //     a.Tel != ""
  // );
  return (
    testString(a.fname) &&
    // a.age != "" &&
    testString(a.lname) &&
    // typeof parseInt(a.age) == typeof 1 &&
    typeof parseInt(a.Tel) == typeof 1 &&
    // parseInt(a.age) < 90 &&
    a.Tel.length > 7 &&
    parseInt(a.Tel) > 0 &&
    // parseInt(a.age) > 0 &&
    a.Tel != ""
  );
};
fitshTheBloc = () => {
  return new Promise(async (resolve, reject) => {
    // var ids = [];
    var l = await db.collection("Bloc").get();
    // var data = [];
    var l1 = l.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // console.log(l1);
    if (l1.length == 0) {
      reject("no bloc");
    } else {
      resolve(l1);
    }
  });
};
fitshTheBlocById = (id) => {
  return new Promise(async (resolve, reject) => {
    // var ids = [];
    var l = await db
      .collection("Bloc")
      .doc(id)
      .get()
      .then((doc) => {
        // if (doc.exists) {
        // console.log({ id: doc.id, ...doc.data() });
        resolve({ id: doc.id, ...doc.data() });
        // console.log(doc.data()); // outputs the document data
        // } else {
        // }
      })
      .catch((e) => {
        reject("there is no client with this id");
      });
    // console.log(l);
    // const l1 = l.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // if (l1.length != 0 && l1.length == 1) {
    //   resolve(l1[0]);
    // } else {
    //   reject("no bloc with this id");
    // }
  });
};
addtable = (a, b) => {
  return new Promise((resolve, reject) => {
    a.push(b);
    // console.log("wwwwwwwwwwwwwwwwwwwwwww");
    resolve(a);
  });
};
concatTheBlocWithTheClient = (id) => {
  return new Promise(async (resolve, reject) => {
    // var ids = [];
    var l = await db
      .collection("enter_or_not")
      .where("id_client", "==", id)
      .get();
    const l1 = l.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // console.log(l1);
    // var l = await db
    //   .collection("enter_or_not")
    //   .where("id_client", "==", id)
    //   .get()
    //   .then((doc) => {
    // console.log(doc);
    if (l1.length != 0) {
      // console.log("i'm here");
      // const l1 = l.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // console.log(l1);
      let oneCol = {
        id_bloc: String,
        id_client: String,
        end_memberchip: String,
        Name: String,
        Description: String,
      };
      let res1 = [
        // {
        //   id_bloc: String,
        //   id_client: String,
        //   end_memberchip: String,
        //   Name: String,
        //   Description: String,
        //   re: Boolean,
        // },
      ];
      // console.log("slmsms");
      for (let i = 0; i < l1.length; i++) {
        await fitshTheBlocById(l1[i].id_bloc)
          .then(async (d) => {
            // console.log(l1[i]);
            // console.log(d);
            addtable(res1, {
              id_bloc: d.id,
              id_client: l1[i].id_client,
              end_memberchip: l1[i].end_memberchip,
              Name: d.Name,
              Description: d.Description,
              re: true,
            }).then((p) => {
              res1 = p;
            });

            // res1.push({
            //   id_bloc: d.id.toString(),
            //   id_client: l1[i].id_client.toString(),
            //   end_memberchip: l1[i].end_memberchip.toString(),
            //   Name: d.Name.toString(),
            //   Description: d.Description.toString(),
            //   re: true,
            // });
            // console.log(res1);
          })
          .catch((e) => {
            console.log(e);
            oneCol.re = false;
          });
        // if (oneCol.re == true) {
        //   res.push(oneCol);
        // }
      }
      // console.log("aaaa");
      resolve(res1);
    } else {
      reject("there in no one with this id");
    }
    // })
    // .catch((e) => {
    //   reject("no bloc with this id");
    // });
    // var data = [];
  });
};
testString = (w) => {
  let i = 0;
  let n = w.length;
  while (
    i < n &&
    w[i] in ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] == false
  ) {
    i++;
  }
  return i >= n;
};
inscription = (a, b, c, d, e, f) => {
  return new Promise((resolve, reject) => {
    // return_id_if_exist(a).catch((n)=>{
    // console.log("slmslms");
    if (testF({ fname: a, lname: b, Email: f, age: c, adress: d, Tel: e })) {
      db.collection("Client")
        .add({
          Fname: a,
          Lname: b,
          birthday: c,
          adress: d,
          tel: e,
          enter_time: time.formatDate(new Date()),
          Email: f,
        })
        .then((docRef) => {
          // console.log("Document written with ID: ", docRef.id);
          resolve(docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
          reject("no id");
        });
    } else {
      reject("no id");
    }
    // }).then((ss)=>{
    // reject("")
    // })
    // resolve("data enter in firebase");
  });
};
searchForInscription = (a, b, c) => {
  return new Promise(async (resolve, reject) => {
    const l = await db
      .collection("enter_or_not")
      .where("id_client", "==", a)
      .where("id_bloc", "==", b)
      .get();
    const l1 = l.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(l.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    if (l1.length == 0) {
      console.log("bloc not exist");
      inscription_bloc(a, b, c)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    } else {
      console.log("affect the update");
      let lastIns = new Date(l1[0].end_memberchip).getTime();
      let now = new Date(time.formatDate(new Date())).getTime();
      if (lastIns < now) {
        newDate = time.addMonth(parseInt(c));
      } else {
        newDate = time.addMonthToMyDate(parseInt(c), l1[0].end_memberchip);
      }
      UpdatInscription_bloc(l1[0].id, newDate)
        .then((r0) => {
          resolve(r0);
        })
        .catch((e0) => {
          reject(e0);
        });
    }
    // resolve("a");
  });
};
UpdatInscription_bloc = (id, c) => {
  return new Promise(async (resolve, reject) => {
    const collectionRef = db.collection("enter_or_not");
    const query2 = collectionRef.doc(id);
    await query2
      .update({
        end_memberchip: c,
      })
      .then(() => {
        resolve("operation affected with succes");
      })
      .catch((error) => {
        reject("there is an error to connect to the firebase");
      });
    // return_id_if_exist(a).catch((n)=>{
    // console.log("slmslms");
    // }).then((ss)=>{
    // reject("")
    // })
    // resolve("data enter in firebase");
  });
};
inscription_bloc = (a, b, c) => {
  return new Promise((resolve, reject) => {
    let p = time.addMonth(parseInt(c));
    // return_id_if_exist(a).catch((n)=>{
    // console.log("slmslms");
    db.collection("enter_or_not")
      .add({
        id_client: a,
        id_bloc: b,
        // end_memberchip: end_mem,
        end_memberchip: p,
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

module.exports = {
  inscription_bloc,
  inscription,
  enter_to_firebase_pre,
  return_id_if_exist,
  leave_form_the_firebase_pr,
  getToGym,
  getToRoom,
  getTheIdOfDay,
  insertTheInTime,
  insertTimeOut,
  getTheClientListIns,
  getTheClientById,
  fitshTheBloc,
  getCientPresent,
  getRealClientPresent,
  addnewBloc,
  concatTheBlocWithTheClient,
  searchForInscription,
};
