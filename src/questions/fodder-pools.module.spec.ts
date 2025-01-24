import { FodderPoolsModule } from './fodder-pools.module';
import { FodderPoolsService } from './fodder-pools.service';
import { FodderPoolsController } from './fodder-pools.controller';
import { FodderPool, FodderItem } from './entities';
import { ModuleTestFactory } from '../common/test/module-test.factory';

describe('FodderPoolsModule', () => {
  const testFactory = new ModuleTestFactory({
    module: FodderPoolsModule,
    imports: [FodderPoolsModule],
    providers: [FodderPoolsService],
    controllers: [FodderPoolsController],
    exports: [FodderPoolsService],
    entities: [FodderPool, FodderItem],
  });

  // Run common module tests
  testFactory.createTestCases(describe);

  // Add module-specific tests here if needed
});
