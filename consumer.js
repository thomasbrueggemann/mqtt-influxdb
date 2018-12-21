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
			console.log(topic, message.toString());

			let measurementName = topic.replace(/\//g, "_");
			if (measurementName.endsWith("_")) {
				measurementName = measurementName.slice(0, -1);
			}

			const json = JSON.parse(message.toString());
			let data;

			// check if the transmitted object is a json
			if (typeof json === "object") {
				// decode message buffer to json
				data = Object.assign(json, {
					measurement: measurementName
				});
			} else {
				data = {
					measurement: measurementName,
					fields: {
						value: json
					}
				};
			}

			// only publish if data was available
			if (data) {
				await influxDb.writePoints([data]);
			}
		});
	} catch (e) {
		// log error and end process
		console.log(e.stack);
		process.exit();
	}
});
