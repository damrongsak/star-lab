# Welcome to React Router

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t statlab-frontend .

# Run the container
docker run -p 3000:3000 statlab-frontend
```

The containerized application can be deployed to any platform that supports Docker, including:

- Google Cloud Run

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```plaintext
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

### Environment Variables

You can configure environment variables in a `.env` file at the root of your project. The
variables will be available in both the client and server code. For example:

```plaintext
# .env
VITE_BACKEND_API_URL=https://api.example.com
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.

## สรุปภาพรวมโปรเจกต์ Star-Labs Tracking

โปรเจกต์ Star-Labs Tracking เป็นแอปพลิเคชันแบ็กเอนด์ที่ออกแบบมาเพื่อจัดการกระบวนการทำงานของห้องปฏิบัติการทดสอบ (Lab Test) ตั้งแต่การส่งคำขอทดสอบโดยลูกค้า ไปยังการประมวลผล การตรวจสอบ การอนุมัติผล และการอัปโหลดเอกสารที่เกี่ยวข้อง ระบบนี้รองรับผู้ใช้งานหลากหลายบทบาทและมีการจัดการข้อมูลแยกตามบริษัท (Multi-tenancy) เพื่อให้แต่ละบริษัทสามารถจัดการข้อมูลของตนเองได้อย่างเป็นอิสระ

## แนวคิดหลัก (Concept Summary)

หัวใจหลักของระบบคือการสร้างแพลตฟอร์มที่ครอบคลุมทุกขั้นตอนของวงจรชีวิตการทดสอบในห้องปฏิบัติการ ดังนี้:

- ลูกค้า (Customer): สามารถสร้างคำขอทดสอบ (Test Request) ระบุรายละเอียดตัวอย่าง (Test Request Sample) และติดตามสถานะของคำขอได้
- การจัดการในห้องปฏิบัติการ (Lab Management): ครอบคลุมการยืนยันการชำระเงิน การจัดสรรงานให้กับช่างเทคนิค (Technician) การติดตามสถานะภายในของตัวอย่างและผลการทดสอบ
- ช่างเทคนิค (Technician): ดำเนินการทดสอบ บันทึกผล และอัปโหลดไฟล์แนบที่เกี่ยวข้อง เช่น รายงานผลการทดสอบ
- แพทย์/ผู้ตรวจ (Doctor): ตรวจสอบและให้ข้อคิดเห็นเกี่ยวกับผลการทดสอบที่บันทึกโดยช่างเทคนิค
- ผู้อนุมัติ (Approval): ให้การอนุมัติขั้นสุดท้ายสำหรับผลการทดสอบ ทำให้ผลพร้อมสำหรับลูกค้า
- การควบคุมการเข้าถึงตามบทบาท (Role-Based Access Control - RBAC): ทุกขั้นตอนมีการควบคุมสิทธิ์การเข้าถึงอย่างเข้มงวดตามบทบาทของผู้ใช้งาน (ADMIN, LAB_ADMIN, CUSTOMER, TECHNICIAN, DOCTOR, APPROVAL)
- การจัดการข้อมูลแยกตามบริษัท (Multi-tenancy): ระบบถูกออกแบบมาเพื่อให้ข้อมูลของแต่ละบริษัท (ลูกค้าในระบบ) ถูกแยกออกจากกันอย่างชัดเจน มีเพียงผู้ดูแลระบบส่วนกลาง (ADMIN) เท่านั้นที่สามารถเข้าถึงข้อมูลข้ามบริษัทได้

## ฟีเจอร์ที่ดำเนินการไปแล้ว (Features Implemented)

### ฟีเจอร์หลัก (Core Functionalities)

ฟีเจอร์เหล่านี้ได้รับการออกแบบและวางโครงสร้างในส่วนของแบ็กเอนด์เพื่อรองรับการทำงานของหน้าเว็บที่เกี่ยวข้อง:

- ระบบผู้ใช้งานและการยืนยันตัวตน:
  - การลงทะเบียนผู้ใช้งาน: ลูกค้าสามารถลงทะเบียนบัญชีใหม่พร้อมระบุข้อมูลบริษัทและข้อมูลผู้ดำเนินการหลัก
  - การล็อกอิน: ผู้ใช้งานสามารถล็อกอินเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
  - การยืนยันอีเมล: มีระบบส่งอีเมลยืนยันตัวตนพร้อมลิงก์เพื่อเปิดใช้งานบัญชีผู้ใช้งานเพื่อเพิ่มความปลอดภัย
- การจัดการคำขอทดสอบ (Test Requests):
  - การสร้างคำขอทดสอบ: ลูกค้าสามารถสร้างคำขอทดสอบใหม่พร้อมระบุรายละเอียดของตัวอย่างที่ต้องการส่งตรวจได้
  - การจัดการตัวอย่าง (Test Request Samples): รองรับการระบุรายละเอียดของตัวอย่างแต่ละชิ้นที่แนบมากับคำขอ (เช่น ID ตัวอย่างของลูกค้า, ชนิดสัตว์, ชนิดตัวอย่าง, ปริมาณ)
  - การติดตามสถานะเอกสาร: คำขอทดสอบมีสถานะ "Document Status" (เช่น DRAFT, SUBMITTED, PENDING_PAYMENT, APPROVED, REJECTED, CANCELLED) ที่ควบคุมโดยลูกค้าและผู้ดูแลห้องปฏิบัติการ
  - การติดตามสถานะภายในห้องปฏิบัติการ: มีสถานะ "Lab Internal Status" (เช่น WAITING_APPROVAL_LAB, RECEIVED_SAMPLES, IN_PROGRESS, RESULTS_UPLOADED, COMPLETED) สำหรับการติดตามกระบวนการภายในห้องปฏิบัติการ
- การจัดการผลการทดสอบ (Lab Tests & Results):
  - การอัปโหลดผลการทดสอบ: ช่างเทคนิคสามารถอัปโหลดไฟล์ผลการทดสอบ (PDF, รูปภาพ) และบันทึกผลการทดสอบแบบมีโครงสร้าง (structured data) สำหรับแต่ละรายการทดสอบ (Lab Test)
  - การจัดการสถานะผลการทดสอบ: มีสถานะ "Lab Result Status" (เช่น PENDING, COMPLETED, REVIEWED, APPROVED, REJECTED) สำหรับแต่ละรายการทดสอบย่อย
- ระบบใบแจ้งหนี้ (Invoicing):
  - รองรับการสร้างใบแจ้งหนี้ (Invoice) พร้อมรายการสินค้า (Line Items) การคำนวณภาษี และสถานะการชำระเงิน
- การจัดการการชำระเงินและสลิป (Payment & Slip Management):
  - การอัปโหลดสลิปการชำระเงิน: ลูกค้าสามารถอัปโหลดไฟล์สลิปการชำระเงินไปยังใบแจ้งหนี้ที่เกี่ยวข้อง
  - การตรวจสอบและอนุมัติการชำระเงิน: ผู้ดูแลห้องปฏิบัติการ (LAB_ADMIN) สามารถตรวจสอบสลิปและอนุมัติ (PAID) หรือปฏิเสธ (REJECTED/CANCELLED) สถานะการชำระเงินของใบแจ้งหนี้ได้ การอนุมัติการชำระเงินจะเปลี่ยนสถานะคำขอทดสอบไปยังขั้นตอนถัดไป (เช่น SUBMITTED)
- การจัดการเอกสารแนบ (Document Attachments):
  - มีโมเดลสำหรับจัดเก็บข้อมูลไฟล์แนบ (ชื่อไฟล์, URL ไฟล์, ชนิดไฟล์) ที่สามารถเชื่อมโยงกับเอนทิตี้ต่างๆ ในระบบ (เช่น เอกสารการจดทะเบียนบริษัท, สลิปการชำระเงิน, ผลการทดสอบ)
- บันทึกการตรวจสอบ (Audit Trails):
  - บันทึกกิจกรรมสำคัญของผู้ใช้งาน (ใครทำอะไร กับเอนทิตี้ใด) เพื่อให้สามารถตรวจสอบย้อนหลังได้

### ส่วนประกอบหลักระดับโลก (Global Components - ในมุมมองแบ็กเอนด์)

เหล่านี้คือองค์ประกอบสำคัญที่รองรับฟีเจอร์หลักทั้งหมดของระบบ:

- JWT Authentication: การใช้ JSON Web Tokens (JWT) สำหรับการยืนยันตัวตนผู้ใช้งาน
- Role-Based Access Control (RBAC) Middleware: Middleware ที่ตรวจสอบบทบาทของผู้ใช้งาน (เช่น CUSTOMER, TECHNICIAN) เพื่ออนุญาตหรือปฏิเสธการเข้าถึงเส้นทาง (routes) ต่างๆ
- Company-Based Access Control Middleware: Middleware เฉพาะที่ตรวจสอบว่าผู้ใช้งาน (ยกเว้น ADMIN) สามารถเข้าถึงข้อมูลที่เกี่ยวข้องกับบริษัทของตนเองเท่านั้น
- Email Service: บริการสำหรับการส่งอีเมล เช่น อีเมลยืนยันการลงทะเบียน
- File Upload Middleware (Multer): ใช้สำหรับจัดการการอัปโหลดไฟล์ที่มาพร้อมกับคำขอ HTTP
- Centralized Configuration: การจัดการค่าคอนฟิกต่างๆ ผ่านไฟล์ .env เพื่อความยืดหยุ่นในการปรับใช้
- Swagger UI Documentation: เอกสาร API ที่สร้างขึ้นโดยอัตโนมัติ ช่วยให้นักพัฒนาฟรอนต์เอนด์สามารถเข้าใจและใช้งาน API ได้ง่ายขึ้น
- Database Transactions: การใช้ Prisma Transactions เพื่อให้การดำเนินการกับฐานข้อมูลหลายๆ อย่างเป็นแบบ Atomicity (ทำทั้งหมดหรือไม่ได้ทำเลย) ป้องกันข้อมูลเสียหาย
- การใช้ Enum ใน Prisma Schema: การกำหนด Enum สำหรับสถานะและบทบาทต่างๆ เพื่อให้เกิด Type Safety และลดข้อผิดพลาด

## Tech Stack

Backend:

- Framework: Express.js
- Language: TypeScript
- ORM: Prisma ORM
- Database: PostgreSQL
- Containerization: Docker & Docker Compose
- Testing: Jest (สำหรับ Unit/Integration Tests)
- Authentication: JSON Web Tokens (JWT), bcryptjs (สำหรับ Hashing รหัสผ่าน)
- Email Service: Nodemailer
- File Uploads: Multer
- API Documentation: Swagger.js & Swagger UI Express
- Deployment Environment: Node.js 22, Google Cloud Engine (GCE)
- Reverse Proxy & SSL: Nginx & Certbot

Frontend:

- Framework: React (ใช้ Vite เป็น Build Tool)
- Routing: React Router 7.6.1 (ใช้ในโหมด Framework, กำหนดค่าเป็น Client-Side Rendering (CSR) เป็นหลัก)
- Language: TypeScript
- UI Library/Styling: Tailwind CSS (ใช้ Radix UI components สำหรับ UI Primitives)
- Form Management: React Hook Form (ร่วมกับ Zod สำหรับ Validation)
- Utility Libraries: Class Variance Authority, Classnames, Clsx, Tailwind Merge
- Icon Library: Lucide React

State Management:

- Server State (ข้อมูลจาก API): แนะนำ React Query (หรือ TanStack Query) สำหรับการดึงข้อมูล, แคช, อัปเดต และจัดการ Lifecycle ของ API Calls
- Client State (UI State): แนะนำ React Context API + useState / useReducer หรือ Zustand สำหรับ Global UI State ที่ไม่ซับซ้อนมาก
- Build Tool: Vite

## หลักการออกแบบ UX/UI (สำหรับ Frontend ที่จะพัฒนา)

เนื่องจากระบบนี้ยังเป็นแบ็กเอนด์เป็นหลัก หลักการออกแบบ UX/UI จะเป็นข้อเสนอแนะสำหรับส่วนหน้าที่จะสร้างขึ้น:

### การรองรับ Light/Dark Theme และการใช้สีหลัก

- ออกแบบ UI ให้รองรับทั้ง Light และ Dark mode เพื่อให้ผู้ใช้งานสามารถเลือกประสบการณ์การใช้งานที่เหมาะสมกับสภาพแสงและความชอบส่วนตัวได้
- ใช้ Tailwind CSS เพื่อกำหนดชุดสีและสไตล์สำหรับแต่ละธีม โดยยึดหลักสีจากภาพตัวอย่าง Dark Theme ที่ได้รับ:
  - Dark Theme (Default Layout Inspired):
    - พื้นหลังหลัก: สีเทาเข้มเกือบดำ (#0A0A0A หรือ #121212) เพื่อให้เกิดความลึกและ Contrast ที่ดี
    - พื้นหลังรอง/พื้นหลัง Component Card/Sidebar/Header: สีเทาเข้ม (#1A1A1A หรือ #202020) เพื่อให้โดดเด่นจากพื้นหลังหลักเล็กน้อย
    - ข้อความหลัก: สีขาว (#FFFFFF) หรือสีเทาอ่อน (เช่น #E0E0E0) เพื่อให้อ่านง่าย
    - ข้อความรอง: สีเทาอ่อน (เช่น #A0A0A0) สำหรับรายละเอียดหรือข้อความที่ไม่ใช่จุดสนใจหลัก
    - ขอบ/เส้นแบ่ง: สีเทาเข้มปานกลาง (เช่น #333333) สำหรับการแบ่งส่วนต่างๆ
    - สีปุ่ม Primary/Action: สีน้ำเงิน (#007BFF) หรือเฉดที่ใกล้เคียง (ตัวอย่าง: bg-blue-600) เพื่อเน้นการกระทำหลัก
    - สีปุ่ม Danger/Warning: สีส้ม (#FFA000) หรือเฉดที่ใกล้เคียง (ตัวอย่าง: bg-orange-500) เพื่อสื่อถึงการเตือนหรืออันตราย
    - ไอคอน/ข้อความเตือน (Warning): สีเหลือง/ส้ม (เช่น #FFB800 หรือ #FACC15) เพื่อดึงดูดความสนใจในกรณีฉุกเฉิน
    - สีลิงก์/Accent: สีน้ำเงิน/ม่วงอ่อน (เช่น #60A5FA หรือ #A78BFA) สำหรับลิงก์ที่ใช้งานอยู่หรือองค์ประกอบที่ต้องการเน้น
  - Light Theme: (ต้องกำหนดชุดสีที่เหมาะสมเพื่อให้ Contrast ดีและสบายตาในที่สว่าง)
    - พื้นหลังหลัก: สีขาว (#FFFFFF)
    - พื้นหลังรอง/พื้นหลัง Component Card/Modal: สีเทาอ่อน (#F8F8F8) หรือใกล้เคียง
    - ข้อความหลัก: สีดำ (#000000)
    - ปุ่ม/Primary Action: ยังคงใช้ สีน้ำเงิน (#007BFF) หรือเวอร์ชันที่ปรับให้เข้ากับ Light Theme
    - ปุ่มรอง/Delete Action: ยังคงใช้ สีส้ม (#FFA000) หรือเวอร์ชันที่ปรับให้เข้ากับ Light Theme
    - ไอคอน/ข้อความเตือน (Warning): ยังคงใช้ สีเหลือง/ส้ม (#FFB800) หรือเวอร์ชันที่ปรับให้เข้ากับ Light Theme
- การสลับธีมจะจัดการผ่านการเพิ่ม/ลบ dark class บนองค์ประกอบหลักของหน้า เช่น root element หรือ body tag โดยใช้ JavaScript หรือ Context API.

### การออกแบบ Layout เว็บไซต์ (อ้างอิงจากภาพตัวอย่าง React Router Docs)

- โครงสร้างหลัก: เว็บไซต์จะใช้โครงสร้าง Layout แบบ 3 ส่วนหลัก (Three-column layout) หรือ 2 ส่วนหลัก (Two-column layout) สำหรับหน้าแสดงผลเนื้อหา:
  - Global Navbar (ส่วนบนสุด): แถบนำทางด้านบนที่คงที่ (fixed) สำหรับโลโก้, ชื่อโปรเจกต์ ("Star-Labs"), ปุ่มค้นหา, ปุ่มสลับธีม (Light/Dark), และไอคอนสำหรับลิงก์ภายนอก (เช่น GitHub, Discord)
  - Sidebar (แถบนำทางด้านซ้าย): แถบด้านข้างสำหรับเมนูนำทางหลักและเมนูย่อย (nested menu) ที่สามารถขยาย/ยุบได้ เพื่อจัดระเบียบเนื้อหาหรือหน้าต่างๆ ของแอปพลิเคชัน เมนูที่ใช้งานอยู่จะมีการไฮไลต์
  - Main Content Area (พื้นที่เนื้อหาหลัก): พื้นที่กว้างที่สุดสำหรับแสดงเนื้อหาเฉพาะของแต่ละหน้า เช่น รายการคำขอทดสอบ, รายละเอียดผลลัพธ์, ฟอร์มต่างๆ พร้อมองค์ประกอบเฉพาะ (เช่น ปุ่ม "Copy Page", กล่องข้อความเตือน/ข้อมูล)
  - Global Footer (ส่วนล่างสุด): ส่วนท้ายของหน้าเว็บที่แสดงข้อมูลลิขสิทธิ์หรือลิงก์สำคัญอื่นๆ

### การเลือก Component สำหรับ Layout

- Layout Structure: จะสร้างด้วย Flexbox หรือ CSS Grid ใน React Components หลักเพื่อแบ่งส่วน Header, Sidebar, Main Content และ Footer
- Navigation Components: จะสร้าง Custom React Components สำหรับ Navbar และ Sidebar โดยใช้ Tailwind CSS เพื่อจัด Layout และสไตล์
- Interactive Components:
  - Buttons: จะใช้ Radix UI Slot หรือสร้าง Component Button ของตนเอง สไตล์ด้วย Tailwind (เช่น px-4 py-2 rounded-md) และกำหนดสีตามธีม
  - Dropdown Menus: ใช้ @radix-ui/react-dropdown-menu สำหรับเมนูผู้ใช้งานหรือเมนูอื่นๆ ที่ซับซ้อน สไตล์ด้วย Tailwind สำหรับพื้นหลัง, ข้อความ และ Hover state
  - Alert/Warning Boxes (Inline): จะสร้าง Custom Component สำหรับแสดงข้อความเตือนหรือข้อมูลสำคัญภายในเนื้อหา (เช่น กล่องสีส้มในภาพตัวอย่าง) โดยใช้ Tailwind CSS เพื่อกำหนดพื้นหลัง, ขอบ และสีข้อความ
  - Search Input: Custom input field พร้อมไอคอนค้นหา (จาก Lucide React)
  - Theme Toggle: ปุ่มสำหรับสลับ Light/Dark theme (อาจใช้ Lucide React icons เช่น Sun / Moon)
  - Text/Typography: ใช้ Tailwind's Typography Plugin หรือกำหนด CSS classes โดยตรงสำหรับ Headings, Paragraphs, Lists และ Code Blocks เพื่อให้มีรูปแบบที่สอดคล้อง
  - Icons: Lucide React จะถูกใช้สำหรับไอคอนต่างๆ ทั่วทั้งแอปพลิเคชัน และสามารถกำหนดสีได้ง่ายด้วย Tailwind CSS (เช่น text-gray-400 หรือ text-yellow-400)
- Dashboard ที่ปรับตามบทบาท: ออกแบบหน้า Dashboard ที่แสดงข้อมูลและฟังก์ชันที่เกี่ยวข้องกับบทบาทของผู้ใช้งานแต่ละคน (ลูกค้าเห็นคำขอของตัวเอง, ช่างเทคนิคเห็นงานที่ได้รับมอบหมาย, แพทย์เห็นผลที่ต้องรีวิว)
- การนำทางที่ชัดเจน: โครงสร้างการนำทางที่เข้าใจง่าย ช่วยให้ผู้ใช้งานเข้าถึงส่วนต่างๆ ของระบบได้อย่างรวดเร็ว
- การแสดง Workflow ที่ชัดเจน: แสดงสถานะของคำขอและตัวอย่างในรูปแบบที่เข้าใจง่ายด้วยแถบสถานะ (status indicators) หรือแผนผัง Workflow
- ฟอร์มที่ใช้งานง่ายและมีการตรวจสอบ: ออกแบบฟอร์มสำหรับการสร้าง/แก้ไขข้อมูลต่างๆ ให้มีความชัดเจน มีการตรวจสอบข้อมูล (validation) ทั้งฝั่งไคลเอนต์และเซิร์ฟเวอร์ และมีข้อความแจ้งเตือนที่เข้าใจง่าย
- การตอบสนอง (Responsiveness): UI ที่สามารถปรับขนาดและแสดงผลได้อย่างเหมาะสมบนอุปกรณ์ทุกประเภท (Desktop, Tablet, Mobile)
- การแจ้งเตือน: ระบบแจ้งเตือนที่ชัดเจนเมื่อมีการเปลี่ยนแปลงสถานะที่เกี่ยวข้องหรือต้องการให้ผู้ใช้งานดำเนินการใดๆ
- การจัดการเอกสารที่ใช้งานง่าย: อินเทอร์เฟซสำหรับการอัปโหลดและดูเอกสารแนบที่สะดวก
- ภาพรวมข้อมูล: สำหรับผู้ดูแลระบบ ควรมีหน้าจอที่แสดงภาพรวมของข้อมูลในระบบ (เช่น จำนวนคำขอ, สถานะโดยรวม)

## ฟีเจอร์ถัดไปที่แนะนำ (Next Features - Recommended for Me)

นี่คือฟีเจอร์ที่แนะนำให้พัฒนาเพิ่มเติมเพื่อเสริมความสมบูรณ์และประโยชน์ใช้สอยของระบบ:

- การจัดการผู้ใช้งานโดยผู้ดูแล (User Management by Admin/LAB_ADMIN):
  - สร้าง API สำหรับ ADMIN และ LAB_ADMIN ในการเพิ่ม/แก้ไข/ลบ/จัดการบทบาทของผู้ใช้งานภายในบริษัท
  - สามารถปิดใช้งานบัญชีผู้ใช้งานได้
- การจัดการ Project (Project Management):
  - เพิ่ม API สำหรับ CRUD operations บนโมเดล Project ให้ผู้ดูแลหรือลูกค้าสามารถสร้าง/จัดการโปรเจกต์ที่เกี่ยวข้องกับคำขอทดสอบได้
- ระบบแจ้งเตือน (Notifications):
  - In-app Notifications: แจ้งเตือนในระบบเมื่อสถานะของคำขอหรือผลการทดสอบมีการเปลี่ยนแปลง (เช่น ผลอนุมัติแล้ว, มีการมอบหมายงานใหม่)
  - Email Notifications: ขยายการใช้งาน email.service เพื่อส่งการแจ้งเตือนอัตโนมัติสำหรับสถานะที่สำคัญ (เช่น ผลพร้อมแล้ว, ใบแจ้งหนี้ออกแล้ว)
  - Optional: WebSockets: สำหรับการแจ้งเตือนแบบเรียลไทม์ทันทีเมื่อมีการเปลี่ยนแปลงข้อมูล
- การจัดการใบแจ้งหนี้และการชำระเงิน (Invoice & Payment Management):
  - API สำหรับการจัดการ Invoice: สร้าง API สำหรับ LAB_ADMIN ในการสร้างใบแจ้งหนี้, เพิ่มรายการ (Line Items), อัปเดตสถานะการชำระเงิน
  - การอัปโหลดสลิปการชำระเงิน: ลูกค้าสามารถอัปโหลดสลิปการชำระเงินเพื่อยืนยันการชำระเงิน
  - Optional: Payment Gateway Integration: เชื่อมต่อกับระบบชำระเงินภายนอก (เช่น Stripe, PayPal หรือระบบชำระเงินในไทย) เพื่อการชำระเงินออนไลน์
- การจัดการ Master Data (Reference Data):
  - เพิ่มโมเดลสำหรับ Test Panel, Test Method, Sample Specimen Type, Animal Type เพื่อให้สามารถเลือกจากรายการที่กำหนดไว้ล่วงหน้าได้ ทำให้ข้อมูลมีความถูกต้องและเป็นมาตรฐาน
- ระบบการค้นหา กรอง และการแบ่งหน้า (Advanced Search, Filtering, Pagination):
  - ขยายความสามารถในการค้นหา กรอง และจัดเรียงข้อมูลในตารางรายการต่างๆ (เช่น Test Requests, Lab Tests) ให้ยืดหยุ่นมากขึ้น
- การจัดการสต็อกตัวอย่างและที่จัดเก็บ (Sample Storage Management):
  - ใช้โมเดล StorageLocation และ TestRequestSample เพื่อติดตามตำแหน่งที่เก็บตัวอย่างในห้องปฏิบัติการและปริมาณที่เหลืออยู่
  - ฟังก์ชันสำหรับย้ายตัวอย่างระหว่างที่จัดเก็บ
- การจัดการรหัสผ่าน (Password Management):
  - ระบบ "ลืมรหัสผ่าน" พร้อมการส่งอีเมลเพื่อรีเซ็ตรหัสผ่าน
- Dashboard & Reporting:
  - API สำหรับดึงข้อมูลสรุปเพื่อสร้าง Dashboard และรายงานต่างๆ สำหรับผู้บริหาร (เช่น จำนวนการทดสอบรายเดือน, สถานะการชำระเงิน)
- การบันทึกข้อผิดพลาดและการตรวจสอบระบบ (Error Logging & Monitoring):
  - ใช้ไลบรารี logging ที่มีประสิทธิภาพ (เช่น Winston หรือ Pino) เพื่อบันทึกข้อผิดพลาดและกิจกรรมสำคัญของระบบ
  - เชื่อมต่อกับระบบ Monitoring (เช่น Prometheus/Grafana) เพื่อติดตามประสิทธิภาพของแอปพลิเคชันใน Production

ด้วยโครงสร้างแบ็กเอนด์ที่แข็งแกร่งนี้ การเพิ่มฟีเจอร์เหล่านี้จะช่วยให้ Star-Labs Tracking กลายเป็นระบบจัดการห้องปฏิบัติการที่สมบูรณ์และมีประสิทธิภาพยิ่งขึ้นครับ!

```plaintext
app/
│
├── app.css                  // Main global CSS, includes Tailwind and theme variables
├── root.tsx                 // Root React component, sets up providers, layout, and error boundary
├── routes.ts                // Route configuration for React Router v7
│
├── components/              // Shared UI and layout components
│   ├── footer.tsx           // Footer component, site-wide footer
│   ├── header.tsx           // Header component, site-wide top navigation bar
│   ├── sidebar.tsx          // Sidebar component, role-based navigation for lab/admin
│   ├── theme-toggle.tsx     // Theme toggle button (light/dark mode)
│   └── ui/                  // Reusable UI primitives (buttons, inputs, etc.)
│       ├── alert-dialog.tsx // Alert dialog/modal component
│       ├── avatar.tsx       // Avatar/profile image component
│       ├── badge.tsx        // Badge/label component
│       ├── button.tsx       // Button component with variants
│       ├── card.tsx         // Card layout component (with header, content, etc.)
│       ├── dropdown-menu.tsx// Dropdown menu component (Radix UI)
│       ├── input.tsx        // Input field component
│       ├── label.tsx        // Label for form fields
│       ├── toaster.tsx      // Toast notification display component
│       └── use-toast.tsx    // Toast context/provider and hook
│
├── context/                 // React context providers for global state
│   ├── theme-provider.tsx   // Theme context/provider (light/dark mode)
│   └── user-context.tsx     // User context/provider (auth state, user profile)
│
├── libs/                    // Utility libraries and configuration
│   ├── menuRoutes.ts        // Mapping of menu items to route paths
│   ├── rolesPermissions.ts  // Mapping of user roles to sidebar permissions
│   └── utils.ts             // General utility functions (e.g., cn, safeRedirect)
│
├── routes/                  // Route modules for each main page
│   ├── about.tsx            // About page component
│   ├── blog.tsx             // Blog page component (with pagination)
│   ├── contact.tsx          // Contact page component (contact card)
│   ├── home.tsx             // Home page component (renders Welcome)
│   ├── products.tsx         // Products/projects listing page
│   └── signin.tsx           // Sign-in page with mock authentication
│
└── welcome/                 // Welcome page assets and component
    ├── logo-dark.svg        // Dark mode logo
    ├── logo-light.svg       // Light mode logo
    └── welcome.tsx          // Welcome page component (used on home)

```

Summary:

- components/ and components/ui/ hold all reusable UI and layout components.
- context/ holds React context providers for theme and user state.
- libs/ contains utility functions and configuration for roles and routes.
- routes/ contains the main page components for each route.
- welcome/ is for the home/welcome page and its assets.
- root.tsx is the app entry point, setting up providers and layout.
- routes.ts defines the app's route structure for React Router v7.
