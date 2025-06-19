
# 📡 RFID-GPS Based Access/Attendance System

This project integrates an **ESP8266 microcontroller**, an **RFID reader**, and a **Node.js backend** to build a real-time access or attendance management system. The ESP8266 can read/write RFID tags based on commands sent from the backend server over Wi-Fi.

---

## 🙋 Contributors

- Sakil Aziz
- Sanju Kumari Gupta

---

## 🚀 Features

- 📶 **Wi-Fi Enabled**: ESP8266 communicates with backend over HTTP/WebSocket.
- 🗃️ **Database Logging**: Tag data is stored in a backend database (e.g., MySQL).
- 👁️ **Live Dashboard**: Admin can view scanned tag details in real time.
- 🔐 **Access Control**: Only registered tags are allowed (optional feature).
  
---

## 🧰 Tech Stack

| Component        | Technology             |
|------------------|------------------------|
| Microcontroller  | ESP8266 (NodeMCU)      |
| Reader Module    | RC522 RFID Reader      |
| Backend Server   | Node.js with Express   |
| Database         | MySQL                  |
| Communication    | HTTP / WebSocket       |

---

## ⚙️ Hardware Setup

- **ESP8266 (NodeMCU)**
- **RFID Reader (RC522)**
- **RFID Tags or Cards**
- **Jumper wires**
- **Breadboard or soldered PCB**

### RC522 ↔ ESP8266 Wiring:

| RC522 Pin | ESP8266 Pin |
|-----------|-------------|
| SDA       | D2 (GPIO4)  |
| SCK       | D5 (GPIO14) |
| MOSI      | D7 (GPIO13) |
| MISO      | D6 (GPIO12) |
| IRQ       | Not used    |
| GND       | GND         |
| RST       | D1 (GPIO5)  |
| 3.3V      | 3.3V        |


---

## 🧪 How to Run

### 📦 Backend

```bash
cd backend/
npm install
npm start
```

### 🔌 ESP8266 Firmware

1. Open firmware in Arduino IDE
2. Select NodeMCU board & COM port
3. Update Wi-Fi and server IP
4. Upload to ESP8266


## 📝 Future Improvements

- WhatsApp Notifications
- Mobile app integration


---
## 📸 Demo & Screenshots!

### The IoT Device 
![IOT](https://github.com/user-attachments/assets/148478fa-a6fb-4945-9475-efb1ea453625)

### 🔐 Login Page
![Login](https://github.com/user-attachments/assets/fa48defe-8447-4835-9cd2-27eefff2b5bc)

### 📊 Dashboard Overview
![dashboard](https://github.com/user-attachments/assets/c58d4255-5e61-4fef-9481-488079719df6)

### ✏️ Editing User Information
![editing](https://github.com/user-attachments/assets/20d8a390-3ac0-4ef7-bbfa-8bd3d0a37ffe)

### 📁 Uploading Student Data SpreadSheet
![uploading](https://github.com/user-attachments/assets/210f1d97-ee00-4c82-917a-9fb68675d497)

### ✅ After Adding Data
![afterAdding](https://github.com/user-attachments/assets/1f3a283b-8244-49a1-afdb-3e3278e3ff34)

### 📧 Email Notification Sent
![email](https://github.com/user-attachments/assets/0ca9701c-ec97-4711-b679-258e2841f6b0)

### 🔗 Opening Email Notification Link
![openingLink](https://github.com/user-attachments/assets/76683e3e-d98d-43f7-9004-8f912088ddcb)

