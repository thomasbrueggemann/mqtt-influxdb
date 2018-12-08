<h1 align="center">MQTT 🚠 InfluxDB</h1>
<p align="center">MQTT consumer that ingests directly into InfluxDB</p>

## Run via Docker

The MQTT InfluxDB ingester can be run via Docker. The docker image is hosted on Docker Hub:

<a target="_blank" href="https://hub.docker.com/r/brueggemannthomas/mqtt-influxdb/">hub.docker.com/r/brueggemannthomas/mqtt-influxdb</a>

### Environment Variables

The Docker container uses the following environment variables to be configured:

| Environment Variable | Description                                                                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `INFLUXDB_HOST`      | Set a hostname to connect to your InfluxDB database                                                                                                                                              |
| `INFLUXDB_PORT`      | Portnumber of InfluxDB setup                                                                                                                                                                     |
| `INFLUXDB_USERNAME`  | InfluxDB username                                                                                                                                                                                |
| `INFLUXDB_PASSWORD`  | InfluxDB password                                                                                                                                                                                |
| `INFLUXDB_DATABASE`  | Name of the database that your MQTT messages will be written to                                                                                                                                  |
| `MQTT_URI`           | URI to your MQTT broker, e.g. `mqtt://io.your-domain.com` Must adhere to https://github.com/mqttjs/MQTT.js#mqttconnecturl-options                                                                |
| `MQTT_PORT`          | Portnumber of MQTT broker                                                                                                                                                                        |
| `MQTT_USERNAME`      | MQTT broker username                                                                                                                                                                             |
| `MQTT_PASSWORD`      | MQTT broker password                                                                                                                                                                             |
| `MQTT_TOPIC_PREFIX`  | The prefix of the topics to listen to. As an example, `sensor/` will listen to all topics that start with `sensor/`, e.g. `sensor/cpu` and `sensor/mem` would be captured. Must end with a slash |
