const express = require("express");
const frb = require("./model/inscription");
const time = require("./config/date_conf");
const www = require("./firebase/firebaseconnection");
const app = express();
const helmet = require('helmet');
// const cors = require("cors");
const port = 3000;
app.use(helmet())
// try{app.use(
//   cors({
//     origin: "http://localhost:4200",
//   })
// );}catch{
//   console.log("error cors")
// }
app.get("/api", (req, res) => {
  res.send("Hello World!");
});
// to do the inscription client in the firabase
app.get("/api/inscription/:fname/:lname/:age/:ad/:tel/:Em", (req, res) => {
  www
    .inscription(
      req.params.fname,
      req.params.lname,
      req.params.age,
      req.params.ad,
      req.params.tel,
      req.params.Em
    )
    .then((z) => {
      res.status(200).json({ opp: z, rese: "yes" });
    })
    .catch(() => {
      res.status(200).json({ opp: "no affected", rese: "no" });
    });
});
app.get("/api/CheckUpdateInscription/:id_client/:id_bloc/:N_mounth", (req, res) => {
  www
    .searchForInscription(
      req.params.id_client,
      req.params.id_bloc,
      req.params.N_mounth
    )
    .then((a) => {
      res.status(200).json({ r: "yes", msg: a });
    })
    .catch((e) => {
      res.status(200).json({ r: "no", msg: e });
    });
});
// to regester the memeberchip of the client for a room of sport PS need to cheak if the client exist or not
app.get("/api/inscription_bloc/:id_client/:id_bloc/:num_mounth", (req, res) => {
  www
    .inscription_bloc(
      req.params.id_client,
      req.params.id_bloc,
      req.params.num_mounth
      //   req.params.end_mem,
    )
    .then((z) => {
      res.status(200).json({ opp: "yes" });
    })
    .catch(() => {
      res.status(200).json({ opp: "no" });
    });
});
// to cheack if the client can access to the room or not
app.get("/api/accessToRoom/:id_client/:id_bloc", (req, res) => {
  www
    .getToRoom(
      req.params.id_client,
      req.params.id_bloc
      //   req.params.end_mem,
    )
    .then((z) => {
      res.status(200).json({ r: "yes", congrat: z });
    })
    .catch((e) => {
      res.status(404).json({ r: "no", err: e });
    });
});
// to cheak if the client can access to the gym or not
app.get("/api/accessToGym/:id_client", (req, res) => {
  www
    .getToGym(
      req.params.id_client
      //   req.params.end_mem,
    )
    .then((z) => {
      // res.status(200).json({ congrat: z });
      res.redirect("/api/saveTimeEnter/" + req.params.id_client);
    })
    .catch((e) => {
      res.status(404).json({ r: "no", reponse: e });
    });
});
// to register the enter time to Gym of the client
app.get("/api/saveTimeEnter/:id_client", (req, res) => {
  www
    .insertTheInTime(req.params.id_client)
    .then((a) => {
      res.status(200).json({ r: "yes", reponse: a });
    })
    .catch((e) => {
      res.status(200).json({ r: "no", reponse: e });
    });
});
// get the list of the client inscripted
app.get("/api/allTheClientIns", (req, res) => {
  www
    .getTheClientListIns()
    .then((ree) => {
      res.status(200).json({ result: ree });
    })
    .catch((e) => {
      res.status(200).json({ result: e });
    });
});
// get info to one client by his id
app.get("/api/infoClientById/:idClient", (req, res) => {
  www
    .getTheClientById(req.params.idClient)
    .then((ree) => {
      res.status(200).json({ r: "yes", result: ree });
    })
    .catch((e) => {
      res.status(200).json({ r: "no", result: e });
    });
});
// to get the bloc registred by one client
app.get("/api/getBlocRegistredByOneClient/:idClient", (req, res) => {
  www
    .concatTheBlocWithTheClient(req.params.idClient)
    .then((ree) => {
      res.status(200).json({ r: "yes", result: ree });
    })
    .catch((e) => {
      res.status(200).json({ r: "no", result: e });
    });
});

// to fitsh the blocs
app.get("/api/getBlocs", (req, res) => {
  www
    .fitshTheBloc()
    .then((re) => {
      res.status(200).json({ r: "yes", list: re });
    })
    .catch((e) => {
      res.status(200).json({ r: "no", list: [] });
    });
});
app.get("/api/getPresent", (req, res) => {
  // console.log(time.dayWithoutTime());
  www
    .getRealClientPresent(time.dayWithoutTime())
    .then((re) => {
      res.status(200).json({ r: "yes", list: re });
    })
    .catch((e) => {
      res.status(200).json({ r: "no", list: [], e: e });
    });
});

// add a bloc
app.get("/api/addBloc/:name/:des", (req, res) => {
  www
    .addnewBloc(req.params.name, req.params.des)
    .then((r) => {
      res.status(200).json({ r: "yes" });
    })
    .catch((e) => {
      res.status(200).json({ r: "no" });
    });
});
// register the time of client leave in it
app.get("/api/saveTimLeave/:id_client", (req, res) => {
  www
    .insertTimeOut(req.params.id_client)
    .then((a) => {
      res.status(200).json({ reponse: a });
    })
    .catch((e) => {
      res.status(200).json({ reponse: e });
    });
});
app.get("/api/test", (req, res) => {
  www
    .getTheIdOfDay()
    .then((a) => {
      res.status(200).json({ reponse: a });
    })
    .catch((e) => {
      res.status(200).json({ reponse: e });
    });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
// rest to work on the access room of each client and the in out historic of each one
