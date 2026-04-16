import { useState, useEffect, useRef } from "react";

const ROASTS = [
  "Yikes. Did you guess with your eyes closed? 👀",
  "Bold strategy. Completely wrong, but bold. 💀",
  "Your hiring manager is cringing right now. 😬",
  "That answer just failed its own probation period. 🚫",
  "Please don't put this on your LinkedIn. 🙏",
  "Even the ATS would reject that answer. 🤖",
  "Sir/Ma'am, this is TA trivia, not a coin flip. 🪙",
  "We're going to need to extend your PIP. 📋",
  "Giving 'I skipped the intake meeting' energy. 😅",
  "Not quite. Have you considered a career change? 👔",
  "The debrief on that answer would be brutal. 😤",
  "That's a no from all five interviewers. ✋",
  "Back to basics, recruiter. Back. To. Basics. 📚",
];
const TIMEOUT_ROASTS = [
  "Time's up! Even your ATS moves faster than that. ⏰",
  "Did you fall asleep? The candidate didn't wait. 😴",
  "45 seconds and nothing. Your HM has left the building. 🚪",
];
const TITLES = [
  [0,"Coordinator in Disguise"],[300,"Solid Recruiter"],[600,"Senior Material"],
  [1000,"TA Lead Energy"],[1400,"Head of TA Worthy"],[1800,"RecOps Royalty"],[2100,"Talent Titan 🏆"],
];
const CATS = [
  { id:"process",      label:"TA Process",     emoji:"⚙️", color:"#7C3AED", grad:"#4C1D95" },
  { id:"metrics",      label:"Metrics & Data", emoji:"📊", color:"#0284C7", grad:"#0C4A6E" },
  { id:"interviewing", label:"Interviewing",   emoji:"🎤", color:"#BE185D", grad:"#831843" },
  { id:"ai",           label:"AI in TA",       emoji:"🤖", color:"#DC2626", grad:"#7F1D1D" },
  { id:"hot",          label:"Hot Topics",     emoji:"🔥", color:"#EA580C", grad:"#7C2D12" },
  { id:"wildcard",     label:"Wild Card",      emoji:"🎲", color:"#059669", grad:"#064E3B" },
];
const OPTION_LABELS = ["A","B","C","D"];
const DIFF_COLOR = { foundational:"#22c55e", practitioner:"#f59e0b", strategic:"#ef4444" };

