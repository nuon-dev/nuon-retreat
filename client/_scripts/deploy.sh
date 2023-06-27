#var/www/html
npm run build
sftp iubns@112.145.135.65:/home/nuon << EOF
put -r ./.next/* client
EOF

ssh iubns@112.145.135.65 << EOF
cd /home/nuon
sh start.sh
EOF