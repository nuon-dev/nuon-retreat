#var/www/html
pnpm run build
sftp iubns@112.145.135.65:/var/www/nuon << EOF
rm -R *
put -r ./out/* ./
EOF

#ssh iubns@112.145.135.65 << EOF
#cd /home/nuon
#sh start.sh
#EOF