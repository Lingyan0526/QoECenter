cd $1
python2.7 ~/home/dash/Bento4/Source/Python/utils/mp4-dash-encode.py -b 3 target1.mp4
python2.7 ~/home/dash/Bento4/Source/Python/utils/mp4-dash.py --exec-dir=. video_0*
rm video_0*
rm target.mp4
rm target1.mp4