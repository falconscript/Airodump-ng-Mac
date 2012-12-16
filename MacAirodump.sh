# FILE LOCATION VARIABLES
# May also add extra items, such as --bssid xx:xx:xx...
TCPDUMP="./tcpdump"
AIRODUMP="aircrack-ng-1.1/src/airodump-ng"
REFRESH_RATE=1                        # Too low may hit race condition

# Output file test
if [ -z $1  ]
  then echo "$0: Must specify input filename as first parameter"
  exit
fi

function killRefresh() {
  sleep $REFRESH_RATE                   # Wait to kill
  AIR_PID=`pgrep airodump-ng`           # Kill last airodump
  if ! [ -z $AIR_PID  ]
    then kill $AIR_PID 2>/dev/null ; fi
}

function endCap() {
  sudo kill $TCP_PID 2>/dev/null        # End background tcpdump
  exit
}

trap 'endCap; exit' INT TERM EXIT       # Allow while loop end


# BEGIN

echo "RUNNING TCPDUMP... OUTPUT NAME: $1"

sudo touch "$1"                         # Authenticate early

sudo "$TCPDUMP" -ISs 0 -w "$1" &        # Run monitor mode
TCP_PID=$!                              # tcpdump process id
sleep 1                                 # Allow capture time


while :
do
  killRefresh &                         # Run refresher function
  "$AIRODUMP" -r  "$1"                  # Continuously run airodump
done
