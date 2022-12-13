import { normalize_date_test } from '../../utils/api/configurations'
import '@testing-library/jest-dom'

test('normalizes the date', () => {
  let abnormal_date_string = '2022-11-21T17:16:20.491Z'
  expect(normalize_date_test(abnormal_date_string)).toContain('Nov 21 2022 at 11:16:20 AM');
});