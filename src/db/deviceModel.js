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
        return res = (snapshot.exists() ? "passed" : "failed");
      });
      return res;
    }
    //Client is an instance of mongodbClient connection
    let create = (client, collectionName, data, callback)=> {
        const db = client.db(database);
        // Get the documents collection
        const collection = db.collection(collectionName);
        // Insert some documents
        collection.insertMany(data, (err, result)=> {
          assert.equal(err, null);
          // Pass the the result of the query to a callback function
          callback(result, client);
        });
    }
    let read = (client, collectionName, filter={}, callback)=> {
      const db = client.db(database);
      // Get the documents collection
      const collection = db.collection(collectionName);
      collection.find(filter).toArray((err, result)=>{
        assert.equal(err, null);
        callback(result, client);
      });
    }
    let update = (client, collectionName, where, data, callback)=> {
      const db = client.db(database);
      // Get the documents collection
      const collection = db.collection(collectionName);
      // Update document where a is 2, set b equal to 1
      collection.updateOne(where , { $set: data }, (err, result)=> {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
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
    module.exports = {connect, create, read, update, verifyDevice}