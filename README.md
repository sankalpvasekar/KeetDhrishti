# KeetDhrishti

## 🎥 YouTube Demo
(Add YouTube video link here after upload)

## Project Description
KeetDhrishti is an AI-powered insect identification system that uses Convolutional Neural Networks (CNN) and OpenAI integration to classify insects and provide detailed information about them.

## Tech Stack
- **Backend**: Python, FastAPI, TensorFlow 2.15.0, OpenAI API
- **Frontend**: React 18, Vite, TailwindCSS, Lucide React
- **Machine Learning**: CNN Model (Keras), NumPy, Pillow
- **API**: RESTful endpoints with FastAPI
- **Environment**: Node.js 16+, Python 3.8+

## How to Run
1. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Configure Environment**:
   - Add OpenAI API key to `backend/.env`
   - Place your trained model in `backend/models/insect_best.keras`
   - Add class names to `backend/data/classes.txt`

## Local Server
- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:5173
