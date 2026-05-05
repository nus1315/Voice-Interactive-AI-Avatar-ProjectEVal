# V2L Metrics Pro (v2.0) - Research Framework Summary

## 🚀 Overview
โครงการประเมินคุณภาพ Audio-Visual ของงานวิจัย 2D Voice2Lip โดยมีการนำไฟล์วิดีโอจาก SadTalker เข้ามาฝูงในระบบ และเพิ่มระบบ Admin เพื่อความปลอดภัยในการจัดการข้อมูล

---

## 🛠️ Key Features Added

### 1. ระบบ Admin & Security
- **Admin Password**: ตั้งรหัสผ่านไว้คือ `v2l@admin2026` (เก็บไว้ใน `.env`)
- **Protected Access**: 
    - คนทั่วไปจะเห็น Dashboard (Analytics) เป็นโหมด **Read-only** เท่านั้น
    - เฉพาะ Admin ที่ล็อกอินแล้วเท่านั้นจึงจะเห็นปุ่ม **"Clear All"** สำหรับลบคะแนนทั้งหมด
    - เพิ่ม Admin Login Modal พร้อมระบบป้องกันรหัสผิด (Shake animation)
- **Environment Management**: เพิ่มไฟล์ `.env` และสร้างแม่แบบ `.env.example` เพื่อเก็บค่ารหัสลับ

### 2. SadTalker Video Integration
- **Direct Embed**: เชื่อมต่อไฟล์วิดีโอของจริง 16 คลิปจากผลลัพธ์การรันโมเดล (SadTalker)
- **Smart Mapping**: จัดแบ่ง Speaker และ Scenario ให้ตรงกับข้อมูลจริง:
    - **Dr. Chai, Dr. Wit, Tun (M)**: Opening, Math Intro, Encouraging, Warning
    - **Tun (F)**: Opening, Math Intro, Encouraging, Q&A
- **Public Assets**: ย้ายวิดีโอไปไว้ใน `public/videos/` เพื่อให้ระบบเข้าถึงได้ง่าย

### 3. Analytics & Research Metrics
- **Metric Upgrade**: เพิ่มมิติการให้คะแนนเป็น 3 ตัว:
    1. **Voice Likeness**: ความเหมือนของเสียงแม่แบบ
    2. **Visual Stability**: ความนิ่งและเสถียรของภาพ
    3. **Lip Synchronization**: ความตรงกันของปากและเสียง (ปากขยับตรงกับคำพูต)
- **Detailed Stats**: เพิ่มตารางสรุปคะแนนแยกรายบุคคล (Per-Speaker Breakdown)

---

## 💻 Local Setup (การใช้งานในเครื่อง)

1. **Start Development Server**:
   ```bash
   cd /mnt/data/Project/2Dvoice2Lip/git
   npm run dev -- --port 3032
   ```
2. **Access URL**: [http://localhost:3032/Voice-Interactive-AI-Avatar-Project/](http://localhost:3032/Voice-Interactive-AI-Avatar-Project/)
3. **Admin Login**: คลิกปุ่ม **Admin** มุมบนขวา แล้วใส่รหัส `v2l@admin2026`

---

## 🌐 GitHub Deployment (ขั้นตอนนี้สำคัญมาก)

เพื่อให้ระบบรันบน GitHub Pages ได้อย่างสมบูรณ์ ผู้ใช้ต้องเข้าไปตั้งค่าที่ GitHub UI ดังนี้:

### 1. ตั้งรหัสผ่าน (GitHub Action Secrets)
- ไปที่: **Settings > Secrets and variables > Actions**
- กดปุ่ม: **New repository secret**
- ใส่ค่าดังนี้:
    - **Name**: `VITE_ADMIN_PASSWORD`
    - **Secret**: `v2l@admin2026`

### 2. เปิดใช้งาน GitHub Pages
- ไปที่: **Settings > Pages**
- ที่หัวข้อ **Build and deployment > Source**: เปลี่ยนเป็น **GitHub Actions**
- **หมายเหตุ**: หาก Repo เป็น "Private" ต้องเปลี่ยนเป็น **"Public"** ก่อน (อยู่ที่เมนู Settings > Danger Zone ด้านล่างสุด)

---

## 📁 Updated Project Structure
- `.github/workflows/deploy.yml`: แก้ไขให้รองรับ Node 22 และ Auto-deploy
- `src/App.jsx`: เขียนใหม่ทั้งหมดเพื่อรองรับระบบ Admin และการแสดงผลวิดีโอ
- `public/videos/`: บรรจุไฟล์วิดีโอ SadTalker ทั้งหมด
- `.env`: ไฟล์เก็บรหัสผ่าน Admin (ถูก Gitignore ไว้เพื่อความปลอดภัย)
- `.gitignore`: ป้องกันการเผลออัปโหลดไฟล์รหัสผ่านและโฟลเดอร์ build เท่านั้น
