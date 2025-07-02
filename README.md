# DataViz Studio 📊

**An Interactive Data Visualization and Analysis Platform**

DataViz Studio is a powerful web-based tool that transforms your raw data into meaningful insights through automated analysis, intelligent summarization, and real-time interactive visualizations. Upload your Excel/CSV files, get instant AI-powered summaries, and create custom charts with an integrated code editor - all in one seamless platform.

## 🚀 Key Features

### 📈 **Smart Data Analysis**
- **Instant Upload & Summary**: Upload Excel/CSV files and get AI-generated business insights
- **Automated Report Generation**: Get comprehensive data summaries with key metrics and trends
- **Multi-format Support**: Works with CSV, Excel, and other common data formats

### 🎨 **Interactive Canvas Editor**
- **Drag & Drop Interface**: Arrange charts, graphs, and text elements freely on a canvas
- **Real-time Code Editor**: Edit Python/matplotlib code on-the-fly and see instant results
- **Live Preview**: See your visualization changes in real-time as you type
- **Export Options**: Download your complete canvas as high-quality images

### 🤖 **AI-Powered Query Engine**
- **Natural Language Queries**: Ask questions about your data in plain English
- **Automated Chart Generation**: Get relevant visualizations based on your queries
- **Code Transparency**: See and modify the underlying Python code for each chart

### ⚡ **Professional Tools**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Text Annotations**: Add custom text, titles, and annotations to your visualizations
- **Layer Management**: Control the stacking order of elements on your canvas
- **Template System**: Save and reuse your favorite chart configurations

## 🏗️ Project Architecture

```
DataViz-Studio/
├── 📁 backend/                    # Django REST API Server
│   ├── 📁 api/                   # Core API application
│   │   ├── 📁 logic/            # Business logic modules
│   │   │   ├── summarizer.py    # AI-powered data summarization
│   │   │   ├── visualiser.py    # Chart generation engine
│   │   │   └── query_processor.py # Natural language processing
│   │   ├── models.py            # Data models
│   │   ├── views.py             # API endpoints
│   │   └── serializers.py       # Data serialization
│   ├── 📁 media/                # File uploads storage
│   ├── .env.example             # Environment configuration template
│   ├── manage.py                # Django management script
│   └── requirements.txt         # Python dependencies
│
├── 📁 frontend/                  # React.js Web Application
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   │   ├── CanvasEditor.jsx # Interactive canvas interface
│   │   │   ├── CodeEditor.jsx   # Real-time code editing
│   │   │   ├── FileUpload.jsx   # Drag-drop file upload
│   │   │   └── ResultColumn.jsx # Summary display
│   │   ├── 📁 styles/          # CSS styling
│   │   └── App.jsx             # Main application component
│   ├── package.json            # Node.js dependencies
│   └── vite.config.js          # Build configuration
│
├── 📄 .gitignore              # Git ignore rules
└── 📄 README.md               # This documentation
```

## 🔧 Prerequisites

Before setting up DataViz Studio, ensure you have:

