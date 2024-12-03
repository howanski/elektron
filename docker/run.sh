#!/bin/ash
clear
cd /application
date
echo installing dependencies...
yarn install
while true
do
	echo "running infinite loop so container won't die... :P"
  	date
	sleep 10
done
