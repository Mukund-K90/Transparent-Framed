const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 1822;
const multer = require('multer');
const upload = multer();
const dotenv = require('dotenv');
dotenv.config();

app.set("view engine", 'ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views/pages'));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.render("home")
})
app.use(bodyParser.json({ limit: "10mb" }));

async function removeBg(imageBlob) {

    const formData = new URLSearchParams();
    formData.append("size", "auto");
    formData.append("image_file_b64", imageBlob);

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": 'cH4zEbeK35UgU8vfDcpRzVD8' },
        body: formData,
    });

    if (response.ok) {
        return await response.arrayBuffer();
    } else {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${response.statusText} - ${errorText}`);
    }
}

app.post('/change-bg', async (req, res) => {
    try {
        const { imageBlob } = req.body;

        if (!imageBlob) {
            throw new Error('No image blob provided');
        }

        const rbgResultData = await removeBg(imageBlob);

        res.send({
            success: true,
            rbgResultData: Buffer.from(rbgResultData),
        });
    } catch (error) {
        console.error('Error in /change-bg:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
app.listen(PORT, () => console.log(`Server is running on ${PORT}`))