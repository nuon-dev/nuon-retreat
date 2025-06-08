#var/www/html
pnpm run build
sftp net:/var/www/nuon << EOF
rm -R *
put -r ./out/* ./
EOF

ssh net << EOF
cd /home/nuon
sh start.sh
EOF