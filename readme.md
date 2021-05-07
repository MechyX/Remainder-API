Remainders REST api

<h4> STEPS TO RUN LOCALLY </h4>
<p> Create a folder named <code>config</code>and inside create a file named <code>config.env</code>and add the add the following variables </p>
<p><code> PORT </code>PORT TO RUN THE SERVER ON</p>
<p><code> MONGO_URI </code>The Cluster URI(MongoDB Database)</p>
<p><code> JWT_SECRET </code>The JWT Secret (any string)</p>
<p><code> SERVICE_EMAIL </code>The email to send remainder emails from</p>
<p><code> SERVICE_EMAIL_PWD </code>The password for the above email</p>
<h6>Also Certain SMTP servers like google does not allow unauthorized apps, So Be sure to allow the functionality</h6> 

<p> Run <code> npm install </code> to install all dependencies </p>
<p> Run <code> npm run dev </code> to start the server in dev mode</p>
<p> Run <code> npm start </code> to start the server in prod mode</p>



API Docs:
https://documenter.getpostman.com/view/12609336/TzRRCTTv

