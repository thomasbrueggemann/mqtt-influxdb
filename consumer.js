const mqtt = require("async-mqtt");
const influx = require("influx");

// open a connection to the influxdb database
const influxDb = new influx.InfluxDB({
	host: process.env.INFLUXDB_HOST,
	port: process.env.INFLUXDB_PORT,
	username: process.env.INFLUXDB_USERNAME,
	password: process.env.INFLUXDB_PASSWORD,
	database: process.env.INFLUXDB_DATABASE
});

// connect to a MQTT broker
const mqttClient = mqtt.connect(
	process.env.MQTT_URI,
	{
		port: process.env.MQTT_PORT,
		username: process.env.MQTT_USERNAME,
		password: process.env.MQTT_PASSWORD
	}
);

mqttClient.on("connect", async () => {
	console.log("Connected to MQTT broker");

	try {
		// make sure the topic name has a trailing slash
		let topic = process.env.MQTT_TOPIC_PREFIX;
		if (!topic.endsWith("/")) {
			topic += "/";
		}

		// subscripe the a channel with a quality of service attribute of 2 = "exactly once"
		await mqttClient.subscribe(`${topic}#`, {
			qos: 2
		});

		mqttClient.on("message", async (topic, message) => {
			console.log("Received a message on topic", topic);

			// decode message buffer to json
			const data = Object.assign(message.toJSON(), {
				measurement: topic.replace(/\//g, "_")
			});

			await influxDb.writePoints([data]);
		});
	} catch (e) {
		// log error and end process
		console.log(e.stack);
		process.exit();
	}
});
