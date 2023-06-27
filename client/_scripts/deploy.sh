#var/www/html
npm run build
sftp iubns@112.145.135.65:/home/nuon/client << EOF
put -r ./.next/* .next
EOF

ssh iubns@112.145.135.65 << EOF
cd /home/nuon
sh start.sh
EOF