import express from 'express';
const app = express();


app.use(express.json());

// Route to receive packet information from Flask server
app.post('/receive-packets', (req, res) => {
    // Extracting information from the received JSON data
    const { source_ip, destination_ip, protocol, source_port, destination_port } = req.body;

    // Displaying extracted information in the console (or do further processing)
    console.log('Source IP:', source_ip);
    console.log('Destination IP:', destination_ip);
    console.log('Protocol:', protocol);
    console.log('Source Port:', source_port);
    console.log('Destination Port:', destination_port);

    // Send a response (optional)
    res.send('Packet information received and processed successfully.');
});

// Start the Express server
const PORT = 3001; // Replace with your desired port number
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
