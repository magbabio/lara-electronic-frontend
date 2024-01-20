import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const customers = [...Array(24)].map((_, index) => ({
  id: faker.string.uuid(),
  created_at: sample([
    '18/12/2023',
    '01/12/2023',
    '20/11/2023',
  ]),
  document_type: sample([
    'V',
    'V',
    'J',
  ]),
  document_number: sample([
    '12345678',
    '28348251',
    '87654321',
  ]),
  first_name: sample([
    'Mariel',
    'José',
    'Gipsell',
  ]),
  last_name: sample([
    'García',
    'Pérez',
    'Cuellar',
  ]),
}));
