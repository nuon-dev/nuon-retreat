#var/www/html
npm run out
sftp iubns@112.145.135.65:/var/www/html << EOF
rm -R *
put -r ./out/* ./
EOF

ssh iubns@112.145.135.65 << EOF
cd /home/nuon-retreat
sh start.sh
EOF