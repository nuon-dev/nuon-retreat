git pull
cd server
sudo forever stop 0
sudo forever start -v -c ts-node src/index.ts