const BANK = [
  {id:"p1",category:"process",difficulty:"foundational",question:"What is the primary purpose of a hiring intake meeting?",options:["Review CVs shortlisted by the recruiter","Align recruiter and HM on requirements, ICP, process and timeline before sourcing begins","Present the offer to the candidate","Conduct the first round interview"],correct:1,explanation:"The intake meeting is the single most important step — misalignment here cascades into wasted sourcing effort, slow pipelines and poor hires."},
  {id:"p2",category:"process",difficulty:"foundational",question:"Which channel consistently produces the highest quality-of-hire?",options:["Job boards","LinkedIn InMail","Employee referrals","Recruitment agencies"],correct:2,explanation:"Referrals outperform other channels on quality, retention and ramp time — candidates arrive pre-vetted with a realistic view of the company."},
  {id:"p3",category:"process",difficulty:"foundational",question:"What is passive sourcing?",options:["Waiting for inbound applications","Proactively approaching candidates not actively job-seeking","Using a recruitment agency to fill roles","Posting jobs on multiple job boards simultaneously"],correct:1,explanation:"Passive sourcing requires outreach to candidates who haven't applied — typically yielding higher quality but requiring more recruiter effort."},
  {id:"p4",category:"process",difficulty:"foundational",question:"What is the key difference between a recruiter screen and a hiring manager interview?",options:["The recruiter screen is always longer","The recruiter screen qualifies baseline fit; the HM interview assesses deeper capability and team fit","There is no meaningful difference between the two","The HM interview always happens first in the process"],correct:1,explanation:"Recruiter screens filter for basics so the HM's time is spent only on qualified candidates."},
  {id:"p5",category:"process",difficulty:"foundational",question:"What does a well-written Ideal Candidate Profile (ICP) include?",options:["Must-haves, nice-to-haves, and disqualifying factors based on role success patterns","A list of every desirable skill imaginable for the role","The hiring manager's personal preferences and wishlist only","A copy of the existing job description with notes"],correct:0,explanation:"An effective ICP is a prioritised benchmark — must-haves drive screening decisions, nice-to-haves differentiate, disqualifiers create consistent rejection criteria."},
  {id:"p6",category:"process",difficulty:"practitioner",question:"Your pipeline shows a 45% drop-off between recruiter screen and HM interview. Most likely root cause?",options:["The job board is attracting completely wrong candidates","ICP is misaligned between recruiter and hiring manager","The offer stage process is far too slow","The ATS is not tracking candidates correctly"],correct:1,explanation:"A high recruiter-to-HM drop-off almost always signals ICP misalignment. The fix is in the intake, not the sourcing."},
  {id:"p7",category:"process",difficulty:"practitioner",question:"A hiring manager keeps rejecting candidates with no clear feedback. Most effective recruiter response?",options:["Continue sending more candidates and hope one lands","Escalate to HR leadership immediately without delay","Run a calibration session using rejected profiles to extract specific rejection criteria","Pause sourcing until the HM provides written feedback"],correct:2,explanation:"Calibration sessions using actual rejected profiles are the fastest way to extract implicit criteria a HM can't articulate."},
  {id:"p8",category:"process",difficulty:"practitioner",question:"What is the primary advantage of a structured talent pipeline over req-by-req recruiting?",options:["It eliminates the need for job postings entirely","It allows hiring to begin with warm, pre-assessed candidates rather than starting from zero","It automatically reduces the number of interviews required","It guarantees a faster offer acceptance every time"],correct:1,explanation:"Pipelined talent reduces time-to-fill significantly — activating pre-warmed relationships rather than cold sourcing from scratch."},
  {id:"p9",category:"process",difficulty:"practitioner",question:"A req has been open 90 days with no hire. Which diagnostic step comes first?",options:["Increase the job board budget immediately","Replace the recruitment agency with a new one","Audit the full funnel to identify where candidates are dropping off and why","Lower the hiring bar to accelerate throughput"],correct:2,explanation:"Without a funnel audit, any intervention is a guess. Data tells you whether the problem is sourcing, screening, process or offer competitiveness."},
  {id:"p10",category:"process",difficulty:"practitioner",question:"Which of the following is a leading indicator of recruiting performance?",options:["Time-to-fill across all open roles","Cost-per-hire for the quarter","Pipeline coverage ratio by open req","Quality-of-hire at 6 months"],correct:2,explanation:"Pipeline coverage tells you where you're heading before you get there — unlike time-to-fill or quality-of-hire which only tell you what already happened."},
  {id:"p11",category:"process",difficulty:"strategic",question:"A company is scaling from 50 to 200 employees in 18 months. Most important TA investment first?",options:["Hire more recruiters to handle volume","Increase job board spend significantly","Implement an ATS with structured workflow and reporting before volume scales","Build a major employer brand campaign first"],correct:2,explanation:"At scale, unstructured processes collapse. An ATS with proper workflow design is the foundation — without it, reporting is impossible."},
  {id:"p12",category:"process",difficulty:"strategic",question:"What is the fundamental problem with using headcount approvals as the trigger for recruiting?",options:["It gives recruiters too much lead time to fill roles","It creates reactive hiring — TA is always behind business needs rather than ahead","It makes salary benchmarking significantly harder","It reduces the number of reqs a recruiter can manage"],correct:1,explanation:"Headcount-triggered TA is inherently reactive. Strategic TA teams work from workforce plans — anticipating needs 6-12 months out."},
  {id:"p13",category:"process",difficulty:"strategic",question:"When a business leader asks TA to just hire faster, what is the most strategically sound response?",options:["Immediately increase job board spend and agency usage","Lower the hiring bar to accelerate throughput quickly","Diagnose where time is being lost and address root causes rather than treating speed as a standalone goal","Add more recruiters to the team right away"],correct:2,explanation:"Hiring faster without diagnosis leads to bad hires. Find the bottleneck — sourcing, process, HM availability or offer speed — and fix that."},
  {id:"m1",category:"metrics",difficulty:"foundational",question:"What does offer acceptance rate measure?",options:["The percentage of job offers extended that are accepted by candidates","The percentage of candidates who pass the recruiter screen","The ratio of applications received to interviews held","The percentage of new hires who complete their probation period"],correct:0,explanation:"Offer acceptance rate signals offer competitiveness, candidate experience quality, and how well expectations were set throughout the process."},
  {id:"m2",category:"metrics",difficulty:"foundational",question:"How is cost-per-hire typically calculated?",options:["Total recruiting costs (internal + external) divided by total hires in a period","Total recruiter salaries divided by number of hires made","Job board spend divided by total applications received","Agency fees only, divided by the number of agency hires"],correct:0,explanation:"Cost-per-hire includes all internal and external costs divided by total hires — giving a true picture of recruiting efficiency."},
  {id:"m3",category:"metrics",difficulty:"foundational",question:"What is time-to-fill measuring?",options:["Time from job requisition opening to offer acceptance","Time from offer acceptance to the candidate's start date","Total time a recruiter spends working on each req","Time from first application received to first interview held"],correct:0,explanation:"Time-to-fill is the standard measure of recruiting speed — from req open to offer accepted. It's a lagging indicator of overall process efficiency."},
  {id:"m4",category:"metrics",difficulty:"foundational",question:"Which metric best measures the effectiveness of sourcing channels?",options:["Hire rate and quality-of-hire by source of hire","Number of total applications received per channel","Cost per application generated by each channel","Overall time-to-fill broken down by department"],correct:0,explanation:"Hire rate and quality-of-hire by source tell you which channels are actually producing successful hires — volume alone doesn't."},
  {id:"m5",category:"metrics",difficulty:"practitioner",question:"Your offer acceptance rate drops from 85% to 65% in a quarter. What do you investigate first?",options:["Compensation competitiveness, competing offers and late-stage candidate experience","Interview process length and number of rounds","Recruiter performance and individual conversion rates","Job board performance and inbound volume"],correct:0,explanation:"Late-stage drop-off almost always points to compensation, competing offers or something that eroded candidate enthusiasm — not sourcing."},
  {id:"m6",category:"metrics",difficulty:"practitioner",question:"A recruiter has a high submission-to-interview rate but a low interview-to-offer rate. What does this indicate?",options:["The recruiter is passing candidates who look good on paper but are not assessed deeply enough","The recruiter is screening too strictly and missing good candidates","The HM is too slow to give meaningful feedback","The job board is consistently attracting poor quality candidates"],correct:0,explanation:"High submission-to-interview but low interview-to-offer means candidates pass the recruiter screen but fail at HM level — the screen is not deep enough."},
  {id:"m7",category:"metrics",difficulty:"practitioner",question:"Why is number of hires a dangerous primary KPI for a TA team?",options:["It incentivises speed over quality, driving HMs to accept weaker candidates to close reqs","It is too easy to measure and track accurately","It does not account for the difference between agency and direct hires","It makes it harder to justify growing the TA team headcount"],correct:0,explanation:"Volume KPIs without quality guardrails create perverse incentives — filling seats becomes the goal rather than filling them well."},
  {id:"m8",category:"metrics",difficulty:"practitioner",question:"What does pipeline coverage ratio measure?",options:["The ratio of qualified candidates in-process to open roles — a leading indicator of hitting targets","The total number of reqs a single recruiter is currently managing","The percentage of candidates sourced compared to those who applied","The ratio of agency hires to direct hires in a given period"],correct:0,explanation:"Pipeline coverage is predictive — if you have 3x qualified candidates per open role, you are likely to hire on time. Below 2x is a red flag."},
  {id:"m9",category:"metrics",difficulty:"strategic",question:"A TA leader wants to build a business case for two additional recruiter headcount. Most compelling data for a CFO?",options:["Time-to-fill trend, revenue impact of unfilled roles and projected cost savings vs. agency spend","Number of open reqs alongside recruiter satisfaction scores","Candidate NPS scores and total application volume trends","Diversity hiring statistics and employer brand rankings"],correct:0,explanation:"CFOs respond to revenue and cost — unfilled sales roles have a measurable daily revenue cost. Pairing that with agency spend makes an irrefutable financial case."},
  {id:"m10",category:"metrics",difficulty:"strategic",question:"Why is tracking diversity at each funnel stage more useful than final diversity hire percentages?",options:["It identifies exactly where underrepresented candidates are dropping out, enabling targeted interventions","It satisfies more DEI compliance and reporting requirements","It is significantly easier to present to senior leadership","It removes the need for a formal diversity hiring target altogether"],correct:0,explanation:"End-state diversity numbers hide the mechanism. Stage-by-stage data shows where the drop-off is happening so you can fix it."},
  {id:"m11",category:"metrics",difficulty:"strategic",question:"Quality of hire scores are high but first-year attrition remains elevated. What does this most likely mean?",options:["There is likely a disconnect between the hiring process and onboarding or management quality post-hire","The quality of hire metric itself is being measured incorrectly","The recruiter is consistently selecting the wrong candidates","The salary bands are too low to retain people past 12 months"],correct:0,explanation:"If people are assessed as strong hires but still leave, the problem is post-hire. TA should surface this data and escalate it, not absorb attrition as a recruiting failure."},
  {id:"i1",category:"interviewing",difficulty:"foundational",question:"What is a competency-based interview?",options:["An interview using structured questions to gather evidence of past behaviour as a predictor of future performance","An interview focused purely on technical skills testing and assessment","An interview conducted by multiple panel members at the same time","An interview that tests cultural fit through casual, informal conversation"],correct:0,explanation:"Competency-based interviews use the STAR framework to collect evidence of how a candidate has demonstrated specific behaviours — a proven predictor of future performance."},
  {id:"i2",category:"interviewing",difficulty:"foundational",question:"What does the STAR interview technique stand for?",options:["Situation, Task, Action, Result","Skills, Tasks, Actions, Results","Strategy, Thinking, Approach, Reasoning","Strengths, Themes, Attributes, Reflection"],correct:0,explanation:"STAR ensures candidates provide full, evidenced answers rather than hypothetical claims."},
  {id:"i3",category:"interviewing",difficulty:"foundational",question:"What is the primary advantage of a structured interview over an unstructured one?",options:["It uses the same questions for all candidates, enabling fair comparison and reducing interviewer bias","It takes significantly less time for the interviewer to prepare","It allows candidates to speak more freely and openly","It is generally a more enjoyable experience for the candidate"],correct:0,explanation:"Structured interviews have significantly higher predictive validity — standardised questions and scoring criteria reduce the impact of bias and personal chemistry."},
  {id:"i4",category:"interviewing",difficulty:"foundational",question:"What is unconscious bias in the context of interviewing?",options:["Automatic, unintentional preferences that influence evaluation without the interviewer's awareness","Deliberately discriminating against certain candidates in the process","A legal term used for discriminatory hiring practices in court","A type of bias that only affects junior or inexperienced interviewers"],correct:0,explanation:"Unconscious bias affects all interviewers regardless of intent — it's why structured interviews with defined scoring criteria consistently produce better decisions."},
  {id:"i5",category:"interviewing",difficulty:"foundational",question:"What is an interview scorecard?",options:["A standardised evaluation tool interviewers complete after each interview to score candidates against defined criteria","A system for rating and ranking candidates based on their CV quality","A ranking of all candidates ordered by their application date","A performance review template used with new hires at 90 days"],correct:0,explanation:"Scorecards define what to assess and how to score it — creating a consistent record that supports debrief discussions and defensible hiring decisions."},
  {id:"i6",category:"interviewing",difficulty:"practitioner",question:"A HM consistently rates candidates from elite universities higher regardless of actual interview performance. What bias is this?",options:["Halo effect combined with prestige bias inflating the overall evaluation","Pure recency bias from last impression of the candidate","Affinity bias based on shared background and experience","Confirmation bias seeking to validate an existing positive view"],correct:0,explanation:"The halo effect causes one positive attribute to inflate overall evaluation. Structured scorecards with evidence requirements help counteract this."},
  {id:"i7",category:"interviewing",difficulty:"practitioner",question:"What is confirmation bias in the interview context and why is it particularly dangerous?",options:["When an interviewer seeks evidence confirming their first impression, ignoring contradictory evidence","When an interviewer confirms their decision with a colleague before making an offer","When a candidate confirms their interest in the role before the offer is made","When two interviewers reach agreement without independent scoring first"],correct:0,explanation:"Confirmation bias feels like rigour — the interviewer believes they are gathering evidence when actually selectively confirming a pre-formed view."},
  {id:"i8",category:"interviewing",difficulty:"practitioner",question:"Which assessment method has the highest predictive validity for job performance?",options:["Work sample tests and structured interviews combined together","Unstructured interviews conducted by experienced hiring managers","Personality tests used as the sole assessment method","CV screening combined with structured reference checks"],correct:0,explanation:"Meta-analyses consistently show work sample tests combined with structured interviews produce the highest predictive validity."},
  {id:"i9",category:"interviewing",difficulty:"practitioner",question:"Why should interviewers submit their scorecard independently before a group debrief?",options:["It prevents anchoring — where the first opinion shared disproportionately influences everyone else's evaluation","It saves significant time in the overall debrief discussion","It is a legal requirement in most hiring jurisdictions","It makes updating the ATS after the debrief much easier"],correct:0,explanation:"Anchoring bias in debriefs is powerful — independent scoring first preserves each interviewer's integrity."},
  {id:"i10",category:"interviewing",difficulty:"practitioner",question:"A candidate gives a strong interview but the HM says they just don't feel right. How should a recruiter respond?",options:["Ask the HM to articulate specific evidence from the interview and probe whether it's bias","Agree with the HM — gut feel is an important hiring signal","Move the candidate forward anyway without engaging the HM","Reject the candidate and move on to the next in pipeline"],correct:0,explanation:"Culture fit based on feeling is often a proxy for affinity bias. A recruiter's role is to push for evidence."},
  {id:"i11",category:"interviewing",difficulty:"strategic",question:"What is the core problem with using culture fit as an evaluation criterion without defining it?",options:["It is an undefined criterion that defaults to interviewer affinity bias and actively undermines diversity","It makes the overall interview process feel far too informal","Candidates do not know how to prepare or answer culture fit questions","It is generally not legally permissible in most hiring jurisdictions"],correct:0,explanation:"Culture fit without a definition is a bias vehicle. Replace it with culture add or explicitly defined behavioural criteria tied to company values."},
  {id:"i12",category:"interviewing",difficulty:"strategic",question:"What is the primary limitation of blind CV screening as a bias-reduction strategy?",options:["It only removes bias at the CV stage — all subsequent stages remain fully exposed to bias","It is far too time-consuming to implement at any real scale","Most candidates actively object to having their personal details removed","It makes it significantly harder to assess genuinely relevant experience"],correct:0,explanation:"Blind CV screening is a partial fix — it does nothing about interview bias, where the majority of discriminatory decisions occur."},
  {id:"i13",category:"interviewing",difficulty:"strategic",question:"Female candidates consistently score lower on executive presence despite strong technical scores. What is the right response?",options:["Audit the criterion definition and scoring calibration for gender-linked bias and retrain interviewers","Accept the data — some candidates simply lack executive presence","Remove executive presence from the scorecard entirely","Increase the number of female candidates entering the pipeline"],correct:0,explanation:"Executive presence is one of the most gender-biased criteria in interviewing — research shows it is evaluated differently for men and women displaying identical behaviours."},
  {id:"a1",category:"ai",difficulty:"foundational",question:"What is the primary use case of AI in CV screening today?",options:["Parsing and ranking candidates based on keyword and criteria matching to reduce manual review time","Making autonomous final hiring decisions without human input","Conducting full video interviews without any human involvement","Writing and sending personalised rejection letters to candidates"],correct:0,explanation:"AI screening tools reduce manual review time significantly but require careful configuration to avoid replicating existing biases."},
  {id:"a2",category:"ai",difficulty:"foundational",question:"What does LLM stand for in the context of AI tools used in TA?",options:["Large Language Model","Linked Learning Module","Lateral Labour Market","Low Latency Mechanism"],correct:0,explanation:"Large Language Models like GPT-4, Claude and Gemini are the foundation of most AI writing, summarisation and analysis tools now entering the TA stack."},
  {id:"a3",category:"ai",difficulty:"foundational",question:"What is AI hallucination and why does it matter in TA?",options:["When an AI model confidently generates false or fabricated information","When AI generates visual content instead of the requested text","When AI tools respond too slowly to be practically useful","When AI misreads or misparses a CV's formatting or layout"],correct:0,explanation:"Hallucination is a known LLM failure mode. In TA, this matters most when using AI for candidate research or generating data-backed claims."},
  {id:"a4",category:"ai",difficulty:"foundational",question:"What is the main risk of using AI tools trained on historical hiring data to screen candidates?",options:["They may replicate and amplify existing biases present in the historical training data","They are generally too slow to process applications at meaningful scale","They are far too expensive for the majority of companies to afford","They are technically unable to read PDF formatted documents"],correct:0,explanation:"Amazon's scrapped AI recruiting tool (2018) is the canonical example — trained on predominantly male historical hires, it learned to downrank female candidates."},
  {id:"a5",category:"ai",difficulty:"foundational",question:"What does prompt engineering mean in the context of AI tools for recruiters?",options:["Writing clear, structured inputs to an AI tool to get accurate, useful outputs","Building AI software and models entirely from scratch","Editing and refining AI-generated job descriptions after they are produced","Configuring workflow automation rules within an ATS system"],correct:0,explanation:"Prompt engineering is a core AI literacy skill — how you phrase a request to an LLM significantly affects output quality."},
  {id:"a6",category:"ai",difficulty:"practitioner",question:"What is AI washing in the context of HR technology vendors?",options:["Vendors marketing products as AI-powered when the underlying functionality is basic rule-based logic","Using AI tools specifically to clean up and reformat poorly formatted CVs","Removing AI-generated content from job descriptions before publishing","Anonymising candidate personal data before processing it through AI tools"],correct:0,explanation:"AI washing is rampant in HRtech — TA leaders should ask what model powers the product, how it was trained, and what bias audit results show."},
  {id:"a7",category:"ai",difficulty:"practitioner",question:"A recruiter uses AI to generate personalised outreach at scale. Most important quality check before sending?",options:["Review for accuracy, genuine personalisation and tone — AI produces plausible but factually wrong messages","Check the word count is within LinkedIn's character limit","Ensure the subject line follows correct title case formatting","Verify the AI tool is fully GDPR compliant before deployment"],correct:0,explanation:"AI outreach tools generate at speed but frequently produce messages that are superficially personalised but factually thin — damaging response rates."},
  {id:"a8",category:"ai",difficulty:"practitioner",question:"What does GDPR require TA teams to consider when using AI tools that process candidate personal data?",options:["Candidates must be informed AI is used in processing their application and must have the right to request human review","Nothing specific — GDPR only applies to customer-facing data and not hiring processes","All AI tools must be individually approved by the Information Commissioner's Office first","All candidate personal data must be stored within the EU regardless of company location"],correct:0,explanation:"GDPR Article 22 gives individuals rights around solely automated decision-making — TA teams must be transparent and provide a human review pathway."},
  {id:"a9",category:"ai",difficulty:"practitioner",question:"What is the key difference between AI tools that assist recruiters vs. AI that replaces recruiter judgement?",options:["Assistive tools augment human decision-making; replacement tools make autonomous decisions removing the human from the loop","Cost — assistive tools are always significantly cheaper to deploy","Replacement tools are inherently faster than assistive ones at all tasks","Assistive tools require significantly more training time to use effectively"],correct:0,explanation:"The human-in-the-loop distinction is critical for bias, legal compliance and quality — AI should reduce admin, not make hiring decisions."},
  {id:"a10",category:"ai",difficulty:"strategic",question:"How does the EU AI Act (2024) classify AI systems used in recruitment?",options:["As high-risk AI systems requiring transparency, human oversight and bias auditing before deployment","As low-risk tools requiring no specific compliance measures to deploy","As fully prohibited systems that cannot be used in any hiring decisions","As general-purpose tools that fall completely outside the scope of the Act"],correct:0,explanation:"The EU AI Act classifies AI used in employment and recruitment as high-risk — requiring conformity assessments, candidate transparency, human oversight and regular bias auditing."},
  {id:"a11",category:"ai",difficulty:"strategic",question:"What is agentic AI in the context of TA and why does it represent a significant shift?",options:["AI that completes multi-step recruiting tasks autonomously — sourcing, outreach, scheduling, screening — with minimal human input","AI that generates job descriptions and outreach messages completely autonomously","AI that replaces the ATS system and its underlying workflow entirely","AI that conducts full video interviews without any recruiter present"],correct:0,explanation:"Agentic AI chains multiple actions to complete end-to-end workflows. In TA this means automated sourcing-to-outreach-to-scheduling pipelines without per-step human triggers."},
  {id:"a12",category:"ai",difficulty:"strategic",question:"As AI automates more transactional TA tasks, what becomes the most critical differentiating skill for senior recruiters?",options:["Strategic advisory capability — workforce planning, stakeholder influence, quality-of-hire analysis and the human judgement AI cannot replicate","Becoming significantly faster at CV screening and candidate review","Becoming more effective at managing job boards and digital advertising","Developing deep technical knowledge of AI tools and their underlying models"],correct:0,explanation:"AI will commoditise transactional recruiting. The value of senior TA shifts to what AI cannot do: building trust, making nuanced assessments, influencing strategy and driving quality outcomes."},
  {id:"h1",category:"hot",difficulty:"foundational",question:"What is skills-based hiring and why is it gaining traction?",options:["Prioritising demonstrated skills and capabilities over traditional credentials like degrees and job titles","Hiring exclusively based on years of raw experience in a similar role","Using skills tests to completely replace all interview stages","Hiring candidates only from specific technical bootcamps and programmes"],correct:0,explanation:"Skills-based hiring expands the talent pool by removing proxies like degree requirements that often correlate more with socioeconomic background than job capability."},
  {id:"h2",category:"hot",difficulty:"foundational",question:"What is a boomerang hire in talent acquisition?",options:["A former employee who is rehired after leaving the company","A candidate who applies multiple times before eventually being hired","A hire made through a returned or credited agency referral fee","A candidate who rejects an offer but then reapplies at a later date"],correct:0,explanation:"Boomerang hires have pre-existing cultural alignment, faster ramp times and often return with new skills — an underutilised talent pool most companies fail to cultivate."},
  {id:"h3",category:"hot",difficulty:"foundational",question:"What is RecOps (Recruiting Operations) as a function?",options:["A specialist function focused on optimising TA processes, tools, data and reporting to improve recruiting efficiency","The operational process of recruiting people into operations management roles","The administrative and back-office arm of the broader HR department","A third-party managed service that handles all ATS configuration and maintenance"],correct:0,explanation:"RecOps combines process design, tooling, data analytics and project management to make recruiting more systematic, measurable and scalable."},
  {id:"h4",category:"hot",difficulty:"foundational",question:"What does pay transparency in job postings mean?",options:["Including salary ranges in job postings — driven by legislation and strong candidate demand","Sharing the entire company salary structure and bands publicly","Publishing every individual employee's salary on a public register","Sharing recruiter commission structures and rates with candidates"],correct:0,explanation:"Pay transparency legislation is expanding globally. It demonstrably improves application rates and reduces negotiation friction."},
  {id:"h5",category:"hot",difficulty:"practitioner",question:"Why is degree requirement removal alone insufficient to deliver skills-based hiring?",options:["Without redesigning screening criteria, interview questions and sourcing channels, removing the requirement changes the JD but not the hiring decision","Removing degree requirements is illegal in certain hiring jurisdictions","Candidates without degrees are simply not yet available in sufficient supply","ATS systems are currently unable to process applications without degree fields populated"],correct:0,explanation:"Skills-based hiring is a systems change, not a checkbox — removing the degree requirement while using interviews designed for credentialed candidates produces no change in who gets hired."},
  {id:"h6",category:"hot",difficulty:"practitioner",question:"What is the biggest TA challenge specific to hiring Gen Z candidates?",options:["They prioritise purpose, flexibility, transparency and fast processes — and disengage quickly from slow or opaque hiring experiences","They consistently lack the technical skills required for most modern roles","They carry unrealistic salary expectations compared to market rates","They strongly prefer to communicate only via formal email correspondence"],correct:0,explanation:"Gen Z candidates apply to multiple roles simultaneously and expect rapid responses. Speed, transparency and authentic employer brand are table stakes, not differentiators."},
  {id:"h7",category:"hot",difficulty:"practitioner",question:"What is internal mobility and why is it increasingly prioritised by TA teams?",options:["A strategy for developing and moving existing employees into new roles rather than hiring externally","Physically moving the TA team members between different office locations","A programme for relocating international hires to new countries and regions","Moving candidates between active reqs when their original role is paused or cancelled"],correct:0,explanation:"Internal hires onboard faster, retain longer and cost a fraction of external hires. TA teams that enable internal mobility are operating as strategic partners."},
  {id:"h8",category:"hot",difficulty:"practitioner",question:"What is the most significant risk of implementing hire for attitude, train for skill at scale?",options:["Without clear definitions of what attitude means, it becomes a proxy for affinity bias and cultural homogeneity","It makes traditional competency frameworks completely redundant","It significantly increases training costs across the entire organisation","It is simply not suitable or practical for technical or specialist roles"],correct:0,explanation:"Hire for attitude without definition is a bias amplifier. The philosophy is sound only when combined with specific, evidenced competency definitions."},
  {id:"h9",category:"hot",difficulty:"strategic",question:"What is the strategic case for TA investing in talent communities before reqs open?",options:["Pre-built communities of qualified, interested candidates allow TA to activate warm pipelines immediately when reqs open — reducing time-to-fill and sourcing cost","It reduces the need for all sourcing tools and platforms entirely","It completely replaces the need for an ATS and pipeline management system","It is primarily a branding exercise with no directly measurable hiring impact"],correct:0,explanation:"Talent communities convert TA from reactive to proactive — instead of starting from zero on each req, you activate relationships already built."},
  {id:"h10",category:"hot",difficulty:"strategic",question:"What is the core argument for treating TA as a revenue function rather than a cost centre?",options:["Every hire in a revenue-generating role has a direct productivity and ARR impact — the speed and quality of that hire determines when that value is realised","TA teams should directly charge business units for the services they provide","All TA-related spend should be formally reported directly on the company P&L","Recruiters should personally carry individual revenue targets each quarter"],correct:0,explanation:"In a B2B SaaS business, an unfilled AE or FDSE role has a measurable daily cost in missed pipeline. Framing TA's value in those terms repositions it as a business driver."},
  {id:"h11",category:"hot",difficulty:"strategic",question:"What is continuous candidate listening and why is it a TA best practice?",options:["Systematically collecting feedback from candidates at every stage — including those who dropped out or were rejected — to identify and fix experience gaps","Recording all candidate calls and conversations for quality assurance purposes","Actively monitoring candidate social media profiles during the hiring process","Following up with all successfully hired candidates monthly for their entire first year"],correct:0,explanation:"Most companies survey only hired candidates — missing the majority of feedback. Continuous listening captures rejected and dropped-out candidates, who have the most diagnostic feedback."},
  {id:"h12",category:"hot",difficulty:"strategic",question:"What is the most underutilised data source available to most TA teams today?",options:["ATS pipeline data that already exists but is rarely analysed systematically to drive process improvement decisions","LinkedIn Talent Insights and external market intelligence platforms","Glassdoor employer reviews and candidate satisfaction ratings","External salary benchmarking surveys and compensation data reports"],correct:0,explanation:"Most ATS systems contain years of pipeline, conversion and outcome data that TA teams never interrogate. The gap is in the analytical habit, not the data itself."},
];

