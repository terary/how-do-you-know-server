import { PartialType } from '@nestjs/mapped-types';
import { CreateDevDebugDto } from './create-dev-debug.dto';

export class UpdateDevDebugDto extends PartialType(CreateDevDebugDto) {}
