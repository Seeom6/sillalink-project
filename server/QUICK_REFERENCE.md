# SillaLink Server - Quick Reference Guide

## Module Structure Template

When creating a new module, follow this exact structure:

```
src/modules/{module-name}/
├── api/
│   ├── controllers/
│   │   ├── {module}.controller.ts      # Public endpoints
│   │   └── {module}.admin.controller.ts # Admin endpoints
│   ├── dto/
│   │   └── request/
│   │       ├── create-{module}.dto.ts
│   │       ├── update-{module}.dto.ts
│   │       └── get-all-{module}.dto.ts
│   └── validation/
│       └── {module}.validation.pipe.ts
├── database/
│   ├── schemas/
│   │   └── {module}.schema.ts
│   └── repositories/
│       └── {module}.repository.ts
├── services/
│   ├── {module}.service.ts
│   └── {module}.error.ts
├── interfaces/
│   └── {module}-types.ts
├── {module}.module.ts
└── index.ts
```

## Quick Commands

```bash
# Development
yarn containers:up && yarn start:dev

# Build & Test
yarn build && yarn test

# Database
yarn seed

# Health Check
curl http://localhost:5000/api/v1/health
```

## Error Code Ranges

| Module | Range | Next Available |
|--------|-------|----------------|
| Auth System | 4000-4999 | 4015 |
| User Management | 2000-2999 | 2003 |
| Employee Management | 3000-3999 | 3003 |
| Project Management | 5000-5999 | 5007 |
| Technology Management | 6000-6999 | 6005 |
| Service Management | 7000-7999 | 7003 |
| **Next New Module** | **8000-8999** | 8001 |

## Common Patterns

### Controller Pattern
```typescript
@AuthControllerAdmin({ prefix: 'resource' })
export class ResourceAdminController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateResourceDto) {
    return this.resourceService.create(dto);
  }
}
```

### Service Pattern
```typescript
@Injectable()
export class ResourceService {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly resourceError: ResourceError
  ) {}

  async findById(id: string) {
    const resource = await this.resourceRepository.findById(id);
    if (!resource) {
      this.resourceError.throw(ErrorCode.RESOURCE_NOT_FOUND);
    }
    return resource;
  }
}
```

### Repository Pattern
```typescript
@Injectable()
export class ResourceRepository extends BaseMongoRepository<Resource> {
  constructor(
    @InjectModel(Resource.name)
    private readonly resourceModel: Model<Resource>
  ) {
    super(resourceModel);
  }
}
```

### Schema Pattern
```typescript
@Schema({ timestamps: true })
export class Resource {
  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt?: Date;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
```

## API Route Patterns

```
/api/v1/admin/{resource}     # Admin CRUD operations
/api/v1/website/{resource}   # Public/client operations
/api/v1/{resource}           # System operations
```

## Import Aliases

```typescript
// Packages
import { BaseRepository } from '@Package/database/mongodb';
import { UserPayload } from '@Package/auth';
import { ControllerWeb } from '@Package/api';

// Modules
import { UserService } from '@Modules/user-management';
import { ErrorCode } from '@Common/error/error-code';
```

## Environment Variables Template

```bash
# Add to .env for new features
NEW_FEATURE_ENABLED=true
NEW_SERVICE_URL=http://localhost:3000
NEW_API_KEY=your-api-key
```

## Testing Patterns

```typescript
describe('ResourceService', () => {
  let service: ResourceService;
  let repository: ResourceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceService,
        { provide: ResourceRepository, useValue: mockRepository }
      ]
    }).compile();

    service = module.get<ResourceService>(ResourceService);
    repository = module.get<ResourceRepository>(ResourceRepository);
  });
});
```

## Troubleshooting Checklist

- [ ] Module added to `src/modules/index.ts`?
- [ ] Error codes in unique range?
- [ ] All imports using correct aliases?
- [ ] Schema properly exported?
- [ ] Repository extending BaseMongoRepository?
- [ ] Service injecting dependencies correctly?
- [ ] Controllers using proper decorators?
- [ ] DTOs following naming convention?

## Useful Endpoints for Development

```bash
# Health checks
GET /api/v1/health
GET /api/v1/health/database
GET /api/v1/health/redis

# Admin auth
POST /api/v1/admin/auth/login
GET /api/v1/admin/auth/me

# Public auth
POST /api/v1/website/auth/register
POST /api/v1/website/auth/log-in
```

---

For detailed information, see [ARCHITECTURE.md](./ARCHITECTURE.md)
