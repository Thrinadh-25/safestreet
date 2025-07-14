# Safe Street – Smart Road Damage Detection and Reporting

Safe Street is a full-stack web and mobile application designed to identify and report road damages using AI-powered image analysis. It helps field personnel capture damage photos, which are analyzed using a Vision Transformer model to detect damage type, severity, and recommend repair priorities. Reports are automatically shared with authorities, while a web dashboard offers insights and historical data visualization.

---

## 🔧 Features

- **Mobile App** (React Native): Capture and upload road damage images.
- **AI Model**: Vision Transformer for classifying road damage types and severity.
- **Web App** (React.js): Visual dashboard for authorities to track, review, and manage damage reports.
- **Automated Reporting**: Email-based report generation and delivery to local authorities.
- **Backend**: Node.js + Express.js API with MongoDB for data persistence.
- **Data Insights**: Historical and analytical views for decision making.

---

## Tech Stack

| Frontend               | Backend             | AI Model                 | Database | Other                                                        |
| ---------------------- | ------------------- | ------------------------ | -------- | ------------------------------------------------------------ |
| React.js, React Native | Node.js, Express.js | Vision Transformer (ViT) | MongoDB  | Nodemailer, Cloudinary (optional), GitHub Actions (optional) |

---

## Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/Thrinadh-25/safestreet.git
cd safestreet
```
