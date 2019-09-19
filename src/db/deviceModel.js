import { MongoClient } from "mongodb";
import firebase from "firebase-admin";
import serviceAccount from "./fireboy-79d85-firebase-adminsdk-eq2r2-07f67da5cb.json";
import dotenv from "dotenv";
dotenv.config();

let connectionInstance = null;
let url = process.env.DB_TEST_URL; 
let database = process.env.DB_TEST_NAME;

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

const getDevice = async (deviceId)=> {
	let res;
	await fb.database().ref("/fireboy/devices/").orderByValue().equalTo(deviceId).once("value", (snapshot)=> {
		return res = snapshot;
	});
	return res;
}

let create = async (collectionName, data)=> {
	let client = await connect();
	const db = client.db(database);
	const collection = db.collection(collectionName);
	try {
		return collection.insertMany(data);
	} catch (error) {
	}
}

const read = async (collectionName, filter={})=> {
	let client = await connect();
	const db = client.db(database);
	const coll = db.collection(collectionName);
	try {
		return coll.find(filter).toArray();
	} catch (error) {
	}
}

const connect = async ()=>{
	try {
		if (connectionInstance === null) {
			connectionInstance =  MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology:true});
			console.log("new connection instance");
			
			return connectionInstance;
		} else {
			console.log("existing connection");
			
			return connectionInstance
		}
	} catch (error) {
		console.log("All forms of error: ", error);        
	}
}
module.exports = {connect, create, read, getDevice}