function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }
function getTitle(s) { let t = TITLES[0][1]; for (const [n,l] of TITLES) { if (s >= n) t = l; } return t; }
function getRoast(to) { const p = to ? TIMEOUT_ROASTS : ROASTS; return p[Math.floor(Math.random()*p.length)]; }
function prepareQ(q) {
  const ct = q.options[q.correct];
  const sh = shuffle([...q.options]);
  return { ...q, options: sh, correct: sh.indexOf(ct) };
}
function getQuestions(catId) {
  const pool = catId === "wildcard" ? BANK : BANK.filter(q => q.category === catId);
  const byD = {
    foundational: shuffle(pool.filter(q => q.difficulty === "foundational")),
    practitioner: shuffle(pool.filter(q => q.difficulty === "practitioner")),
    strategic:    shuffle(pool.filter(q => q.difficulty === "strategic")),
  };
  return [...byD.foundational.slice(0,3), ...byD.practitioner.slice(0,4), ...byD.strategic.slice(0,3)].slice(0,10).map(prepareQ);
}

const STARS = Array.from({length:28}, (_,i) => ({
  id:i, x:Math.round(Math.random()*98)+1, y:Math.round(Math.random()*98)+1,
  size: i%5===0?3:i%3===0?2:1,
  dur: 3+Math.round(Math.random()*4),
  delay: Math.round(Math.random()*6),
  op: 0.15+Math.round(Math.random()*5)/10,
}));

