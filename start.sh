git pull
cd client
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
npm run start &
cd ..
cd server
forever start -v -c ts-node src/index.ts