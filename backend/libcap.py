import json
import requests
import pydivert
import random

def send_packet_to_server(packet):
       
      
        if packet.ipv4:
            if packet.tcp or packet.udp or packet.icmp:
                src_ip = packet.src_addr
                dst_ip = packet.dst_addr
                protocol = "TCP" if packet.tcp else "UDP" if packet.udp else "ICMP"
                src_port = packet.src_port if packet.tcp or packet.udp else None
                dst_port = packet.dst_port if packet.tcp or packet.udp else None

            # Create a JSON payload
                packet_data = {
                    "source_ip": src_ip,
                    "destination_ip": dst_ip,
                    "protocol": protocol,
                    "source_port": src_port,
                    "destination_port": dst_port
                }

            # Convert packet data to JSON format
                json_packet_data = json.dumps(packet_data)

            # Send JSON data to Express.js server
                url = 'http://localhost:3001/receive-packets'
                headers = {'Content-Type': 'application/json'}
                response = requests.post(url, data=json_packet_data, headers=headers)
                print(response.text)  # Print response from the server (optional)
                if response.text == 'Packet allowed' or response.text == 'Source IP not found in the database':
                    return packet  # Release the packet
                else:
                    return None  # Drop the packet

            elif packet.ipv6:
                return None
        
        
        

def continuous_packet_interception():
    with pydivert.WinDivert("tcp.SrcPort == 80 or tcp.SrcPort == 443  or udp.SrcPort==80 or udp.SrcPort==443") as w:
        try:
            while True:
                packet = w.recv()  # Receive a single packet
                packet = send_packet_to_server(packet)
                if packet is not None:  # Send the packet only if it's not dropped
                    w.send(packet)
                    print("Packet sent back to network")
                else:
                    print("Packet dropped!")
        except KeyboardInterrupt:
            print("Packet interception stopped.")

if __name__ == "__main__":
    continuous_packet_interception()
