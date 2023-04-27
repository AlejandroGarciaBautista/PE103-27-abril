import express from "express";
import { Respuesta } from "./Respuesta.js";
import { MongoClient } from "mongodb";
import { FunkoInterface } from "./Funko.js";

const app = express();

const dbURL = 'mongodb://127.0.0.1:27017'
const dbName = 'funkos'

/* Se recibe una petición de tipo post (añadir un funko) */
app.post('/funkos', (req, res) => {
  let funcionEjecutada: boolean = false;
  if (!req.query.usuario || !req.query.id || !req.query.nombre ||!req.query.desc || !req.query.tipo || !req.query.genero || !req.query.franquicia || !req.query.numero || !req.query.exclusivo || !req.query.caracteristica_esp || !req.query.valor ) {
    const mensaje: Respuesta = {
      resultado: false,
      respuesta: "Faltan parametros o hay parametros no validos"
    }
    res.status(500).send(mensaje)
  } else { /* Si no faltan parametros */
    if (!funcionEjecutada) {
      funcionEjecutada = true
      setTimeout(() => {
        MongoClient.connect(dbURL).then((client) => {
          const db = client.db(dbName)
          return db.collection<FunkoInterface>(`${req.query.usuario as string}`).findOne({
            id: parseInt(req.query.id as string)
          })
        }).then((result) => {
          if (result != null) {
            const respuesta: Respuesta = {
              resultado: false,
              respuesta: "El Funko existe en tu colección"
            }
            res.status(500).send(respuesta)
          } else {
            MongoClient.connect(dbURL).then((client) => {
              const db = client.db(dbName)
              return db.collection<FunkoInterface>(`${req.query.usuario as string}`).insertOne({
                id: parseInt(req.query.id as string),
                nombre: req.query.nombre as string,
                desc: req.query.desc as string,
                tipo: req.query.tipo as string,
                genero: req.query.genero as string,
                franquicia: req.query.franquicia as string,
                numero: parseInt(req.query.numero as string),
                exclusivo: (req.query.exclusivo as unknown) as boolean,
                caracteristica_esp: req.query.caracteristica_esp as string,
                valor: parseInt(req.query.valor as string)
              });
            }).then((result) => {
              const respuesta: Respuesta = {
                resultado: true,
                respuesta: "Funko añadido a tu colección"
              }
              res.status(200).send(respuesta);
            }).catch((error) => {
              res.status(500).send(error);
            })
          }
        }).catch((error) => {
          res.status(500).send(error)
        })
        funcionEjecutada = false
      }, 2000)
    }
  }
})

/* Se recibe una petición de tipo patch (modificar un funko), funciona de igual manera que el post a diferencia 
   del método que se usa que en vez de ser añadirFunko es modificarFunko*/
app.patch('/funkos', (req, res) => {
  let funcionEjecutada: boolean = false;
  if (!req.query.usuario || !req.query.id || !req.query.nombre ||!req.query.desc || !req.query.tipo || !req.query.genero || !req.query.franquicia || !req.query.numero || !req.query.exclusivo || !req.query.caracteristica_esp || !req.query.valor ) {
    const mensaje: Respuesta = {
      resultado: false,
      respuesta: "Faltan parametros o hay parametros no validos"
    }
    res.status(500).send(mensaje)
  } else {
    if (!funcionEjecutada) {
      funcionEjecutada = true
      setTimeout(() => {
        MongoClient.connect(dbURL).then((client) => {
          const db = client.db(dbName)
          return db.collection<FunkoInterface>(`${req.query.usuario as string}`).updateOne({
            id: parseInt(req.query.id as string),
          }, {
            $set: {
              nombre: req.query.nombre as string,
              desc: req.query.desc as string,
              tipo: req.query.tipo as string,
              genero: req.query.genero as string,
              franquicia: req.query.franquicia as string,
              numero: parseInt(req.query.numero as string),
              exclusivo: (req.query.exclusivo as unknown) as boolean,
              caracteristica_esp: req.query.caracteristica_esp as string,
              valor: parseInt(req.query.valor as string)
            },
          });
        }).then((result) => {
          if (result.modifiedCount === 1) {
            const respuesta: Respuesta = {
              resultado: true,
              respuesta: "Funko modificado correctamente"
            }
            res.status(200).send(respuesta)
          } else {
            const respuesta: Respuesta = {
              resultado: false,
              respuesta: "Error al modificar el funko, posiblemente no exista en tu colección"
            }
            res.status(500).send(respuesta)
          }
        }).catch((error) => {
          res.status(500).send(error);
        })
        funcionEjecutada = false
      }, 2000)
    }
  }
});

/* Se recibe una petición de tipo delete (eliminar un funko) */
app.delete('/funkos', (req, res) => {
  let funcionEjecutada: boolean = false;
  if (!req.query.usuario || !req.query.id) { /* Faltan parametros */
    const mensaje: Respuesta = {
      resultado: false,
      respuesta: "Faltan parametros o hay parametros no validos"
    }
    res.status(500).send(mensaje)
  } else { /* Se tienen todos lo parametros */
    if (!funcionEjecutada) {
      funcionEjecutada = true
      setTimeout(() => {
        MongoClient.connect(dbURL).then((client) => {
          const db = client.db(dbName)
          return db.collection<FunkoInterface>(`${req.query.usuario as string}`).deleteOne({
            id: parseInt(req.query.id as string)
          });
        }).then((result) => {
          if (result.deletedCount === 1) {
            const respuesta: Respuesta = {
              resultado: true,
              respuesta: "Funko eliminado"
            }
            res.status(200).send(respuesta)
          } else {
            const respuesta: Respuesta = {
              resultado: false,
              respuesta: "Error al eliminar el Funko"
            }
            res.status(500).send(respuesta)
          }
        }).catch((error) => {
          res.status(500).send(error);
        })
        funcionEjecutada = false
      }, 2000)
    }
  }
})

/* Se recibe una petición de tipo get (obtener informacion de un funko o todos) */
app.get('/funkos', (req, res) => {
  const idFunko = req.query.id
  let funcionEjecutada: boolean = false;
  const informacion: string[] = [];
  if (!req.query.usuario) { /* Faltan parametros */
    const mensaje: Respuesta = {
      resultado: false,
      respuesta: "Faltan parametros o hay parametros no validos"
    }
    res.status(500).send(mensaje)
  } else { /* Se tienen todos los paremetros */
    if (!funcionEjecutada) {
      funcionEjecutada = true
      setTimeout(() => {
        MongoClient.connect(dbURL).then((client) => {
          const db = client.db(dbName)
          return db.collection<FunkoInterface>(`${req.query.usuario as string}`).findOne({
            id: parseInt(req.query.id as string)
          });
        }).then((result) => {
          if (result === null) {
            res.status(500).send()
          } else {
            res.status(200).send(result)
          }
        }).catch((error) => {
          res.status(500).send();
        })
        funcionEjecutada = false
      }, 2000)
    }
  }
})

/* Se recibe una petición de tipo post si especificar la ruta correcta */
app.post('*', (_, res) => {
  res.status(404).send();
})

/* Se recibe una petición de tipo delete si especificar la ruta correcta */
app.delete('*', (_, res) => {
  res.status(404).send();
})

/* Se recibe una petición de tipo patch si especificar la ruta correcta */
app.patch('*', (_, res) => {
  res.status(404).send();
})

/* Se recibe una petición de tipo get si especificar la ruta correcta */
app.get('*', (_, res) => {
  res.status(404).send();
})

app.listen(36001, () => {
  console.log("Servidor iniciado en el puerto 36001")
})
