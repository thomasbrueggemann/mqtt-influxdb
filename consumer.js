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
		let topic = process.env.MQTT_TOPIC_PREFIX;
		if (!topic.endsWith("/")) {
			topic += "/";
		}

		await mqttClient.subscribe(`${topic}#`, {
			qos: 2
		});

		mqttClient.on("message", async (topic, message) => {
			console.log("Received a message on topic", topic);

			// decode message buffer to json
			const data = message.toJSON();

			await influxDb.writePoints([
				{
					measurement: topic.replace(/\//g, "_"),
					timestamp: new Date(telemetry.timestamp * 1000),
					tags: { id: telemetry.id, visibility: telemetry.visibility },
					fields: {
						latitude: telemetry.latitude,
						longitude: telemetry.longitude,
						altitude: telemetry.altitude,
						velocity: telemetry.velocity,
						footprint: telemetry.footprint,
						daynum: telemetry.daynum,
						solar_lat: telemetry.solar_lat,
						solar_lon: telemetry.solar_lon
					}
				}
			]);
		});
	} catch (e) {
		// Do something about it!
		console.log(e.stack);
		process.exit();
	}
});

process.on("SIGINT", async () => {
	await mqttClient.end();

	process.exit();
});
