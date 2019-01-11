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

# Decode the received video to yuv format. (Please use ffmpeg to decode the compressed file.
# It won’t cause any error in most cases. If you use other codec to decode, it may cause errors in most cases.)
$FFMPEG -i $2 result.yuv

# Compute the PSNR.
mkdir psnr
$PSNR $3 $4 420 ${YUV_FILE} result.yuv > psnr/psnr.csv
$PSNR $3 $4 420 ${YUV_FILE} result.yuv ssim > ssim.csv

# MOS (Mean Opinion Score): MOS is a subjective metric to measure digital video quality at the application level.
# This metric of the human quality impression is usually given on a scale that ranges from 1 (worst) to 5 (best).
$MIV psnr > miv.csv

# Store the results
Fold=./data
mkdir ${Fold}
mv ${YUV_FILE} ${Fold}/${YUV_FILE}
mv ${XVID_OUT} ${Fold}/${XVID_OUT}
mv ${MP4BOX_OUT} ${Fold}/${MP4BOX_OUT}
mv ${MP4TRACE_OUT} ${Fold}/${MP4TRACE_OUT}
mv ${ETMP4_OUT}.mp4 ${Fold}/${ETMP4_OUT}.mp4
mv ${ETMP4_OUT}.m4v ${Fold}/${ETMP4_OUT}.m4v
mv *.csv ${Fold}/
mv sd ${Fold}/sd
mv rd ${Fold}/rd
mv result.yuv ${Fold}/result.yuv
mv psnr ${Fold}/
mv ref_video.yuv ${Fold}/ref_video.yuv
rm -rf out.tr
rm -rf video1.dat






