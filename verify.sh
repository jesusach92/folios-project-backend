#!/bin/bash
# Verification checklist - run this to verify all files are in place

echo "🔍 Verifying Production Control Backend Structure..."
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/"
        return 1
    fi
}

MISSING=0

echo "📁 Directories:"
check_dir "src" || ((MISSING++))
check_dir "src/config" || ((MISSING++))
check_dir "src/routes" || ((MISSING++))
check_dir "src/controllers" || ((MISSING++))
check_dir "src/services" || ((MISSING++))
check_dir "src/repositories" || ((MISSING++))
check_dir "src/middlewares" || ((MISSING++))
check_dir "src/types" || ((MISSING++))
check_dir "src/utils" || ((MISSING++))

echo ""
echo "⚙️ Configuration Files:"
check_file "package.json" || ((MISSING++))
check_file "tsconfig.json" || ((MISSING++))
check_file ".env.example" || ((MISSING++))
check_file ".env.local" || ((MISSING++))
check_file ".gitignore" || ((MISSING++))
check_file "docker-compose.yml" || ((MISSING++))

echo ""
echo "📚 Documentation:"
check_file "README.md" || ((MISSING++))
check_file "QUICKSTART.md" || ((MISSING++))
check_file "ARCHITECTURE.md" || ((MISSING++))
check_file "API_EXAMPLES.md" || ((MISSING++))
check_file "PROJECT_SUMMARY.md" || ((MISSING++))
check_file "FILE_STRUCTURE.md" || ((MISSING++))

echo ""
echo "🗄️ Database:"
check_file "DATABASE_SCHEMA.sql" || ((MISSING++))

echo ""
echo "🔐 Config Files:"
check_file "src/config/database.ts" || ((MISSING++))
check_file "src/config/jwt.ts" || ((MISSING++))

echo ""
echo "🛣️ Route Files:"
check_file "src/routes/auth.routes.ts" || ((MISSING++))
check_file "src/routes/users.routes.ts" || ((MISSING++))
check_file "src/routes/clients.routes.ts" || ((MISSING++))
check_file "src/routes/projects.routes.ts" || ((MISSING++))
check_file "src/routes/sections.routes.ts" || ((MISSING++))
check_file "src/routes/folios.routes.ts" || ((MISSING++))
check_file "src/routes/processes.routes.ts" || ((MISSING++))

echo ""
echo "🎮 Controller Files:"
check_file "src/controllers/AuthController.ts" || ((MISSING++))
check_file "src/controllers/UserController.ts" || ((MISSING++))
check_file "src/controllers/ClientController.ts" || ((MISSING++))
check_file "src/controllers/ProjectController.ts" || ((MISSING++))
check_file "src/controllers/SectionController.ts" || ((MISSING++))
check_file "src/controllers/FolioController.ts" || ((MISSING++))
check_file "src/controllers/ProcessController.ts" || ((MISSING++))

echo ""
echo "⚙️ Service Files:"
check_file "src/services/AuthService.ts" || ((MISSING++))
check_file "src/services/UserService.ts" || ((MISSING++))
check_file "src/services/ClientService.ts" || ((MISSING++))
check_file "src/services/ProjectService.ts" || ((MISSING++))
check_file "src/services/SectionService.ts" || ((MISSING++))
check_file "src/services/FolioService.ts" || ((MISSING++))
check_file "src/services/ProcessService.ts" || ((MISSING++))

echo ""
echo "🗃️ Repository Files:"
check_file "src/repositories/UserRepository.ts" || ((MISSING++))
check_file "src/repositories/ClientRepository.ts" || ((MISSING++))
check_file "src/repositories/ProjectRepository.ts" || ((MISSING++))
check_file "src/repositories/SectionRepository.ts" || ((MISSING++))
check_file "src/repositories/FolioRepository.ts" || ((MISSING++))
check_file "src/repositories/ProcessRepository.ts" || ((MISSING++))
check_file "src/repositories/AuditRepository.ts" || ((MISSING++))

echo ""
echo "🔒 Middleware Files:"
check_file "src/middlewares/auth.ts" || ((MISSING++))

echo ""
echo "📝 Type & Utility Files:"
check_file "src/types/index.ts" || ((MISSING++))
check_file "src/utils/constants.ts" || ((MISSING++))
check_file "src/utils/errors.ts" || ((MISSING++))

echo ""
echo "🎯 Application Files:"
check_file "src/server.ts" || ((MISSING++))
check_file "src/app.ts" || ((MISSING++))

echo ""
echo "=================================================="
if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✓ All files are in place!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. npm install"
    echo "2. cp .env.example .env"
    echo "3. docker-compose up -d"
    echo "4. npm run dev"
else
    echo -e "${RED}✗ $MISSING files are missing!${NC}"
    exit 1
fi