- **Python 3.8+** - [Download here](https://python.org/downloads/)
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Setup Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/divyansh/DataViz-Studio.git
cd DataViz-Studio


```

### 2️⃣ Backend Setup (Django + Python)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env file with your settings (API keys, etc.)

# Start the Django development server
python manage.py runserver
```

**Backend will be running at:** `http://localhost:8000`

### 3️⃣ Frontend Setup (React + Vite)

Open a **new terminal** and run:

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

**Frontend will be running at:** `http://localhost:5173`

## 🎯 How to Use DataViz Studio

### Step 1: Upload Your Data
1. Open the application in your browser
2. Drag and drop your Excel/CSV file into the upload area
3. Wait for automatic processing and AI summary generation

### Step 2: Explore Your Data
- **Summary Panel**: Review AI-generated insights about your data
- **Key Metrics**: See important statistics and trends
- **Data Preview**: Examine your uploaded dataset

### Step 3: Create Visualizations
- **Ask Questions**: Type natural language queries like "show sales by region"
- **Auto-Generate**: Watch as charts are automatically created
- **Customize**: Use the code editor to modify chart appearance and behavior

### Step 4: Build Your Dashboard
- **Canvas Editor**: Drag charts and elements around the canvas
- **Add Text**: Insert titles, labels, and annotations
- **Layer Control**: Organize elements with front/back controls
- **Export**: Download your complete dashboard as an image

## 🔧 Environment Configuration

### Backend Environment (.env)

```env
# Django Settings
SECRET_KEY=your-super-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# AI/ML API Keys
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key  # Optional

# File Storage
MEDIA_ROOT=media/
MEDIA_URL=/media/

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend Environment

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# Development Settings
VITE_DEV_MODE=true
```

## 🧪 Testing Your Setup

### Test Backend API

```bash
# Test file upload endpoint
curl -X GET http://localhost:8000/api/
# Should return API status

# Test with a sample file
curl -X POST http://localhost:8000/api/upload/ \
  -F "file=@sample.csv"
```

### Test Frontend

1. Open `http://localhost:5173` in your browser
2. You should see the DataViz Studio interface
3. Try uploading a sample CSV file
4. Verify that summaries and charts are generated

## 📚 API Documentation

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload/` | Upload data files |
| `POST` | `/api/query-graph/` | Generate charts from queries |
| `POST` | `/api/query-answer/` | Get text answers about data |
| `GET` | `/media/uploads/{file}` | Access uploaded files |
| `GET` | `/media/plots/{image}` | Access generated charts |

### Upload File Example

```javascript
const formData = new FormData();
formData.append('file', selectedFile);

fetch('http://localhost:8000/api/upload/', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Summary:', data.summary);
  console.log('File ID:', data.file_id);
});
```

### Generate Chart Example

```javascript
fetch('http://localhost:8000/api/query-graph/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    file_id: 123,
    query: "Create a bar chart showing sales by product category"
  })
})
.then(response => response.json())
.then(data => {
  console.log('Generated chart:', data.image_path);
  console.log('Python code:', data.code);
});
```

## 🎨 Customization Guide

### Adding New Chart Types

1. **Backend**: Edit `backend/api/logic/visualiser.py`
2. **Add Chart Function**: Create new plotting functions
3. **Update Query Processor**: Modify `query_processor.py` to recognize new chart types

### Styling the Interface

1. **Global Styles**: Edit `frontend/src/styles/App.css`
2. **Component Styles**: Modify individual CSS files in `frontend/src/styles/`
3. **Canvas Appearance**: Customize `CanvasEditor.css` for canvas styling

## 🔧 Development Tips

### Running in Development Mode

```bash
# Backend with auto-reload
cd backend && python manage.py runserver

# Frontend with hot reload
cd frontend && npm run dev

# Note: Python standalone scripts are not tracked in Git
# Create your own python/ folder locally if needed for testing
```

### Repository Cleanup

If you've accidentally committed the python folder, clean it up:

```bash
# Remove python folder from Git tracking (keeps local files)
git rm -r --cached python/

# Add and commit the gitignore changes
git add .gitignore
git commit -m "Remove python folder from tracking and update gitignore"

# Push changes
git push origin main
```

## 🚀 Production Deployment

### Backend (Django)

```bash
# Install production server
pip install gunicorn

# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn myproject.wsgi:application --bind 0.0.0.0:8000
```

### Frontend (React)

```bash
# Build for production
npm run build

# Serve with nginx or similar
# Build files will be in dist/ directory
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

**Problem**: Charts not generating  
**Solution**: Check that all Python dependencies are installed and API keys are configured

**Problem**: File upload fails  
**Solution**: Verify file size limits and CORS settings

**Problem**: Frontend can't connect to backend  
**Solution**: Ensure both servers are running and check network settings

---

**DataViz Studio** - *Transform your data into insights with AI-powered visualization*

Built with ❤️ using Django, React, Python, and modern web technologies.
