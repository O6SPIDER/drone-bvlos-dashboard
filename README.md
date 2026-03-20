# BVLOS Drone Project — Cloud Command Center (ThingsBoard)

## 📌 Overview

This repository contains the **cloud-side architecture, dashboard configuration, and rule engine logic** for a **BVLOS (Beyond Visual Line of Sight) UAV telemetry system**.

Traditional RF telemetry links degrade with distance, interference, and line-of-sight constraints. This project replaces that limitation with a **cellular-based telemetry pipeline (4G/LTE)**, enabling persistent, long-range communication between the UAV and a centralized cloud dashboard.

> The system transforms the drone into an **internet-connected node**, enabling real-time monitoring, alerting, and command capabilities.



## 🧠 System Context (End-to-End Flow)

```text
Matek H743 (Flight Controller)
        ↓ MAVLink (UART)
ESP32 (Bridge Layer)
        ↓ MQTT over 4G (SIM7600 / MTN)
ThingsBoard (Cloud Platform)
        ↓
Dashboard (Visualization + Control)
```


## 🚀 Core Capabilities

### 📡 Real-Time Telemetry Ingestion

* Continuous ingestion of UAV telemetry via **MQTT protocol**
* Structured JSON payloads for deterministic parsing
* Supports:

  * Latitude / Longitude
  * Altitude (m)
  * Ground Speed (m/s)
  * Battery Voltage (V)
  * Signal Strength (RSSI)


### 📊 Advanced Telemetry Visualization

* Interactive dashboard built on **ThingsBoard widgets**
* Key metrics exposed via:

  * Gauges (Battery, Speed, Altitude)
  * Time-series charts (trend analysis)
  * Status indicators (device health)


### 🗺️ Live Geospatial Tracking

* Real-time UAV position plotted on map widgets
* Flight path visualization (historical trail)
* Enables operational awareness across wide geographic areas

---

### ⚠️ Rule Engine & Failsafe Logic

Cloud-side automation using ThingsBoard rule chains:

* **Low Battery Alert**

  * Trigger: `battery < 14V`
* **Weak Signal Detection**

  * Trigger: `RSSI < threshold`
* **Telemetry Loss Detection**

  * Trigger: No data within defined interval

These rules simulate **autonomous safety monitoring**, critical for BVLOS operations.


### 🔐 Device Provisioning & Authentication

* Secure device registration within ThingsBoard
* Token-based authentication for:

  * ESP32 telemetry bridge
  * UAV data streams

Ensures controlled and secure ingestion of telemetry data.


### 🎮 Command Channel (Bidirectional Communication)

* Downlink capability via MQTT RPC / attributes
* Enables:

  * Dynamic waypoint updates
  * Remote command injection
* Forms the foundation for **closed-loop UAV control**


## 🛠 Tech Stack

| Layer              | Technology                        |
| ------------------ | --------------------------------- |
| **Cloud Platform** | ThingsBoard (CE/PE)               |
| **Protocol**       | MQTT                              |
| **Data Format**    | JSON                              |
| **Frontend Logic** | JavaScript (widget customization) |
| **Connectivity**   | 4G/LTE via MTN Ghana (SIM7600)    |

---

## 📂 Repository Structure

```
configs/   → Dashboard definitions & widget exports  
rules/     → Rule chain JSON configurations  
schemas/   → Telemetry structure & device templates  
docs/      → Architecture diagrams & sequence flows  
```



## 📐 Telemetry Schema (Canonical Contract)

```json
{
  "latitude": 0.0,
  "longitude": 0.0,
  "altitude": 0.0,
  "speed": 0.0,
  "battery": 0.0,
  "signal": 0
}
```

## 🔒 Security & Reliability

* Token-based device authentication
* Isolated device profiles
* Rule-based anomaly detection
* Designed for **graceful degradation under network instability**



## 🧪 Testing & Simulation

* Telemetry simulated via MQTT clients prior to hardware integration
* Real-time validation of:

  * Data ingestion
  * Dashboard updates
  * Rule triggers

This enables **parallel development** independent of physical drone availability.



## 🌍 Roadmap / Future Enhancements

* 🛰 Multi-drone fleet management
* 📈 Historical flight replay & analytics
* 🤖 AI-based anomaly detection (predictive maintenance)
* 🔔 External alert integrations (SMS / Email / Push)
* 🌙 Advanced UI themes (dark mode, mission overlays)



## 📖 License

MIT License — see `LICENSE` file for details.



## 🧠 Engineering Note

This module represents the **cloud intelligence layer** of the BVLOS system, bridging embedded hardware (ESP32 + Matek H743) with scalable, internet-based telemetry infrastructure.



If you want next, I can:

* Add **architecture diagrams (clean SVG for your repo)**
* Or tailor this README to match **your lecturer’s marking rubric exactly** (to maximize your grade)
