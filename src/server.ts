import 'dotenv/config';
import express from 'express';
import mainRoute from './routes/main.route';

const app = express();

app.use(express.json());
app.use('/api', mainRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
