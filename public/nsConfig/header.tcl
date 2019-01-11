set ns [new Simulator]
 
set nd [open out.tr w]
$ns trace-all $nd
 
set max_fragmented_size   1024
 
#add udp header(8 bytes) and IP header (20bytes)
set packetSize  1052
 
set s1 [$ns node]
set r1 [$ns node]
set r2 [$ns node]
set d1 [$ns node]