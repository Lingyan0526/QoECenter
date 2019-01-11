#!/bin/bash
# Download the H.264 video (lossless H.264 encoded) from "http://www2.tkn.tu-berlin.de/research/evalvid/cif.html"
# http://csie.nqu.edu.tw/smallko/ns2_old/myevalvid2.htm
# http://csie.nqu.edu.tw/smallko/ns2/myEvalvid.htm
# http://csie.nqu.edu.tw/smallko/ns2_old/Evalvid_in_NS2.htm
# http://www2.tkn.tu-berlin.de/research/evalvid/EvalVid/docevalvid.html

# Tools parameters
FFMPEG=ffmpeg
XVID_ENCRAW=xvid_encraw
MP4BOX=MP4Box
MP4TRACE=mp4trace
ETMP4=etmp4
PSNR=psnr
HIST=hist
MOS=mos
MIV=miv

# File defination
NS=ns
SCRIPT="be.tcl"
RAW_FILE=$1
YUV_FILE="foreman_cif.yuv"
XVID_OUT="xvid_out.m4v"
MP4BOX_OUT="mp4box_out.mp4"
MP4TRACE_OUT="mp4trace_out"
ETMP4_OUT="etmp4_out"

# Convert "*.mp4" file to "*.264"
$FFMPEG -i ${RAW_FILE} -an -vcodec libx264 -crf 23 input.264

# Convert "*.264" file to "*.yuv" file
$FFMPEG -i input.264 ${YUV_FILE}

# Encoding a yuv sequence into MPEG4 data format. 
# It will create compressed raw videos with 30 frames per second, a GOP length of 30 frames with no B-frames.
$XVID_ENCRAW -i ${YUV_FILE} -w $3 -h $4 -framerate $5 -max_key_interval 30 -o ${XVID_OUT}

# Following command lines create ISO MP4 files containing the video samples (frames) 
# and a hint track which describes how to packetize the frames for the transport with RTP.
$MP4BOX -hint -tmp ./ -mtu 1024 -fps $5 -add ${XVID_OUT} ${MP4BOX_OUT}

# Ref YUV, for MOS and MIV
$FFMPEG -i ${MP4BOX_OUT} ref_video.yuv

# The mp4trace tool from EvalVid is able to send a hinted mp4-file per RTP/UDP to a specified destination host. 
# The output of mp4trace will be needed later, so it should be redirected to a file.
$MP4TRACE -f -s 192.168.0.2 12346 ${MP4BOX_OUT} > ${MP4TRACE_OUT}

# Run simulation
$NS $SCRIPT

# The next step is the reconstruction of the transmitted video as it is seen by the receiver. 
# For this, the video and trace files are processed by etmp4 (Evaluate Traces of MP4-file transmission):
# NB. This generates a (possibly corrupted) video file, where all frames that got lost or 
#     were corrupted are deleted from the original video track.
$ETMP4 -p -0 sd rd ${MP4TRACE_OUT} ${MP4BOX_OUT} ${ETMP4_OUT}

# Decode the received video to yuv format. (Please use ffmpeg to decode the compressed file.
# It won’t cause any error in most cases. If you use other codec to decode, it may cause errors in most cases.)
$FFMPEG -i ${ETMP4_OUT}.mp4 result.yuv

# to convenient to play the mp4 for html
$FFMPEG -i etmp4_out.mp4 -vcodec h264 $2

# Compute the PSNR.
mkdir psnr
$PSNR $3 $4 420 ${YUV_FILE} ref_video.yuv > ref_psnr.csv
$PSNR $3 $4 420 ${YUV_FILE} result.yuv > psnr/psnr.csv

$PSNR $3 $4 420 ${YUV_FILE} ref_video.yuv ssim > ref_ssim.csv
$PSNR $3 $4 420 ${YUV_FILE} result.yuv ssim > ssim.csv

# MOS (Mean Opinion Score): MOS is a subjective metric to measure digital video quality at the application level.
# This metric of the human quality impression is usually given on a scale that ranges from 1 (worst) to 5 (best).
$MOS psnr ref_psnr.csv 25 > mos.csv
$MIV psnr > miv.csv

# If you are interested in delay or jitter distributions, the hist tool could be of interest. E.g.,
awk '{print $3}' delay_${ETMP4_OUT}.csv | $HIST - 0 .05 50 > hist.csv
# gives the time, PDF and CDF of the end-to-end delay of transmission ${ETMP4_OUT}.


# Store the results
rm ${YUV_FILE}
rm ${XVID_OUT}
rm ${MP4BOX_OUT}
rm ${MP4TRACE_OUT}
rm ${ETMP4_OUT}.mp4
rm ${ETMP4_OUT}.m4v
rm sd
rm rd
rm result.yuv
rm ref_video.yuv
rm -rf out.tr
rm -rf video1.dat






