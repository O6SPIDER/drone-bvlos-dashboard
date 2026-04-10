# MP-08: Cloud-Based Telemetry: Dynamic Path Tracking for Drones

**IEEE Area Classification:** IoT and Cloud-Enabled UAV Telemetry Systems

## 📌 Problem Statement & Overview
Traditional UAV telemetry systems rely on standard RF links that lack real-time dynamic path tracking and deep cloud integration. As operations scale or occur **Beyond Visual Line of Sight (BVLOS)**, these limitations severely reduce operational efficiency, safety, and situational awareness.

This project replaces traditional RF constraints with a **cellular-based telemetry pipeline (4G/LTE)**, transforming the UAV into an **internet-connected node**. This architecture enables persistent, long-range communication between the flight controller and a centralized cloud command center for real-time monitoring and mission adjustment.

## 🎯 Project Focus
This repository provides the software foundation and cloud infrastructure for a dynamic UAV tracking system focusing on:
1.  **Cloud Telemetry Integration:** Bridging edge hardware (ESP32 / Flight Controller) and centralized cloud servers.
2.  **Real-time Data Streaming:** Ensuring highly available, low-latency telemetry ingestion over cellular networks.
3.  **Dynamic Path Planning:** Providing the foundation for bidirectional command capabilities, allowing waypoints to be injected mid-flight.

## 📦 Project Deliverables
- **React-Based Command Center** (`/dashboard`): A premium web application providing Live Geospatial Tracking with continuous path rendering.
- **Rules Engine Validation** (`/rules`): Cloud-side autonomous event detection (e.g. signal degradation or battery thresholds).
- **Schema Contracts** (`/schemas`): Deterministic JSON definitions enabling accurate time-series logging for post-flight analysis.
- **Architectural Flow Design** (`/docs`): System architecture and sequence designs.

## 🧠 System Context (End-to-End Flow)

```text
Flight Controller (Matek H743)
        ↓ MAVLink / Serial (UART)
ESP32 (Telemetry Bridge Layer)
        ↓ MQTT over 4G Cellular (SIM7600 / MTN)
ThingsBoard (Cloud Platform Broker)
        ↓ WebSocket / REST
React Dashboard (Command Center UI)
```

## 🚀 Core Capabilities

### 📡 1. Real-Time Telemetry Streaming
- Continuous ingestion of UAV telemetry via the stable **MQTT protocol**.
- Structured JSON payloads for deterministic parsing.
- **Monitored Metrics:** Latitude, Longitude, AGL Altitude, Ground Speed, battery voltage, and Signal Strength (RSSI).

### 🗺️ 2. Live Geospatial Tracking & Visualization
- High-fidelity interactive maps rendering real-time UAV positioning.
- **Dynamic Flight Path:** Real-time rendering of the UAV's trajectory trail.
- **Time-Series Analysis:** Live plotting of altitude and speed efficiency graphs.

### 🎮 3. Command Channel (Path Adjustment)
- Downlink capability established via **MQTT Remote Procedure Calls (RPC)**.
- **Closed-loop control:** Enables operators to remotely update navigation algorithms and broadcast dynamic waypoints securely mid-flight.

## ⚠️ Rule Engine & Failsafe Logic
Cloud-side automation using ThingsBoard rule chains enables autonomous safety monitoring:
- **Low Battery Alert:** Triggers when `battery < 14V`.
- **Weak Signal Detection:** Triggers when `RSSI < threshold`.
- **Telemetry Loss Detection:** Triggers an alarm if no data is received within a defined interval.

## 📐 Telemetry Schema (Canonical Contract)
The system adheres to a deterministic data contract to ensure database consistency:
```json
{
  "latitude": 0.0,
  "longitude": 0.0,
  "altitude": 0.0,
  "speed": 0.0,
  "battery": 0.0,
  "signal": 0,
  "status": "string"
}
```

## 🛠 Tech Stack

| Layer              | Technology                        |
| ------------------ | --------------------------------- |
| **Cloud Platform** | ThingsBoard (CE/PE) / MQTT Broker |
| **Frontend UI**    | React, TypeScript, Leaflet, Vite  |
| **Visualization**  | Recharts (Data), Vanilla CSS      |
| **Connectivity**   | 4G/LTE via MTN Ghana (SIM7600)    |

## 📂 Repository Structure
- `dashboard/` → The cloud command center deliverable (React app)
- `configs/` → Cloud Dashboard layouts & UI definitions
- `rules/` → Cloud automation rule chains & alarms
- `schemas/` → Standardized structured telemetry templates
- `docs/` → System architecture designs

## 🔒 Security & Reliability
- **Token-based Authentication:** Secure device registration and telemetry streaming.
- **Isolated Device Profiles:** Deterministic data separation between different UAV nodes.
- **Failsafe Design:** Engineered for graceful degradation under network instability.

## 🧪 Testing & Simulation
Telemetry is validated via MQTT clients (like MQTTX) prior to hardware integration to ensure:
1. Data ingestion accuracy.
2. Real-time dashboard updates.
3. Rule trigger reliability.

## 🌍 Roadmap / Future Enhancements
- 🛰 **Multi-Drone Fleet Management:** Simultaneous control of multiple UAV nodes.
- 📈 **Historical Flight Replay:** Replaying mission data for post-flight debriefing.
- 🤖 **AI Anomaly Detection:** Predictive maintenance based on historical telemetry trends.
- 🔔 **External Alerts:** Integration with SMS, Email, and Push notification services.

## 📖 Licensing & Authorship
Developed to address specific academic scenarios regarding modern **IoT and Cloud-Enabled UAV Telemetry Systems**. Distributed under the MIT License.
