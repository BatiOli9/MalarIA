import exp from "express"

const app = exp();
const PORT = 8000;

app.get("/", (req, res) => {
    res.send("Hello World!")
});

app.get("/about", (req, res) => {
    res.send("About route 🎉 ");
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});