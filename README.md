Airodump-ng on Mac
=====

A long history of closed source Apple network card drivers leads to poor support for networking tools.
This is a small quick attempt at alleviating that.

Quick bash script to run tcpdump in monitor mode using -I and refreshing airodump-ng
to update its viewing of file every second or so.

A bit of a strange yet quick fix effort to make use of airodump-ng on Mac.

Saves to file specified by first input parameter in standard pcap format, compatible with aircrack.
Works effectively for me to capture packets similar to real airodump-ng on Linux.
