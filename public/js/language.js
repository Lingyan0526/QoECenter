function chgLang() {
    // alert("3232323");
    var language = $("#ddlSomoveLanguage").children('option:selected').val();

    if (language == "en") {
        $('#language').text("Language ：");
        $('#resume').text("Resume");
        $('#name').text("LingYan Zhang");
        $('#birthT').text("Date of Birth: ");
        $('#birthV').text("1991.05");
        $('#mobileT').text("Mobile: ");
        $('#mobileV').text("(+86) 152-1083-8786");
        $('#emailT').text("Mail: ");
        $('#indexT').text("Homepage: ");

		$('#education').text("Education");
		$('#eTitle1_1').text("Ph.D. Program, Computer Science and Technology, State Key Laboratory of Networking and Switching Technology, ");
		$('#eTitle1_2').text("Beijing University of Posts and Telecommunications, China");
		$('#eTitle2_1').text("B.S., Network Engineering, Dept. of Computer Science, ");
		$('#eTitle2_2').text("Beijing University of Posts and Telecommunications, China");  

		$('#page').text("Publication & Patent");

		$('#experience').text("Project Experience");
		$('#expTime1').text("2015.10-present");
		$('#expTitle1').text("QoE Platform for Streaming Video Services");
		$('#expDesc1').text("• Directed the project (including organizing project schedule, supervising task completion, and demonstrating contributions) \n• Provided source video classification, QoS realization of encoding and network transmission, and context-aware user experience data gathering and analysis \n• Implemented HTTP-based content control of dynamic adaptive streaming video service, DASH content generation, and MPD file generation. ");   

		$('#expTitle2').text("Geospatial Information Analysis (IBM T.J. Watson Research Center) ");
		$('#expDesc2').text("• Provided extensible API for big data management and storage based on geospatial information analysis \n • Analyzed quality of service based on function and performance testing \n • Supervised progress completion and wrote project patents and papers. ");

		$('#expTime3').text("2016.01-present");
		$('#expTitle3').text("Study on Quality of Selection Based on Mobile Internet");
		$('#expDesc3').text("• Managed QoE of streaming video services under mobile edge environment \n • Designed an edge-cloud algorithm to guarantee overload balancing and quality efficiency improvement \n • Developed a bit-rate adaptive algorithm based on HTTP dynamic streaming videos to improve mobile terminal QoE.");

		$('#expTime4').text("2015.01-present");
		$('#expTitle4').text("Service Selection Mechanism in Converged Network Environment");
		$('#expDesc4').text("• Directed the research on personalize service selection based on user preference \n • Led the research on service of cognition based on user historical data \n • Co-authored and published related surveys on the service selection and service recommendation.");

		$('#expTitle5').text("Brain Mechanism for Risk Decision and Service Selection");
		$('#expDesc5').text("• Directed the research on service selection, including managing the connection-oriented network service, analyzing the relationship of risk decision impact with QoE indices \n• Established a user-experience QoE model based on the brain cognition for achieving optimum service selection.");   

		$('#ice').text("Internship & Competition Experience");

		$('#iceTitle1').text("Intern in IBM T.J. Watson Research Center");
		$('#iceDesc1').text("• Participated in “Physical Analytics Integrated Data Repository and Services” project \n • Responsible for function and performance testing, API simplification and performance improvement \n • Wrote project patents and papers from the perspective of service computing");

		$('#iceTitle2').text("Intern in China Mobile");
		$('#iceDesc2').text("• participated in content production, market research, and event planning of campus publicity and brand promotion activities \n • Accomplished campus promotion activities in Beijing Language and Culture University and won the best performance award");

		$('#iceTitle3').text("Intern in Sina Weibo");
		$('#iceDesc3').text("• Participated in demand analysis, test cases and scenario design and run, test development platform management, test results summary, user feedback collection and organization \n • Accomplished four versions of Sina Weibo client with the demand analysis, test development and online feedback summary");

		$('#iceTitle4').text("Services Society Scientist Young Forum Research Competition");
		$('#iceDesc4').text("• Designed and developed a QoE evaluation platform for streaming video services which had received over eight thousand visits from over 37 countries or regions in three months \n • Won the outstanding student award from Services Society Scientist Young Forum");

		$('#iceTitle5').text("National Undergraduate Innovation Project Competition");
		$('#iceDesc5').text("• Directed a four-person team, responsible for a mobile game program development on android via wireless technology \n • Won the national innovation award");

		$('#pa').text("Practical Activities");

		$('#paTime1').text("2014.10-present");
		$('#paT1_sub1').text("Reviewer of China Communications, IOV 2014, COLLABORATECOM 2016");
		$('#paT1_sub2').text("Organizing Committee Member of IOV 2014, ICCSA 2016, COLLABORATE-COM 2016");
		$('#paT1_sub3').text("Publication Chair of IOV 2014, COLLABORATECOM 2016");

		$('#paTime2').text("2010.09-present");
		$('#paT2_sub1').text("Monitor, President of Sign Language Club. Minister of the Organization Department");
		$('#paT2_sub2').text("Volunteer Instructor of Museum of Beihong Xu. Volunteer of Science and Technology Promotion Project");

		$('#ha').text("Honors & Awards");

		$('#haT0').text("Outstanding Graduate Student, State Key Laboratory");
		$('#haT1').text("Outstanding Student Award, Services Society Scientist Young Forum");
		$('#haT2').text("ICCSA 2016, Outstanding Contribution Prize, ICCSA 2016,CollaborateCom 2016 & IOV 2014");
		$('#haT3').text("Best Graduate Student Award，BUPT & Outstanding Student Cadr，BUPT");
		$('#haT4').text("Best Student Award，BUPT & First-Class Scholarship, BUPT");
		$('#haT5').text("Best Student Award, BUPT & First-Class Scholarship，BUPT & National Innovation Award, BUPT");
		$('#haT6').text("Municipal Best Students Award, Education Commission of Beijing");
		$('#haT7').text("First Place of Team Jazz Cheerleading Competition, General Administration of Sport of China");

		$('#skill').text("Skills");

		$('#skill1').text("Proficient with C、C++、Java、Matlab");
		$('#skill2').text("Hands-on experience with Open Sources: NS2, FFmpeg, Bento4, xvid_encraw, MP4Box, X264, dash.js, Express, Jade, node.js, etc.");
		$('#skill2').text("Good command in both written and spoken English");
		$('#skill3').text("Quick and passionate learner, detail-focused, and rigorous attitude for scientific research");
    } else {
        $('#language').text("语言 ：");
        $('#resume').text("个人简历");
        $('#name').text("张凌燕");
        $('#birthT').text("出生年月: ");
        $('#birthV').text("1991年5月");
        $('#mobileT').text("手机: ");
        $('#mobileV').text("(+86) 152-1083-8786");
        $('#emailT').text("邮箱: ");
        $('#indexT').text("主页: ");

        $('#education').text("教育背景");
		$('#eTitle1_1').text("北京邮电大学 网络与交换技术国家重点实验室 ");
		$('#eTitle1_2').text("计算机科学与技术专业 博士在读 ");
		$('#eTitle2_1').text("北京邮电大学 计算机学院 ");
		$('#eTitle2_2').text("网络工程专业 学士学位 ");

		$('#page').text("论文专利");

		$('#experience').text("项目经历"); 
		$('#expTime1').text("2015.10-至今");
		$('#expTitle1').text("流媒体服务的用户体验QoE评价平台研究与开发（PHD研究项目）");
		$('#expDesc1').text("担任项目负责人，负责整个项目的调研、需求分析、任务分配、进度跟踪和成果展示；设计和实现了视频服务的用户体验质量QoE评价平台，提供了视频服务的基于时空特征的视频分类、编码参数控制、客观评价算法、客户端用户信息、交互行为与主观评价搜集等多项技术与功能实现；提供端到端的用户体验数据采集、控制与分析和视频推荐；并完成基于HTTP的动态自适应视频服务的内容控制、DASH内容生成、MPD媒体描述文件生成、和动态视频播放等内容的研究与技术实现；平台所在网址为: www.qoecenter.com");

		$('#expTitle2').text("IBM 物理信息分析与大数据索引和信息服务研究（IBM 沃森研究中心实习项目）");
		$('#expDesc2').text("担任实习生，该项目提供了基于时空的地理空间信息分析与大数据管理、存储、认知分析的可扩展API；负责基于平台功能和性能测试的用户体验评测和API分析；并从服务计算角度对该项目的服务支撑和保障技术进行专利和论文写作；该项目及服务所在网址为: https://developer.ibm.com/api/view/id-816");

		$('#expTime3').text("2016.01-至今");
		$('#expTitle3').text("移动互联网环境下准确与公平兼顾的服务选择方法研究（国家自然科学基金项目）");
		$('#expDesc3').text("担任组长，负责移动边缘环境下用户体验QoE感知的流媒体服务研究，通过实时感知用户上下文信息和移动边缘环境下的动态变化信息，设计了边缘云调度算法保障负载均衡和提高服务效率；根据用户对服务质量QoE的偏好信息和上下文信息，设计了基于HTTP动态流媒体的码率自适应算法，以提高移动终端的流媒体服务用户体验QoE。");

		$('#expTime4').text("2015.01-至今");
		$('#expTitle4').text("融合网络环境下服务选择机制研究（国家自然基金项目）");
		$('#expDesc4').text("担任组长，负责基于用户偏好的准确个性化服务选择和服务推荐研究，完成了基于用户历史数据的服务认知水平计算方法研究、基于认知水平的用户偏好调整算法研究、以及基于用户偏好的服务选择方法研究；同时与小组成员一起撰写并出版了融合网络环境下服务选择和服务推荐的研究综述相关书刊。");

		$('#expTitle5').text("风险决策与服务选择的脑神经机制研究（青年科技创新计划与专项重大研究项目）");
		$('#expDesc5').text("担任组长，负责面向网络服务，分析风险决策后影响用户体验质量QoE的性能指标及其复杂关联关系，建立基于脑神经认知的服务用户体验QoE模型，从而实现服务最优选择；研究主要包含面向服务选择的用户体验QoE性能指标分析研究、脑部激活区域认知的服务用户体验QoE建模、基于QoE感知的服务选择方法研究。");

		$('#ice').text("实习经历和科研竞赛");

		$('#iceTitle1').text("BM沃森研究中心实习");
		$('#iceDesc1').text("参与“物理信息分析与大数据索引和信息服务提供”项目；完成功能与性能测试，并基于测试结果进行API设计简化和性能提高；并从服务计算角度对该项目的服务支撑技术和用户体验增强等方面进行专利和论文写作。");

		$('#iceTitle2').text("中国移动通信运营商实习");
		$('#iceDesc2').text("参与中国移动公司的校园新生宣传活动的策划与品牌推广活动，完成了北京语言大学的新生校园推广计划，取得团队最佳宣传绩效奖。");

		$('#iceTitle3').text("新浪微博互联网公司实习");
		$('#iceDesc3').text("作为新浪微博测试开发实习生，参与新浪微博客户端的需求分析、测试用例和测试方案撰写、测试开发平台管理、测试结果总结与整理、 用户反馈搜集与总结报告等；全程跟踪四个版本的新浪微博的需求设计、测试开发和上线提测与反馈。");

		$('#iceTitle4').text("服务计算学会青年科学家论坛（SSYSF）科研竞赛");
		$('#iceDesc4').text("设计的流媒体服务的用户体验QoE评价平台在上线的三个月得到超过二十五个国家超过八千次的用户访问和使用，并以此获得服务计算学会青年科学家论坛的杰出学生（outstanding student award）奖。");

		$('#iceTitle5').text("大学生创新实验竞赛");
		$('#iceDesc5').text("担任四人研究团队组长，设计并实现的基于环境感知的互动游戏获得国家级优秀创新实验项目奖。");

		$('#pa').text("其他工作");

		$('#paTime1').text("2014.10-至今");
		$('#paT1_sub1').text("担任中国通信期刊, IOV 2014, COLLABORATECOM 2016国际会议审稿人；");
		$('#paT1_sub2').text("作为IOV 2014, ICCSA 2016,COLLABORATECOM 2016国际会议组委会成员員，负责会前行程规划和多方沟通、会议期间的海外接待和行程安排；");
		$('#paT1_sub3').text("担任IOV 2014, COLLABORATECOM 2016的会议出版主席，负责联络作者与出版商，负责论文集的校对、整编、排版和出版事宜。");

		$('#paTime2').text("2010.09-至今");
		$('#paT2_sub1').text("担任网络工程专业13班班长、手语社社长、组织部部长、14级博士党支书；");
		$('#paT2_sub2').text("参与大量的社会志愿活动与社会实践活动，如徐悲鸿纪念馆志愿讲解员等。");

		$('#ha').text("所获奖励");

		$('#haT0').text("北京邮电大学优秀研究生、优秀研究生干部；");
		$('#haT1').text("网络与交换技术国家重点实验室优秀研究生；");
		$('#haT2').text("服务计算学会青年科学家论坛（SSYSF）杰出学生奖Outstanding Student Award；");
		$('#haT3').text("IOV 2014, ICCSA 2016, CollaborateCom2016国际会议杰出贡献奖；");
		$('#haT4').text("北京邮电大学优秀研究生、优秀学生干部；");
		$('#haT5').text("北京邮电大学一等奖学金、三好学生；");
		$('#haT6').text("国家级优秀创新实验项目奖；大学生电子商务挑战赛三等奖；");
		$('#haT7').text("北京市三好学生。");

		$('#skill').text("其他技能");

		$('#skill1').text("熟悉C、C++、Java、Matlab、HTML+CSS+Javascript；");
		$('#skill2').text("丰富的开源工具／库实践经验: NS2, FFmpeg, Bento4, xvid_encraw, MP4Box, X264, dash.js, Express, Jade, node.js等；");
		$('#skill3').text("熟练使用英语进行听说读写、熟练阅读和撰写英文文献资料；");
		$('#skill4').text("丰富的项目、专利申请写作经验，以及多方团队合作项目经历。");
    }
    
}