const CANVAS_W = 520, CANVAS_H = 380, SQ_SIZE = 26;
const DECOYS = [
  {x:38, y:22, type:"bird",    color:"#7c3aed", size:22},
  {x:375,y:48, type:"leaf",    color:"#6d28d9", size:28},
  {x:105,y:185,type:"flower",  color:"#8b5cf6", size:20},
  {x:305,y:235,type:"berry",   color:"#7c3aed", size:18},
  {x:455,y:155,type:"bug",     color:"#9333ea", size:16},
  {x:55, y:305,type:"pebble",  color:"#6d28d9", size:24},
  {x:235,y:75, type:"mushroom",color:"#a855f7", size:22},
  {x:425,y:295,type:"acorn",   color:"#7c3aed", size:18},
  {x:160,y:265,type:"leaf",    color:"#8b5cf6", size:20},
  {x:340,y:310,type:"berry",   color:"#9333ea", size:16},
  {x:480,y:220,type:"bird",    color:"#6d28d9", size:19},
  {x:200,y:145,type:"flower",  color:"#7c3aed", size:18},
];
const SQ_SPOTS = [
  {x:42, y:30},{x:388,y:52},{x:115,y:188},
  {x:315,y:240},{x:242,y:80},{x:168,y:268},{x:348,y:315},
];

