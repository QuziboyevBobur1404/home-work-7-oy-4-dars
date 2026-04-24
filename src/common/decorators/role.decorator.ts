
import { SetMetadata } from '@nestjs/common';
import { roleUser } from 'src/shared/enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: roleUser[]) => SetMetadata(ROLES_KEY, roles);
