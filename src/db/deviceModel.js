import { MongoClient } from "mongodb";
import assert from 'assert';
import firebase from "firebase-admin";
import serviceAccount from "./fireboy-79d85-firebase-adminsdk-eq2r2-07f67da5cb.json";

    let url = 'mongodb://localhost:27017'; // Manage this accordingly to your environment
    let database = "Realdrip";
    let fb = firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
      apiKey: "AIzaSyAKVRIv-4e8JaGaDRcJDY1TJI4MbtHU0OI",
      authDomain: "fireboy-79d85.firebaseapp.com",
      databaseURL: "https://fireboy-79d85.firebaseio.com",
      projectId: "fireboy-79d85",
      storageBucket: "fireboy-79d85.appspot.com",
      messagingSenderId: "856690883473",
      appId: "1:856690883473:web:7bce3dab58c50f2b"
    });
    
    let verifyDevice = async (deviceId)=> {
      let res = '';
      let device = await fb.database().ref("/fireboy/devices/").orderByValue().equalTo(deviceId).once("value", (snapshot)=> {
        if (snapshot.exists()) {
          res = "passed";
        }else{
          res = "failed";
        }
        console.log(res);
        return res;            
      });
      return res;
    }
    //Client is an instance of mongodbClient connection
    let create = function(client,data, callback) {
        const db = client.db(database);
        // Get the documents collection
        const collection = db.collection('devices');
        // Insert some documents
        collection.insertMany(data, (err, result)=> {
          assert.equal(err, null);
          // Pass the the result of the query to a callback function
          callback(result,client);
        });
    }
    let read = (client, collectionName, filter={}, callback)=>{
      const db = client.db(database);
      // Get the documents collection
      const coll = db.collection(collectionName);
      coll.find(filter).toArray((err, result)=>{
        assert.equal(err, null);
        callback(result, client);
      });
    }
    let connect = new Promise(
        (resolve, reject)=>{
            MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology:true}, function(err, client) {
                assert.equal(null, err);
                console.log("Mongo dripping like mango");
                resolve(client);
            });
    });
    module.exports = {connect, create, read, verifyDevice}