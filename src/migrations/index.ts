import * as migration_20260505_183843 from './20260505_183843';
import * as migration_20260527_182830 from './20260527_182830';

export const migrations = [
  {
    up: migration_20260505_183843.up,
    down: migration_20260505_183843.down,
    name: '20260505_183843',
  },
  {
    up: migration_20260527_182830.up,
    down: migration_20260527_182830.down,
    name: '20260527_182830'
  },
];
