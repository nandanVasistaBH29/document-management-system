module.exports = {
  apps: [
    {
      script: "npm start", // because this starts the next.js server
    },
  ],

  deploy: {
    production: {
      key: "serverkey.pem", //key of linux server
      user: "ubuntu",
      host: "13.127.184.210", //public IP
      ref: "origin/main", //in git origin/main
      repo: "git@github.com:nandanVasistaBH29/document-management-system.git",
      path: "/home/ubuntu",
      "pre-deploy-local": "",
      "post-deploy":
        "source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      ssh_options: "ForwardAgent=yes",
    },
  },
};
