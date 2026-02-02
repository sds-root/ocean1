import { treaty } from '@elysiajs/eden';
import type { App } from '../../../api/src';

export const api = treaty<App>('localhost:3000');
