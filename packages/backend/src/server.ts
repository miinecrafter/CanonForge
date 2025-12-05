import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { PORT } from './config/constants';

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});