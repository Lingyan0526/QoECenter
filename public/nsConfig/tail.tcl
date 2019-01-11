$ns duplex-link  $s1 $r1  $bandwidth  $timedelay DropTail
$ns simplex-link $r1 $r2  $bandwidth  $timedelay DropTail
$ns simplex-link $r2 $r1  $bandwidth  $timedelay DropTail
$ns duplex-link  $r2 $d1  $bandwidth  $timedelay DropTail
 
set qr1r2 [[$ns link $r1 $r2] queue]
$qr1r2 set limit_ 50
 
set udp1 [new Agent/UDP/EvalvidUDP]
$ns attach-agent $s1 $udp1
$udp1 set packetSize_ $packetSize
$udp1 set_filename sd
set null1 [new Agent/EvalvidSink]
$ns attach-agent $d1 $null1
$ns connect $udp1 $null1
$null1 set_filename rd
 
set original_file_name "mp4trace_out"
set trace_file_name "video1.dat"
set original_file_id [open $original_file_name r]
set trace_file_id [open $trace_file_name w]
 
set pre_time 0
 
while {[eof $original_file_id] == 0} {
    gets $original_file_id current_line
    
    scan $current_line "%d%s%d%d%f" no_ frametype_ length_ tmp1_ tmp2_
    set time [expr int(($tmp2_ - $pre_time)*1000000.0)]
         
    if { $frametype_ == "I" } {
        set type_v 1
        set prio_p 0
    } 
 
    if { $frametype_ == "P" } {
        set type_v 2
        set prio_p 0
    } 
 
    if { $frametype_ == "B" } {
        set type_v 3
        set prio_p 0
    } 
   
    if { $frametype_ == "H" } {
        set type_v 1
        set prio_p 0
    }
 
    puts  $trace_file_id "$time $length_ $type_v $prio_p $max_fragmented_size"
    set pre_time $tmp2_
}
 
close $original_file_id
close $trace_file_id
set end_sim_time $tmp2_
puts "$end_sim_time"
 
set trace_file [new Tracefile]
$trace_file filename $trace_file_name
set video1 [new Application/Traffic/Evalvid]
$video1 attach-agent $udp1
$video1 attach-tracefile $trace_file
 
proc finish {} {
        global ns nd
        $ns flush-trace
        close $nd
        exit 0
}
 
$ns at 0.0 "$video1 start"
$ns at $end_sim_time "$video1 stop"
$ns at [expr $end_sim_time + 1.0] "$null1 closefile"
$ns at [expr $end_sim_time + 1.0] "finish"
 
$ns run