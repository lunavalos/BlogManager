import * as migration_20260505_183843 from './20260505_183843';

export const migrations = [
  {
    up: migration_20260505_183843.up,
    down: migration_20260505_183843.down,
    name: '20260505_183843'
  },
];
