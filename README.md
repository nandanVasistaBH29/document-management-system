This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Macro Details

FrontEnd -> next.js /pages folder <br />
BackEnd -> node.js /pages/api folder <br />
Database -> MySQL /utils/connectDb.js <br />
host -> localhost or any ubuntu server <br />

## API Documentation

/pages/api folder
all the API's for this application can be found int /pages/api

# auth

1. `/api/auth/create-user.js`
   req: bcryptjs(for hashing the password) and dbconnection <br />
   method:POST <br />
   ip:email,password,oid,isAdmin ; oid=>is the foriegn key stands for organization_id primary key of organization table <br />
   op: success: status(200).json("user has been created"); <br />
   cause of failure: <br />
   1.DB pool not able to provide a connection <br />
   2.ORG not found Violation of foreign key constraint <br />
   3.user already exist : email must be unique for an user <br />
   <br />
2. `/api/auth/get-all-users.js`
   desc: getting all the users belong to a particular organization with a particular oid. <br />
   req: dbconnection <br />
   method:GET <br />
   ip:oid <br />
   op: success: status(200).json(data); // an array of all users. <br />
   cause of failure: <br />
   1.DB pool not able to provide a connection <br />
   2.ORG not found Violation of foreign key constraint <br />
   <br />
3. `/api/auth/login-user.js`
   req: bcryptjs(for comparing the password entered with the hashed password which is stored in DB) and dbconnection <br />
   method:POST <br />
   ip:email,password,organizationName <br />
   op: success user details <br />
   cause of failure: <br />
   1.DB pool not able to provide a connection <br />
   2.Organization hasn't registed yet <br />
   3.user doesn't exist already exist <br />
   4.password could be wrongly entered by the user <br />
   <br />
4. `/api/auth.register-org.js`
   req:bcryptjs(for hashing the password) and dbconnection
   method:POST
   ip:organizationName,email,password,phone
   clarity:the logo upload is handled by diff api call
   op: .status(200).json("org has been created");
   cause of failure:
   1.DB pool not able to provide a connection
   2.ORG already exist or org name must be unique
   <br />

# API's related to documents

1. `/api/documents/doc-upload.ts` <br />
   `clarity`: < br/>
   1.written in TypeScript and uses formidable package to manage uploads of diffenent types of files <br /> 2. the uploaded documents can be found @ `/public/storage/${org_name}/${user_email}` <br /> 3. maxFileSize = 16000 _ 1024 _ 1024;//bits <br /> 4. need not worry about the filename clashing because `Date.now()` will be appened to file name to prevent this from happening <br /> 5. Encryption for the file can be added by uncommenting the encrypt(file) in `/api/documents/doc-upload.ts` and the logic can be found in `/utils/encryptFile` <br />
   ip : organizationName, email <br />
   op : failname <br />

2. `/api/documents/user-docs.ts` <br />
   `clarity`: < br/>
   1.written in TypeScript to return all the docs of that particular user only <br />
   2.if u need to fetch the encrypted files then 1 else 0 for decrypted files but its mandatory to pass either 0 or 1
   ip : organizationName, email,encrypted <br />
   op : array of file names <br />
3. `/api/documents/decryption` OPTIONAL <br/>
   ip: path to encrypted file
   logic for the decryption in `/utils/decryption`
4. `/api/logo-upload.ts` <br />
   `clarity`: < br/>
   1.written in TypeScript and uses formidable package to manage uploads of logos<br /> 2. the uploaded documents can be found @ `/public/logo/` <br /> 3. maxFileSize = 4000 _ 1024 _ 1024;//bits <br /> 4. need not worry about the filename clashing because `Date.now()` will be appened to file name to prevent this from happening <br />
   ip : organizationName<br />
   op : failname <br />

# Deployment

## using nginx and pm2

On local machine :
<br/>
Generate the pm2 ecosystem file.
<br/>

```bash
pm2 ecosystem
```

```javascript
module.exports = {
  apps: [
    {
      script: "npm start",
    },
  ],
  deploy: {
    production: {
      key: "key.pem",
      user: "ubuntu",
      host: "SSH_HOSTMACHINE",
      ref: "origin/main",
      repo: "GIT_REPOSITORY",
      path: "/home/ubuntu",
      "pre-deploy-local": "",
      "post-deploy":
        "source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      ssh_options: "ForwardAgent=yes",
    },
  },
};
```

```bash
git add .
git commit -m "add ecosystem"
```
Push to GitHub. <br />
## Provision server <br />
On local machine: <br/>
Change pem permission using chmod <br />
```
chmod 400 key.pem
```
<br />
Copy the pem file into project root. SSH into server.
<br />
```bash
ssh -i key.pem ubuntu@[IP_ADDRESS]
```
<br />
On the server: Install Node, PM2, and Nginx. <br />
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source .bashrc
nvm install --lts
npm i -g pm2
sudo apt-get update
sudo apt-get install -y nginx
sudo service nginx restart
```
Go to the IP address in browser using http protocol and verify Nginx welcome page.

## Configure Nginx.

<br/>
```
sudo vim /etc/nginx/conf.d/my-document.conf
```
Insert the following configuration. <br />
```javascript
server {  
 listen 80;  
 server_name IP_ADDRESS;

    location / {
        proxy_pass http://127.0.0.1:3000/;
    }

}
```
Restart Nginx.
<br />

```bash
sudo service nginx restart
````

<br />
## Deployment Options
Option 1: SSH Agent Forwarding <br/>
On local machine: <br />
Edit ssh config. <br/>
```bash
vim ~/.ssh/config
```
Insert the following.
<br/>
```bash
Host [IP_ADDRESS]
ForwardAgent yes
```
Run ssh-add. <br />
```bash
ssh-add
```

SSH into server. <br />

```bash
ssh -i key.pem ubuntu@[IP_ADDRESS]
```

On the server: <br />
Verify connection to GitHub. <br />
```bash
ssh -T git@github.com
```
 <br />
if it says not able to authenticate then u have to add the generate token and add it to git hub
<br />

### Option 2: Deploy Key

On the server:
<br/>
Run the ssh-keygen procedure.

```bash
ssh-keygen
```
Copy the public key. <br />
```bash
cat ~/.ssh/id_rsa.pub
```
On GitHub: <br />
Go to the repo Settings > Deploy keys > Add deploy key
Paste the public key and click Add key.<br />
## Deployment
On local machine: <br/>
Run pm2 setup. <br />
```bash
pm2 deploy production setup
```

Run deployment. <br />
```bash
pm2 deploy production
```
