# Voltage ![logo](./front_end/src/images/icon.png)
Voltage is a project aims to provide a better voting experience for both the organizers and the voters using the 
Ethereum blockchain. 

# What Voltage can bring to your community?
- It makes the whole process more cost-effective as physical polling station and paper ballots are no longer needed. 
  By using the Ethereum blockchain, the cost per vote is brought down from $7 - $25 to $0.5.
- The immutability of blockchain provides the protection from any fraud and removes the need of having an audition after
  the election or survey for the community.
- The instantaneous result can be viewed any time by interacting with the smart contract, so your voters can check if 
  their vote successfully goes through easily while you can keep track of the result anytime during the event.
- Removing the need of transportation or mail for voting can greatly increase the motivation of your community members 
  for participating the election or survey you organize. In addition, Voltage allows you to provide a small amount of 
  Ethereum or ERC20 token as a reward for participating the event. As a result, you can keep the engagement and maintain
  a good relationship with your community.

# Architecture of Voltage
- A back-end server that will communicate with the MongoDB database for saving the details of your event and the login
  info of all users.
- A smart contract will be deployed when you create a new voting event for your community.
- A front-end interface that allows you and your community to interact with the smart contract for your events and view 
  the current status of any events
- 