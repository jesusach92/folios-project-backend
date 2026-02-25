#!/bin/bash
# Quick setup script for development

echo "🚀 Production Control Backend Setup"
echo "===================================="

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "✓ .env created. Please update database credentials if needed."
else
    echo "✓ .env already exists"
fi

# Step 2: Check if Docker is available for MySQL
if command -v docker &> /dev/null; then
    echo "🐳 Docker found. Starting MySQL..."
    docker-compose up -d
    echo "✓ MySQL started. Waiting for it to be ready..."
    sleep 5
else
    echo "⚠️  Docker not found. Make sure MySQL is running on localhost:3306"
fi

# Step 3: Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  - Update .env with your database credentials if needed"
echo "  - Ensure MySQL is running: docker-compose up -d"
echo "  - Run development server: npm run dev"
echo "  - Or start production server: npm start"
echo ""
