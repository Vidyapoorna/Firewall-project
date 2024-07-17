import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Homepage.css'; 

const Homepage = () => {
  const [rules, setRules] = useState([]);
  const [change,setChange] =useState(false);
  const [newRule, setNewRule] = useState({
    sourceIP: '',
    destinationIP: '',
    portNumber: '',
    protocolNumber: '',
    action: ''
  });

  const [updateRuleData, setUpdateRuleData] = useState({
    sourceIP: '',
    destinationIP: '',
    portNumber: '',
    protocolNumber: '',
    action: ''
  });

  
  const apiBaseUrl = 'http://localhost:3001'; 
  const [selectedRule, setSelectedRule] = useState(null);

  useEffect(() => {
    // Fetch initial rules from the database when the component mounts
    fetchRules();
  }, [change]);

  const fetchRules = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/rules`); // Replace with your API endpoint
      setRules(response.data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  // const addRule = async () => {
  //   try {
  //     const response = await axios.post(`${apiBaseUrl}/api/rules`, newRule);
  //     console.log("ggvghvyg") // Replace with your API endpoint
  //     setRules([...rules, response.data]);
  //     setNewRule({
  //       sourceIP: '',
  //       destinationIP: '',
  //       portNumber: '',
  //       protocolNumber: '',
  //       action: ''
  //     });
  //   } catch (error) {
  //     console.error('Error adding rule:', error);
  //   }
  // };


  const addRule = async () => {
    console.log("Attempting to add rule:", newRule);
    try {
      const response = await axios.post(`${apiBaseUrl}/api/rules`, newRule);
      console.log("Response after adding rule:", response.data);
      setRules([...rules, response.data]);
      setNewRule({
        sourceIP: '',
        destinationIP: '',
        portNumber: '',
        protocolNumber: '',
        action: ''
      });
      setChange(!change);
    } catch (error) {
      console.error('Error adding rule:', error);
    }
  };
  

  // const updateRule = async () => {
  //   if (selectedRule) {
  //     try {
  //       const response = await axios.put(`${apiBaseUrl}/api/rules/${selectedRule._id}`, newRule); // Replace with your API endpoint
  //       setRules(rules.map(rule => (rule._id === selectedRule._id ? response.data : rule)));
  //       setSelectedRule(null);
  //       setNewRule({
  //         sourceIP: '',
  //         destinationIP: '',
  //         portNumber: '',
  //         protocolNumber: '',
  //         action: ''
  //       });
  //     } catch (error) {
  //       console.error('Error updating rule:', error);
  //     }
  //   }
  // };

  const updateRule = async () => {
    if (selectedRule) {
      try {
        const response = await axios.put(`${apiBaseUrl}/api/rules/${selectedRule._id}`, updateRuleData); 
        setRules(rules.map(rule => (rule._id === selectedRule._id ? response.data : rule)));
        setSelectedRule(null);
        setUpdateRuleData({
          sourceIP: '',
          destinationIP: '',
          portNumber: '',
          protocolNumber: '',
          action: ''
        });
      } catch (error) {
        console.error('Error updating rule:', error);
      }
    }
  };
  

  const deleteRule = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/rules/${id}`); // Replace with your API endpoint
      setRules(rules.filter(rule => rule._id !== id));
      setSelectedRule(null);
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  return (
    <>
    <div className="container">
      <div className="content">
        <h2>Network Admin Interface</h2>
        <h3>Add Rules</h3>
        <div className="form-group">
          <input 
            className="input-field"
            type="text" 
            value={newRule.sourceIP} 
            placeholder="Source IP" 
            onChange={(e) => setNewRule(prevState => ({ ...prevState, sourceIP: e.target.value }))} 
          />
          <input 
            className="input-field"
            type="text" 
            value={newRule.destinationIP} 
            placeholder="Destination IP" 
            onChange={(e) => setNewRule(prevState => ({ ...prevState, destinationIP: e.target.value }))} 
          />
          <input 
            className="input-field"
            type="number" 
            value={newRule.portNumber} 
            placeholder="Port Number" 
            onChange={(e) => setNewRule(prevState => ({ ...prevState, portNumber: e.target.value }))} 
          />
          <input 
            className="input-field"
            type="number" 
            value={newRule.protocolNumber} 
            placeholder="Protocol Number" 
            onChange={(e) => setNewRule(prevState => ({ ...prevState, protocolNumber: e.target.value }))} 
          />
          <input 
            className="input-field"
            type="text" 
            value={newRule.action} 
            placeholder="Action" 
            onChange={(e) => setNewRule(prevState => ({ ...prevState, action: e.target.value }))} 
          />
          <button className="button" onClick={addRule}>Add Rule</button>
        </div>
        {selectedRule && (
          <div className="form-group">
            <input 
              className="input-field"
              type="text" 
              value={updateRuleData.sourceIP} 
              placeholder="Update Source IP" 
              onChange={(e) => setUpdateRuleData(prevState => ({ ...prevState, sourceIP: e.target.value }))} 
            />

            <input 
              className="input-field"
              type="text" 
              value={updateRuleData.destinationIP} 
              placeholder="Update Destination IP" 
              onChange={(e) => setUpdateRuleData(prevState => ({ ...prevState, destinationIP: e.target.value }))} 
            />


            <input 
              className="input-field"
              type="text" 
              value={updateRuleData.portNumber} 
              placeholder="Update Port Number" 
              onChange={(e) => setUpdateRuleData(prevState => ({ ...prevState, portNumber: e.target.value }))} 
            />

            <input 
              className="input-field"
              type="text" 
              value={updateRuleData.protocolNumber} 
              placeholder="Update Protocol Number" 
              onChange={(e) => setUpdateRuleData(prevState => ({ ...prevState, protocolNumber: e.target.value }))} 
            />

            <input 
              className="input-field"
              type="text" 
              value={updateRuleData.action} 
              placeholder="Update Action" 
              onChange={(e) => setUpdateRuleData(prevState => ({ ...prevState, action: e.target.value }))} 
            />  
            
            {/* Add input fields for other attributes similarly */}
            <button className="button" onClick={updateRule}>Update Rule</button>
            <button className="button" onClick={() => setSelectedRule(null)}>Cancel</button>
          </div>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>Source IP</th>
              <th>Destination IP</th>
              <th>Port Number</th>
              <th>Protocol Number</th>
              <th>Action</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {console.log(rules)}
            {rules.map(rule => (
              <tr key={rule._id}>
                <td>{rule.sourceIP}</td>
                <td>{rule.destinationIP}</td>
                <td>{rule.portNumber}</td>
                <td>{rule.protocolNumber}</td>
                <td>{rule.action}</td>
                <td>
                  <button className="button" onClick={() => setSelectedRule(rule)}>Edit</button>
                  <button className="button" onClick={() => deleteRule(rule._id)}>Delete</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default Homepage;
