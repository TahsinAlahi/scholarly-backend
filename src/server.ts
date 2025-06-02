import app from "./app";

const port = (process.env.PORT as string) || 3000;

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
