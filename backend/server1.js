import express from 'express';
import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import path from 'path';
import connectDB from './database.js';
import cors from 'cors';
import { log, timeStamp } from 'console';
import fs from 'fs';


const app = express();
app.use(cors());


connectDB();

const firewallRuleSchema =  new mongoose.Schema({
    sourceIP: {
      type: String,
      required: true
    },
    destinationIP: {
      type: String,
      required: true
    },
    portNumber: {
      type: Number,
      required: true
    },
    protocolNumber: {
      type: Number,
      required:true
    },
    action:{
        type:String,
        enum:["Allow","Deny"],
        required:true
    }
  },{timeStamps:true});
  
  const FirewallRule = mongoose.model('FirewallRule', firewallRuleSchema);
 // export default FirewallRule;

app.use(express.json());

async function main() {
    // Connect to MongoDB Atlas
    

    

    // Get all rules
    app.get('/api/rules', async (req, res) => {
        try {
            const rules = await FirewallRule.find();

            res.json(rules);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Create a new rule
    app.post('/api/rules', async (req, res) => {
        try {
            // const rule = new FirewallRule(req.body);
            const rule = {
                sourceIP: req.body.sourceIP,
                destinationIP: req.body.destinationIP,
                portNumber: req.body.portNumber,
                protocolNumber: req.body.protocolNumber,
                action: req.body.action
            };
            
            const newrule=await FirewallRule.create(rule);
            await newrule.save();
            res.status(201).json(rule);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Update a rule
    app.put('/api/rules/:id', async (req, res) => {
        try {
            const ruleId = req.params.id;
            const updatedRule = await FirewallRule.findByIdAndUpdate(ruleId, req.body, { new: true });
            if (!updatedRule) {
                return res.status(404).json({ error: 'Rule not found' });
            }
            res.json(updatedRule);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Delete a rule
    app.delete('/api/rules/:id', async (req, res) => {
        try {
            const ruleId = req.params.id;
            const deletedRule = await FirewallRule.findByIdAndDelete(ruleId);
            if (!deletedRule) {
                return res.status(404).json({ error: 'Rule not found' });
            }
            res.json({ message: 'Rule deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    
}

main().catch(console.error);

// Route to receive packet information from Flask server
app.post('/receive-packets', async (req, res) => {
    // Extracting information from the received JSON data
    const { source_ip, destination_ip, protocol, source_port, destination_port } = req.body;

    // Displaying extracted information in the console (or do further processing)
    console.log('Source IP:', source_ip);
    console.log('Destination IP:', destination_ip);
    console.log('Protocol:', protocol);
    console.log('Source Port:', source_port);
    console.log('Destination Port:', destination_port);
    
    try {
        const result = await FirewallRule.findOne({ destinationIP: destination_ip }).exec();

        if (result) {
            if (result.action === 'Allow') {
                console.log(result.body);
                res.send('Packet allowed');
            } 
            
            else if (result.action === 'Deny') {
                // Write the result details to a separate file
                const logMessage = `Source IP: ${source_ip}, Destination IP: ${destination_ip}, Protocol: ${protocol}, Source Port: ${source_port}, Destination Port: ${destination_port}\n`;
    
                fs.appendFile("C:/Users/91938/Desktop/backend/deny-log.txt", logMessage, (err) => {
                    if (err) {
                        console.error('Error writing to log file:', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        console.log('Details written to log file');
                        res.send('Packet denied and details logged');
                    }
                });
                console.log(logMessage);
            }
            
            else {
                res.send(null);
            }
        }

        else {
            res.send('Source IP not found in the database');
        }
    } catch (error) {
        console.error('Error occurred while searching the database:', error);
        res.status(500).send('Internal Server Error');
    }
    

});

// Start the Express server
const PORT = 3001; // Replace with your desired port number
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