export default function App() {
  const [screen,       setScreen]       = useState("home");
  const [cat,          setCat]          = useState(null);
  const [questions,    setQuestions]    = useState([]);
  const [qi,           setQi]           = useState(0);
  const [selected,     setSelected]     = useState(null);
  const [answered,     setAnswered]     = useState(false);
  const [score,        setScore]        = useState(0);
  const [streak,       setStreak]       = useState(0);
  const [maxStreak,    setMaxStreak]    = useState(0);
  const [timeLeft,     setTimeLeft]     = useState(45);
  const [results,      setResults]      = useState([]);
  const [roast,        setRoast]        = useState("");
  const [lb,           setLb]           = useState([]);
  const [nameInput,    setNameInput]    = useState("");
  const [playerName,   setPlayerName]   = useState("");
  const [insights,     setInsights]     = useState({});
  const [loadingIns,   setLoadingIns]   = useState(null);
  const [streakMsg,    setStreakMsg]     = useState("");
  const [optAnim,      setOptAnim]      = useState(null);
  const [musicOn,      setMusicOn]      = useState(false);
  const [bonusTime,    setBonusTime]    = useState(45);
  const [bonusFound,   setBonusFound]   = useState(false);
  const [bonusExpired, setBonusExpired] = useState(false);
  const bonusPos  = useRef({x:170,y:200});
  const timerRef  = useRef(null);
  const bonusRef  = useRef(null);
  const audioCtx  = useRef(null);
  const bgGain    = useRef(null);
  const bgTimers  = useRef([]);

  const catObj = CATS.find(c => c.id === cat);
  const accent  = catObj?.color || "#7C3AED";
  const accentG = catObj?.grad  || "#4C1D95";

  // ── AUDIO ──
  function getCtx() {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx.current;
  }
  function tone(freq, type, dur, vol=0.15, delay=0) {
    try {
      const ctx = getCtx(); const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = type; o.frequency.value = freq;
      const t = ctx.currentTime + delay;
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+0.01); g.gain.exponentialRampToValueAtTime(0.001,t+dur);
      o.start(t); o.stop(t+dur);
    } catch(e) {}
  }
  function playCorrect() { tone(523,"sine",0.12,0.2); tone(659,"sine",0.12,0.2,0.1); tone(784,"sine",0.2,0.2,0.2); }
  function playWrong()   { tone(220,"sawtooth",0.25,0.15); tone(180,"sawtooth",0.3,0.12,0.2); }
  function playFound()   { [523,659,784,1047].forEach((f,i) => tone(f,"sine",0.3,0.22,i*0.12)); }

  function startMusic() {
    try {
      const ctx = getCtx();
      if (bgGain.current) return;
      const master = ctx.createGain(); master.gain.value = 0.055; master.connect(ctx.destination);
      bgGain.current = master;
      const pat = [262,294,330,349,392,349,330,294];
      let step = 0;
      function beat() {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(master); o.type = "triangle";
        o.frequency.value = pat[step % pat.length];
        g.gain.setValueAtTime(0.6, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
        o.start(); o.stop(ctx.currentTime + 0.32);
        step++;
        bgTimers.current.push(setTimeout(beat, 420));
      }
      beat();
    } catch(e) {}
  }
  function stopMusic() {
    bgTimers.current.forEach(t => clearTimeout(t)); bgTimers.current = [];
    if (bgGain.current) { try { bgGain.current.gain.value = 0; } catch(e) {} bgGain.current = null; }
  }
  function toggleMusic() {
    if (musicOn) { stopMusic(); setMusicOn(false); }
    else { startMusic(); setMusicOn(true); }
  }

  // ── MAIN TIMER ──
  useEffect(() => {
    if (screen !== "game" || answered) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); handleAnswer(null, true); return 0; } return t-1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, qi, answered]);

  // ── BONUS TIMER ──
  useEffect(() => {
    if (screen !== "bonus" || bonusFound || bonusExpired) return;
    bonusRef.current = setInterval(() => {
      setBonusTime(t => { if (t <= 1) { clearInterval(bonusRef.current); setBonusExpired(true); return 0; } return t-1; });
    }, 1000);
    return () => clearInterval(bonusRef.current);
  }, [screen, bonusFound, bonusExpired]);

  function startGame(catId) {
    setCat(catId); setQuestions(getQuestions(catId)); setQi(0); setScore(0);
    setStreak(0); setMaxStreak(0); setTimeLeft(45); setAnswered(false);
    setSelected(null); setResults([]); setInsights({}); setStreakMsg(""); setOptAnim(null);
    setScreen("game");
  }

  function handleAnswer(idx, timedOut=false) {
    if (answered) return;
    clearInterval(timerRef.current);
    setOptAnim(idx);
    const q = questions[qi];
    const correct = idx === q.correct;
    if (correct) playCorrect(); else if (!timedOut) playWrong();
    setTimeout(() => {
      setAnswered(true); setSelected(idx);
      const spd = correct ? Math.round(timeLeft*4) : 0;
      const ns   = correct ? streak+1 : 0;
      const sb   = correct && ns>1 ? (ns-1)*20 : 0;
      const gained = correct ? 100+spd+sb : 0;
      if (correct) setScore(s => s+gained);
      setStreak(ns); setMaxStreak(ms => Math.max(ms,ns));
      const msgs = {3:"3 in a row! 🔥",5:"5 streak! We see you. 👀",7:"7 in a row! 📖",10:"PERFECT ROUND. Talent Titan. 🏆"};
      setStreakMsg(msgs[ns]||"");
      if (!correct) setRoast(getRoast(timedOut));
      setResults(r => [...r, {...q, userAnswer:idx, correct, gained, timedOut}]);
      setOptAnim(null);
    }, 380);
  }

  function next() {
    if (qi+1 >= questions.length) { setScreen("result"); return; }
    setQi(i=>i+1); setAnswered(false); setSelected(null);
    setTimeLeft(45); setRoast(""); setStreakMsg(""); setOptAnim(null);
  }

  function submitScore() {
    const name = nameInput.trim()||"Anonymous"; setPlayerName(name);
    setLb(prev => [...prev,{name,score,title:getTitle(score),cat:catObj?.label,streak:maxStreak}].sort((a,b)=>b.score-a.score).slice(0,10));
    setScreen("leaderboard");
  }

