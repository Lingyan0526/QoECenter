# QoECenter
Author:  [Lingyan Zhang](http://www.qoecenter.com/lingyanzhang)

Site : <http://www.qoecenter.com>

Contact: <lyzhang@nctu.edu.tw> <http://www.sguangwang.com/>

## Overview
QoeCenter is a Visualized Platform of QoE Evaluation Platform for Video Streaming Services.

With the development and explosion of streaming video services, videos are increasing finding their way into a people’s daily lives and works. At the same time, the ever-increasing demand for providing high QoE of videos motivates more and more research on QoE evaluation.

The main impetus for our research is to broaden the specific conditions used in today’s QoE experimentation to understand the user perception requirements for streaming video services.

To this end, we propose a public and visualized platform called QoECenter, which supports QoE evaluation along with data acquisition and analysis of all parameters throughout the whole process of video streams from video source to end user. It exposes visualized interface to complex video source analysis, encoding/networking QoS controlling and user-viewing condition monitoring to gain insight about QoE. The platform involves three levels of parameter control, data acquisition, and data analysis:

* Video Source Level, where QoECenter is capable of conducting video source analysis based on spatial-temporal features extraction and video type classification;

* System Process Level, where QoECenter is capable of controlling QoS parameters, processing data logic for simulating the whole video process, and providing multiple algorithms of objective video quality evaluation;

* End User Level, where QoECenter is capable of monitoring the terminal information and user-viewing activities, and providing subjective QoE evaluation based on user opinions on customized aspects of user perception.

Finally, QoECenter offers interfaces to simulate the video process including video uploading, video encoding, network transmission and terminal display, monitor the data of terminal, system and end user, control QoS parameters, and provide both objective quality evaluation and subjective QoE evaluation. QoECenter is targeted for researchers who want to conduct QoE study based on parameter control, data acquisition and analysis throughout the video process. It provides a public platform for researchers to test and compare performance of different QoE evaluation methods under different experiment setup and constrains.

## Core Features
* Realize configurable QoS parameters of streaming video services

* Simulate the streaming video lifecycle

* Monitor the environment and quality data in system, terminal, and end user

* Provide various objective evaluation algorithms and methods in real time

* Provide subjective QoE evaluation metrics on customized aspects of user perception

* Provide DASH easy-to-use DASH content generation and display tool

* Provide all functional capabilities through a web based visual interface

[More Detail](http://www.qoecenter.com)

## Technical requirements
* FFmpeg : FFmpeg is the leading multimedia framework, able to decode, encode, transcode, mux, demux, stream, filter and play pretty much anything that humans and machines have created. It supports the most obscure ancient formats up to the cutting edge.

* NS-2 : Ns is a discrete event simulator targeted at networking research. Ns provides substantial support for simulation of TCP, routing, and multicast protocols over wired and wireless (local and satellite) networks. 

* EvalVid : EvalVid is a Tool whiich is used for integrated Quality assessment of Video File transmission. PSNR annd SSIM are used as a comparison metrics which evaluates video file transmission.

* Bento4 : Bento4 is a C++ class library and tools designed to read and write ISO-MP4 files.

## Branches and Releases
* master: for the lastest version.

* develop: for the next beta code and develop.

Please use appropriate tags or branches.

Please pull request to the master branch for easy bugfix and typo, or to develop branch for new feature.

## Install

first, please install following tools:

* EvalVid
* FFmpeg
* NS-2
* MP4Box

then, clone the repo.

```
$ git clone https://github.com/Lingyan0526/QoECenter.git
```
intall TISI

```
$ copy TISI /usr/local/bin/
```

## License
MIT License