async function fetchInsight(q, idx) {
  if (insights[idx]) return;
  setLoadingIns(idx);
  try {
    const res = await fetch("/api/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{
          role: "user",
          content: `A TA professional answered this trivia question incorrectly. Give a clear, practical educational insight (3-5 sentences) explaining the correct answer and why it matters in real TA practice.\n\nQuestion: ${q.question}\nCorrect answer: ${q.options[q.correct]}\nTheir wrong answer: ${q.options[q.userAnswer] ?? "Timed out"}\n\nPlain text only.`
        }]
      })
    });
    const d = await res.json();
    const text = d.choices?.[0]?.message?.content || "Could not load.";
    setInsights(p => ({ ...p, [idx]: text }));
  } catch {
    setInsights(p => ({ ...p, [idx]: "Could not load insight." }));
  }
  setLoadingIns(null);
}

  function startBonus() {
    bonusPos.current = SQ_SPOTS[Math.floor(Math.random()*SQ_SPOTS.length)];
    setBonusTime(45); setBonusFound(false); setBonusExpired(false);
    setScreen("bonus");
  }

  function handleCanvasClick(e) {
    if (bonusFound || bonusExpired) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX-rect.left)*(CANVAS_W/rect.width);
    const cy = (e.clientY-rect.top)*(CANVAS_H/rect.height);
    const sq = bonusPos.current;
    const dist = Math.sqrt((cx-(sq.x+SQ_SIZE/2))**2+(cy-(sq.y+SQ_SIZE/2))**2);
    if (dist < SQ_SIZE) {
      clearInterval(bonusRef.current);
      playFound();
      setBonusFound(true);
      setScore(s => s+500);
    }
  }

  const q = questions[qi];
  const timerPct  = (timeLeft/45)*100;
  const urgent    = timeLeft <= 10;
  const acc       = results.length ? Math.round(results.filter(r=>r.correct).length/results.length*100) : 0;
  const bonusPct  = (bonusTime/45)*100;
  const bonusUrgent = bonusTime <= 10;

  const css = `
    @keyframes flash-opt{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes slide-up{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes pop-in{0%{transform:scale(.88);opacity:0}100%{transform:scale(1);opacity:1}}
    @keyframes correct-bg{0%{background:#14532d}40%{background:#166534}100%{background:#14532d}}
    @keyframes wrong-bg{0%{background:#450a0a}40%{background:#7f1d1d}100%{background:#450a0a}}
    @keyframes urgent-pulse{0%,100%{opacity:1}50%{opacity:.45}}
    @keyframes star-drift{0%{transform:translateY(0)scale(1);opacity:.6}50%{transform:translateY(-10px)scale(1.1);opacity:1}100%{transform:translateY(0)scale(1);opacity:.6}}
    @keyframes sq-peek{0%,100%{transform:translateX(0)}35%{transform:translateX(2px)}70%{transform:translateX(-1.5px)}}
    @keyframes glow-reveal{0%{filter:drop-shadow(0 0 4px #a78bfa)}50%{filter:drop-shadow(0 0 16px #a78bfa)}100%{filter:drop-shadow(0 0 4px #a78bfa)}}
    .opt-btn{transition:transform .12s,filter .12s}
    .opt-btn:hover:not(:disabled){transform:translateX(4px);filter:brightness(1.09)}
    .opt-btn:active:not(:disabled){transform:translateX(2px)scale(.98)}
    .se{animation:slide-up .28s ease both}
    .cat-card{transition:transform .15s,box-shadow .15s}
    .cat-card:hover{transform:translateY(-4px)}
  `;

  const Squirrel = ({style={}}) => (
    <div style={{position:"relative",width:"100%",height:"100%",...style}}>
      <div style={{position:"absolute",bottom:0,left:"22%",width:"56%",height:"50%",background:"#7c3aed",borderRadius:"35% 35% 28% 28%"}}/>
      <div style={{position:"absolute",bottom:"42%",left:"28%",width:"44%",height:"40%",background:"#7c3aed",borderRadius:"50% 50% 28% 28%"}}/>
      <div style={{position:"absolute",bottom:"74%",left:"24%",width:"15%",height:"18%",background:"#6d28d9",borderRadius:"50% 50% 0 30%",transform:"rotate(-15deg)"}}/>
      <div style={{position:"absolute",bottom:"74%",left:"58%",width:"15%",height:"18%",background:"#6d28d9",borderRadius:"50% 50% 30% 0",transform:"rotate(15deg)"}}/>
      <div style={{position:"absolute",bottom:"12%",left:"-35%",width:"50%",height:"65%",background:"#6d28d9",borderRadius:"0 70% 70% 18%",opacity:.78,transform:"rotate(-18deg)"}}/>
      <div style={{position:"absolute",bottom:"58%",left:"54%",width:"10%",height:"10%",background:"#1a0a2e",borderRadius:"50%"}}/>
    </div>
  );

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:"#0f0f1a",minHeight:"100vh",color:"#fff",position:"relative",overflow:"hidden"}}>
      <style>{css}</style>

      {/* star field */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        {STARS.map(s => (
          <div key={s.id} style={{
            position:"absolute",left:`${s.x}%`,top:`${s.y}%`,
            width:s.size,height:s.size,borderRadius:"50%",
            background:`rgba(167,139,250,${s.op})`,
            animation:`star-drift ${s.dur}s ${s.delay}s ease-in-out infinite`,
          }}/>
        ))}
      </div>

      {/* music toggle */}
      <button onClick={toggleMusic} style={{
        position:"fixed",top:14,right:14,zIndex:200,
        background:musicOn?"#4c1d95":"#1e1b2e",
        border:`1px solid ${musicOn?"#7c3aed":"#2d2b45"}`,
        borderRadius:99,padding:"6px 14px",cursor:"pointer",
        fontSize:12,fontWeight:700,color:musicOn?"#e9d5ff":"#64748b",
        fontFamily:"inherit",transition:"all .2s",
      }}>
        {musicOn?"♪ On":"♪ Off"}
      </button>

      {/* ── HOME ── */}
      {screen==="home" && (
        <div className="se" style={{maxWidth:560,margin:"0 auto",padding:"2rem 1rem 4rem",position:"relative",zIndex:1}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem",paddingTop:"1rem"}}>
            <div style={{fontSize:13,fontWeight:700,letterSpacing:".2em",textTransform:"uppercase",color:"#818cf8",marginBottom:".5rem"}}>Welcome to</div>
            <h1 style={{fontSize:32,fontWeight:900,margin:"0 0 .4rem",background:"linear-gradient(135deg,#a78bfa,#f472b6,#fb923c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1.15}}>Talent Acquisition<br/>Trivia</h1>
            <p style={{fontSize:14,color:"#94a3b8",margin:"0 0 .1rem"}}>10 questions · 45 seconds each · TA professionals only</p>
          </div>

          <p style={{fontSize:11,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#475569",marginBottom:4,paddingLeft:4}}>Pick a category</p>
          <p style={{fontSize:13,color:"#a78bfa",marginBottom:10,paddingLeft:4,fontStyle:"italic"}}>Complete the quiz and try to find the purple squirrel at the end for bonus points... 😏</p>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:"2rem"}}>
            {CATS.map(c => (
              <button key={c.id} className="cat-card" onClick={() => startGame(c.id)}
                style={{borderRadius:16,padding:"1.25rem 1rem",cursor:"pointer",border:`1px solid ${c.color}40`,textAlign:"left",background:`linear-gradient(135deg,${c.color}20,${c.grad}30)`,outline:"none",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-20,right:-20,width:70,height:70,borderRadius:"50%",background:c.color,opacity:.07}}/>
                <div style={{fontSize:26,marginBottom:8,lineHeight:1}}>{c.emoji}</div>
                <div style={{fontSize:14,fontWeight:700,color:"#f1f5f9"}}>{c.label}</div>
                <div style={{fontSize:11,color:c.color,fontWeight:600,marginTop:3,textTransform:"uppercase",letterSpacing:".06em"}}>Play →</div>
              </button>
            ))}
          </div>

          {lb.length > 0 && (
            <div style={{borderRadius:16,padding:"1.25rem",background:"#1e1b2e",border:"1px solid #2d2b45"}}>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#475569",margin:"0 0 12px"}}>Leaderboard</p>
              {lb.slice(0,5).map((e,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<Math.min(lb.length,5)-1?"1px solid #2d2b45":"none"}}>
                  <span style={{fontSize:15,minWidth:24,textAlign:"center"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}.`}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{e.name}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>{e.title} · {e.cat}</div>
                  </div>
                  <span style={{fontSize:14,fontWeight:800,color:"#a78bfa"}}>{e.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── GAME ── */}
      {screen==="game" && q && (
        <div style={{maxWidth:560,margin:"0 auto",padding:"0 0 3rem",minHeight:"100vh",display:"flex",flexDirection:"column",position:"relative",zIndex:1}}>
          <div style={{background:`linear-gradient(180deg,${accent}20 0%,transparent 100%)`,borderBottom:"1px solid #ffffff0e",padding:"1rem 1.25rem .75rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18,lineHeight:1}}>{catObj?.emoji}</span>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:accent,textTransform:"uppercase",letterSpacing:".08em"}}>{catObj?.label}</div>
                  <div style={{fontSize:11,color:"#64748b"}}>Q{qi+1} of {questions.length}</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:20,fontWeight:900,color:"#f1f5f9",lineHeight:1}}>{score.toLocaleString()}</div>
                <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:".08em"}}>points</div>
              </div>
            </div>
            <div style={{display:"flex",gap:5,marginBottom:10}}>
              {questions.map((_,i) => (
                <div key={i} style={{flex:1,height:4,borderRadius:99,background:i<qi?accent:i===qi?accent+"88":"#2d2b45",transition:"background .3s"}}/>
              ))}
            </div>
            <div style={{position:"relative",height:6,background:"#1e1b2e",borderRadius:99,overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",borderRadius:99,
                width:`${timerPct}%`,
                background:urgent?"#ef4444":timeLeft<=20?"#f59e0b":accent,
                transition:"width 1s linear,background .4s",
                animation:urgent?"urgent-pulse 1s ease infinite":"none",
              }}/>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:3}}>
              <span style={{fontSize:12,fontWeight:700,color:urgent?"#ef4444":timeLeft<=20?"#f59e0b":"#64748b",animation:urgent?"urgent-pulse 1s ease infinite":"none"}}>{timeLeft}s</span>
            </div>
          </div>

          <div style={{padding:"10px 1.25rem 0",display:"flex",gap:8,flexWrap:"wrap"}}>
            <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,background:DIFF_COLOR[q.difficulty]+"22",color:DIFF_COLOR[q.difficulty],border:`1px solid ${DIFF_COLOR[q.difficulty]}44`,textTransform:"uppercase",letterSpacing:".08em"}}>{q.difficulty}</span>
            {streak>=2 && <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,background:"#fb923c22",color:"#fb923c",border:"1px solid #fb923c44"}}>🔥 {streak} streak</span>}
            {streakMsg && <span style={{fontSize:12,fontWeight:700,color:"#fbbf24",animation:"pop-in .3s ease both"}}>{streakMsg}</span>}
          </div>

          <div style={{padding:"1rem 1.25rem .5rem",flex:1}}>
            <div style={{borderRadius:20,padding:"1.4rem 1.5rem",background:"#1e1b2e",border:"1px solid #2d2b45",marginBottom:"1rem",animation:"pop-in .25s ease both"}}>
              <p style={{fontSize:17,fontWeight:700,lineHeight:1.55,color:"#f1f5f9",margin:0}}>{q.question}</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {q.options.map((opt,i) => {
                const isC = answered && i===q.correct;
                const isW = answered && i===selected && i!==q.correct;
                const isF = optAnim===i;
                return (
                  <button key={i} className="opt-btn" disabled={answered||optAnim!==null} onClick={()=>handleAnswer(i)}
                    style={{borderRadius:14,padding:"12px 14px",textAlign:"left",fontSize:13,lineHeight:1.4,
                      cursor:answered?"default":"pointer",fontFamily:"inherit",outline:"none",
                      border:`1.5px solid ${isC?"#16a34a":isW?"#dc2626":answered?"#2d2b45":accent+"55"}`,
                      background:isC?"#14532d":isW?"#450a0a":answered?"#1a1828":"#1e1b2e",
                      color:isC?"#86efac":isW?"#fca5a5":"#cbd5e1",
                      fontWeight:isC||isW?700:"normal",
                      animation:isF?"flash-opt .38s ease":isC?"correct-bg .6s ease":isW?"wrong-bg .6s ease":"none",
                      display:"flex",gap:10,alignItems:"flex-start",
                    }}>
                    <span style={{minWidth:22,height:22,borderRadius:6,background:isC?"#16a34a":isW?"#dc2626":accent+"33",color:isC?"#fff":isW?"#fff":accent,fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                      {OPTION_LABELS[i]}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div style={{marginTop:12,borderRadius:16,padding:"1rem 1.15rem",background:selected===q.correct?"#14532d":"#450a0a",border:`1px solid ${selected===q.correct?"#16a34a44":"#dc262644"}`,animation:"slide-up .3s ease both"}}>
                {selected===q.correct ? (
                  <><div style={{fontSize:14,fontWeight:800,color:"#86efac",marginBottom:4}}>Correct! +{results[results.length-1]?.gained} pts</div>
                  <div style={{fontSize:13,color:"#bbf7d0",lineHeight:1.55}}>{q.explanation}</div></>
                ) : (
                  <><div style={{fontSize:14,fontWeight:800,color:"#fca5a5",marginBottom:3}}>{selected===null?"Time's up!":"Wrong answer"}</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#f87171",marginBottom:5}}>{roast}</div>
                  <div style={{fontSize:13,color:"#fecaca",lineHeight:1.55}}>{q.explanation}</div></>
                )}
                <button onClick={next} style={{marginTop:12,width:"100%",padding:"11px",borderRadius:12,border:"none",fontSize:14,fontWeight:800,cursor:"pointer",color:"#fff",background:qi+1>=questions.length?`linear-gradient(135deg,#7C3AED,#BE185D)`:`linear-gradient(135deg,${accent},${accentG})`,fontFamily:"inherit",letterSpacing:".02em"}}>
                  {qi+1>=questions.length?"See my results →":"Next question →"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {screen==="result" && (
        <div className="se" style={{maxWidth:560,margin:"0 auto",padding:"2rem 1rem 4rem",position:"relative",zIndex:1}}>
          <div style={{borderRadius:24,padding:"2rem 1.5rem",marginBottom:"1.25rem",background:`linear-gradient(135deg,${accent},${accentG})`,textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-30,left:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
            <div style={{position:"relative",zIndex:1}}>
              <div style={{fontSize:36,marginBottom:8}}>🎯</div>
              <div style={{fontSize:13,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.65)",marginBottom:4}}>Your result</div>
              <div style={{fontSize:26,fontWeight:900,color:"#fff",marginBottom:2}}>{getTitle(score)}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.7)"}}>{catObj?.emoji} {catObj?.label}</div>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:"1.25rem"}}>
            {[["Score",score.toLocaleString(),"#a78bfa"],["Accuracy",acc+"%","#34d399"],["Best streak",maxStreak+"x","#fb923c"]].map(([l,v,c])=>(
              <div key={l} style={{borderRadius:16,padding:"1rem",textAlign:"center",background:"#1e1b2e",border:"1px solid #2d2b45"}}>
                <div style={{fontSize:22,fontWeight:900,color:c,marginBottom:3}}>{v}</div>
                <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:"#475569"}}>{l}</div>
              </div>
            ))}
          </div>

          {/* BONUS TEASER */}
          <div onClick={startBonus} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="none"}
            style={{borderRadius:16,padding:"1.1rem 1.25rem",background:"linear-gradient(135deg,#4a1d96,#6d28d9)",border:"1px solid #7c3aed55",cursor:"pointer",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:14,transition:"transform .15s"}}>
            <div style={{fontSize:30,lineHeight:1,flexShrink:0}}>🐿️</div>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:"#e9d5ff",marginBottom:2}}>Bonus Round — Find the Purple Squirrel</div>
              <div style={{fontSize:12,color:"#a78bfa"}}>+500 bonus points if you can spot it in 45 seconds →</div>
            </div>
          </div>

          <div style={{borderRadius:16,padding:"1.25rem",background:"#1e1b2e",border:"1px solid #2d2b45",marginBottom:"1.25rem"}}>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#475569",margin:"0 0 12px"}}>Question review</p>
            {results.map((r,i)=>(
              <div key={i} style={{padding:"10px 0",borderBottom:i<results.length-1?"1px solid #2d2b45":"none"}}>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                  <span style={{fontSize:15,color:r.correct?"#22c55e":"#ef4444",minWidth:20,marginTop:1}}>{r.correct?"✓":"✗"}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0",marginBottom:3,lineHeight:1.4}}>{r.question}</div>
                    {r.correct
                      ? <div style={{fontSize:12,color:"#4ade80"}}>{r.options[r.correct]}</div>
                      : <>
                          <div style={{fontSize:12,color:"#f87171",marginBottom:2}}>You chose: {r.options[r.userAnswer]??"Timed out"}</div>
                          <div style={{fontSize:12,color:"#4ade80",marginBottom:6}}>Correct: {r.options[r.correct]}</div>
                          {!insights[i] && <button onClick={()=>fetchInsight(r,i)} disabled={loadingIns===i} style={{fontSize:12,padding:"4px 12px",borderRadius:8,border:`1px solid ${accent}55`,background:"transparent",color:accent,cursor:"pointer",fontFamily:"inherit"}}>{loadingIns===i?"Loading...":"Why does this matter? →"}</button>}
                          {insights[i] && <div style={{borderRadius:10,padding:"10px 12px",background:accent+"18",border:`1px solid ${accent}30`,marginTop:6}}><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:accent,marginBottom:4}}>Educational insight</div><div style={{fontSize:12,color:"#cbd5e1",lineHeight:1.6}}>{insights[i]}</div></div>}
                        </>
                    }
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:r.correct?"#a78bfa":"#475569",whiteSpace:"nowrap"}}>+{r.gained}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{borderRadius:16,padding:"1.25rem",background:"#1e1b2e",border:"1px solid #2d2b45",marginBottom:"1rem"}}>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#475569",margin:"0 0 10px"}}>Submit to leaderboard</p>
            <div style={{display:"flex",gap:8}}>
              <input value={nameInput} onChange={e=>setNameInput(e.target.value)} placeholder="Your name"
                style={{flex:1,padding:"10px 14px",borderRadius:10,border:"1px solid #2d2b45",background:"#0f0f1a",color:"#f1f5f9",fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              <button onClick={submitScore} style={{padding:"10px 16px",borderRadius:10,border:"none",fontSize:14,fontWeight:700,cursor:"pointer",color:"#fff",background:`linear-gradient(135deg,${accent},${accentG})`,fontFamily:"inherit",whiteSpace:"nowrap"}}>Submit</button>
            </div>
          </div>
          <button onClick={()=>setScreen("home")} style={{width:"100%",padding:"12px",borderRadius:14,border:"1px solid #2d2b45",background:"transparent",fontSize:14,cursor:"pointer",color:"#94a3b8",fontFamily:"inherit"}}>Back to categories</button>
        </div>
      )}

      {/* ── BONUS ── */}
      {screen==="bonus" && (
        <div className="se" style={{maxWidth:560,margin:"0 auto",padding:"1.5rem 1rem 4rem",position:"relative",zIndex:1}}>
          <div style={{textAlign:"center",marginBottom:"1rem"}}>
            <div style={{fontSize:13,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:"#a78bfa",marginBottom:4}}>Bonus Round</div>
            <h2 style={{fontSize:22,fontWeight:900,color:"#f1f5f9",margin:"0 0 4px"}}>Find the Purple Squirrel</h2>
            <p style={{fontSize:13,color:"#64748b",margin:0}}>Every recruiter's unicorn. Click it when you find it.</p>
          </div>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:120,height:5,borderRadius:99,background:"#1e1b2e",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${bonusPct}%`,background:bonusUrgent?"#ef4444":bonusTime<=20?"#f59e0b":"#a78bfa",borderRadius:99,transition:"width 1s linear,background .4s",animation:bonusUrgent?"urgent-pulse 1s ease infinite":"none"}}/>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:bonusUrgent?"#ef4444":"#a78bfa"}}>{bonusTime}s</span>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:"#fbbf24"}}>+500 pts if found</div>
          </div>

          {/* scene */}
          <div onClick={handleCanvasClick} style={{position:"relative",width:"100%",paddingTop:`${(CANVAS_H/CANVAS_W)*100}%`,borderRadius:20,overflow:"hidden",cursor:"crosshair",border:"2px solid #2d2b45",userSelect:"none"}}>
            <div style={{position:"absolute",inset:0}}>
              {/* bg */}
              <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#0f2a0f 0%,#1a3d1a 55%,#2d5a2d 100%)"}}/>
              {/* distant trees */}
              {[30,90,160,230,300,370,430,490].map((x,i)=>(
                <div key={i} style={{position:"absolute",bottom:"42%",left:`${(x/CANVAS_W)*100}%`,width:`${(26+i%3*8)/CANVAS_W*100}%`,height:`${16+i%4*6}%`,background:"#0d1f0d",borderRadius:"40% 40% 0 0",opacity:.65}}/>
              ))}
              {/* ground */}
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:"42%",background:"#1a3d1a"}}/>
              <div style={{position:"absolute",bottom:"40%",left:0,right:0,height:"4%",background:"#2d5a2d",borderRadius:"50% 50% 0 0"}}/>
              {/* trunks + canopy */}
              {[60,180,320,450].map((x,i)=>(
                <div key={i}>
                  <div style={{position:"absolute",bottom:"38%",left:`${((x-8)/CANVAS_W)*100}%`,width:`${15/CANVAS_W*100}%`,height:"33%",background:"#3d2b1a"}}/>
                  <div style={{position:"absolute",bottom:"66%",left:`${((x-34)/CANVAS_W)*100}%`,width:`${68/CANVAS_W*100}%`,height:"26%",background:"#1a4a1a",borderRadius:"50% 50% 20% 20%"}}/>
                  <div style={{position:"absolute",bottom:"74%",left:`${((x-20)/CANVAS_W)*100}%`,width:`${42/CANVAS_W*100}%`,height:"18%",background:"#0f3a0f",borderRadius:"50% 50% 20% 20%"}}/>
                </div>
              ))}
              {/* log */}
              <div style={{position:"absolute",bottom:"41%",left:"38%",width:"12%",height:"4%",background:"#5c3d1e",borderRadius:4,border:"1px solid #3d2b1a"}}/>

              {/* DECOYS */}
              {DECOYS.map((d,i)=>{
                const shapes = {
                  bird:     <div style={{width:d.size,height:d.size/1.8,borderRadius:"50% 50% 0 0",background:d.color,opacity:.72}}/>,
                  leaf:     <div style={{width:d.size,height:d.size,borderRadius:"0 80% 0 80%",background:d.color,opacity:.68,transform:"rotate(-30deg)"}}/>,
                  flower:   <div style={{width:d.size,height:d.size,borderRadius:"50%",background:d.color,opacity:.62,border:"2px solid #6d28d9"}}/>,
                  berry:    <div style={{width:d.size,height:d.size,borderRadius:"50%",background:d.color,opacity:.78}}/>,
                  bug:      <div style={{width:d.size*1.4,height:d.size*.7,borderRadius:99,background:d.color,opacity:.68}}/>,
                  pebble:   <div style={{width:d.size,height:d.size*.8,borderRadius:"40%",background:d.color,opacity:.58}}/>,
                  mushroom: <div style={{width:d.size,height:d.size,borderRadius:"50% 50% 0 0",background:d.color,opacity:.68}}/>,
                  acorn:    <div style={{width:d.size*.8,height:d.size,borderRadius:"40% 40% 50% 50%",background:d.color,opacity:.68}}/>,
                };
                return <div key={i} style={{position:"absolute",left:`${(d.x/CANVAS_W)*100}%`,top:`${(d.y/CANVAS_H)*100}%`,pointerEvents:"none"}}>{shapes[d.type]}</div>;
              })}

              {/* THE SQUIRREL */}
              {!bonusFound && !bonusExpired && (
                <div style={{position:"absolute",left:`${(bonusPos.current.x/CANVAS_W)*100}%`,top:`${(bonusPos.current.y/CANVAS_H)*100}%`,width:`${(SQ_SIZE/CANVAS_W)*100}%`,aspectRatio:"1",cursor:"crosshair",zIndex:5,opacity:.8,animation:"sq-peek 4.5s 2s ease-in-out infinite"}}>
                  <Squirrel/>
                </div>
              )}

              {/* FOUND */}
              {bonusFound && (
                <div style={{position:"absolute",inset:0,background:"rgba(109,40,217,.8)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"pop-in .3s ease both",borderRadius:18}}>
                  <div style={{fontSize:52,marginBottom:8}}>🐿️</div>
                  <div style={{fontSize:22,fontWeight:900,color:"#e9d5ff",marginBottom:6,textAlign:"center",padding:"0 1rem"}}>You found me!</div>
                  <div style={{fontSize:14,color:"#c4b5fd",textAlign:"center",padding:"0 2rem",lineHeight:1.5}}>Congratulations — you're officially a Purple Squirrel hunter. +500 pts!</div>
                  <div style={{fontSize:13,color:"#a78bfa",marginTop:8,fontStyle:"italic"}}>The mythical hire, discovered at last. 🏆</div>
                </div>
              )}

              {/* EXPIRED */}
              {bonusExpired && (
                <div style={{position:"absolute",inset:0,background:"rgba(15,15,26,.88)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"pop-in .3s ease both",borderRadius:18}}>
                  <div style={{position:"absolute",left:`${(bonusPos.current.x/CANVAS_W)*100}%`,top:`${(bonusPos.current.y/CANVAS_H)*100}%`,width:`${(SQ_SIZE*2.2/CANVAS_W)*100}%`,aspectRatio:"1",animation:"glow-reveal 1.2s ease-in-out infinite"}}>
                    <Squirrel/>
                  </div>
                  <div style={{fontSize:42,marginBottom:8}}>😏</div>
                  <div style={{fontSize:20,fontWeight:900,color:"#e9d5ff",marginBottom:6,textAlign:"center",padding:"0 1rem"}}>I knew you'd never find me.</div>
                  <div style={{fontSize:13,color:"#a78bfa",textAlign:"center",padding:"0 2rem",lineHeight:1.55,fontStyle:"italic"}}>Just like that perfect candidate your HM keeps asking for... I don't exist.</div>
                </div>
              )}
            </div>
          </div>

          {(bonusFound||bonusExpired) && (
            <button onClick={()=>setScreen("result")} style={{marginTop:"1.25rem",width:"100%",padding:"13px",borderRadius:14,border:"none",fontSize:15,fontWeight:800,cursor:"pointer",color:"#fff",background:"linear-gradient(135deg,#7C3AED,#BE185D)",fontFamily:"inherit"}}>
              Back to results →
            </button>
          )}
        </div>
      )}

      {/* ── LEADERBOARD ── */}
      {screen==="leaderboard" && (
        <div className="se" style={{maxWidth:560,margin:"0 auto",padding:"2rem 1rem 4rem",position:"relative",zIndex:1}}>
          <div style={{borderRadius:24,padding:"2rem 1.5rem",marginBottom:"1.25rem",background:"linear-gradient(135deg,#312e81,#1e1b4b)",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,borderRadius:"50%",background:"rgba(167,139,250,.08)"}}/>
            <div style={{fontSize:36,marginBottom:8}}>🏆</div>
            <div style={{fontSize:13,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.5)",marginBottom:4}}>Leaderboard</div>
            <div style={{fontSize:26,fontWeight:900,color:"#fff"}}>{playerName}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>{getTitle(score)} · {score.toLocaleString()} pts</div>
          </div>
          <div style={{borderRadius:16,padding:"1.25rem",background:"#1e1b2e",border:"1px solid #2d2b45",marginBottom:"1rem"}}>
            {lb.map((e,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<lb.length-1?"1px solid #2d2b45":"none"}}>
                <span style={{fontSize:17,minWidth:28,textAlign:"center"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":<span style={{fontSize:13,color:"#475569"}}>{i+1}</span>}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{e.name}</div>
                  <div style={{fontSize:11,color:"#64748b"}}>{e.title} · {e.cat}</div>
                </div>
                <span style={{fontSize:15,fontWeight:900,color:"#a78bfa"}}>{e.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <button onClick={()=>setScreen("home")} style={{width:"100%",padding:"13px",borderRadius:14,border:"none",fontSize:15,fontWeight:800,cursor:"pointer",color:"#fff",background:"linear-gradient(135deg,#7C3AED,#BE185D)",fontFamily:"inherit",letterSpacing:".02em"}}>
            Play again
          </button>
        </div>
      )}
    </div>
  );
}