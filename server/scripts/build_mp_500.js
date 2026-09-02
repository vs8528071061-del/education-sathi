const fs = require('fs');
const path = require('path');

// Raw text as provided by user across all 5 parts
const rawPart1 = `1	IIT Indore	Indore	Govt
2	IISER Bhopal	Bhopal	Govt
3	AIIMS Bhopal	Bhopal	Govt
4	MANIT Bhopal	Bhopal	Govt
5	SGSITS	Indore	Govt
6	Dr. Harisingh Gour Vishwavidyalaya	Sagar	Central
7	DAVV	Indore	Govt
8	RGPV	Bhopal	Govt
9	Jiwaji University	Gwalior	Govt
10	Barkatullah University	Bhopal	Govt
11	Rani Durgavati University	Jabalpur	Govt
12	Vikram University	Ujjain	Govt
13	Samrat Ashok Technological Institute	Vidisha	Govt
14	Institute for Excellence in Higher Education	Bhopal	Govt
15	VIT Bhopal University	Sehore	Private
16	LNCT Bhopal	Bhopal	Private
17	LNCT University	Bhopal	Private
18	IPS Academy	Indore	Private
19	Prestige Institute of Management & Research	Indore	Private
20	Medicaps University	Indore	Private
21	Technocrats Institute of Technology	Bhopal	Private
22	Technocrats Institute of Technology–Excellence	Bhopal	Private
23	IES College of Technology	Bhopal	Private
24	Gyan Ganga Institute of Technology & Sciences	Jabalpur	Private
25	Prestige Institute of Engineering Management & Research	Indore	Private
26	Holkar Science College	Indore	Govt
27	Bhopal School of Social Sciences	Bhopal	Private
28	Career College	Bhopal	Private
29	St. Aloysius College	Jabalpur	Private
30	Govt. Model Science College	Jabalpur	Govt
31	Govt. Mahakoshal Arts & Commerce College	Jabalpur	Govt
32	Mata Gujri Mahila Mahavidyalaya	Jabalpur	Private
33	Govt. Mankunwarbai Arts & Commerce College	Jabalpur	Govt
34	G.S. College of Commerce & Economics	Jabalpur	Private
35	Govt. P.G. College	Rewa	Govt
36	Govt. P.G. College	Satna	Govt
37	Thakur Ranmat Singh College	Rewa	Govt
38	Sanjay Gandhi Smriti Govt. College	Sidhi	Govt
39	Kamala Raja Girls P.G. College	Gwalior	Govt
40	M.L.B. Arts & Commerce College	Gwalior	Govt
41	Prestige Institute of Management	Gwalior	Private
42	Govt. P.G. College	Datia	Govt
43	Govt. P.G. College	Chhindwara	Govt
44	Govt. P.G. College	Shahdol	Govt
45	Govt. Girls P.G. College	Ujjain	Govt
46	Madhav Science College	Ujjain	Govt
47	Mata Jijabai Govt. Girls P.G. College	Indore	Govt
48	Govt. Arts & Commerce College	Indore	Govt
49	Pioneer Institute of Professional Studies	Indore	Private
50	St. Paul Institute of Professional Studies	Indore	Private
51	Indore Institute of Law	Indore	Private
52	IPS Academy Institute of Engineering & Science	Indore	Private
53	Shivajirao Kadam Institute of Technology & Management	Indore	Private
54	Oriental University	Indore	Private
55	Renaissance University	Indore	Private
56	Sri Aurobindo Institute of Technology	Indore	Private
57	Acropolis Institute of Technology & Research	Indore	Private
58	Medi-Caps University	Indore	Private
59	SVITS Indore	Indore	Private
60	Chameli Devi Group of Institutions	Indore	Private
61	Malwa Institute of Technology	Indore	Private
62	SAGE University	Indore	Private
63	IPS Academy College of Pharmacy	Indore	Private
64	Bansal Institute of Science & Technology	Bhopal	Private
65	Sagar Institute of Research & Technology	Bhopal	Private
66	Sagar Institute of Science & Technology	Bhopal	Private
67	Oriental College of Technology	Bhopal	Private
68	Lakshmi Narain College of Technology & Science	Bhopal	Private
69	BSSS College	Bhopal	Private
70	Jagran Lakecity University	Bhopal	Private
71	People’s University	Bhopal	Private
72	RKDF University	Bhopal	Private
73	Oriental University	Bhopal/Indore	Private
74	Mansarovar Global University	Bhopal	Private
75	Sarvepalli Radhakrishnan University	Bhopal	Private
76	LN Medical College & Research Centre	Bhopal	Private
77	People’s College of Medical Sciences & Research Centre	Bhopal	Private
78	Chirayu Medical College & Hospital	Bhopal	Private
79	Gandhi Medical College	Bhopal	Govt
80	Netaji Subhash Chandra Bose Medical College	Jabalpur	Govt
81	Shyam Shah Medical College	Rewa	Govt
82	Gajra Raja Medical College	Gwalior	Govt
83	MGM Medical College	Indore	Govt
84	Bundelkhand Medical College	Sagar	Govt
85	Government Medical College	Ratlam	Govt
86	Government Medical College	Khandwa	Govt
87	Government Medical College	Shivpuri	Govt
88	Government Medical College	Datia	Govt
89	Government Medical College	Vidisha	Govt
90	Government Medical College	Satna	Govt
91	Government Dental College	Indore	Govt
92	People’s Dental Academy	Bhopal	Private
93	Mansarovar Dental College	Bhopal	Private
94	Bhabha College of Dental Sciences	Bhopal	Private
95	Rishiraj College of Dental Sciences	Bhopal	Private
96	Hitkarini Dental College	Jabalpur	Private
97	Sri Aurobindo Institute of Medical Sciences	Indore	Private
98	Index Medical College	Indore	Private
99	Mahatma Gandhi Memorial Medical College	Indore	Govt
100	Amaltas Institute of Medical Sciences	Dewas	Private`;

const rawPart2 = `101	LNCT Medical College & Sewakunj Hospital	Indore	Private	Medical
102	Index Institute of Medical Sciences	Indore	Private	Medical
103	Mahaveer Institute of Medical Sciences & Research	Bhopal	Private	Medical
104	RKDF Medical College	Bhopal	Private	Medical
105	Ram Krishna College of Medical Sciences	Bhopal	Private	Medical
106	People’s College of Nursing & Research Centre	Bhopal	Private	Nursing
107	LNCT College of Nursing	Bhopal	Private	Nursing
108	Chirayu College of Nursing	Bhopal	Private	Nursing
109	RKDF College of Nursing	Bhopal	Private	Nursing
110	Bansal College of Nursing	Bhopal	Private	Nursing
111	Government College of Nursing	Bhopal	Govt	Nursing
112	Government College of Nursing	Indore	Govt	Nursing
113	Government College of Nursing	Jabalpur	Govt	Nursing
114	Government College of Nursing	Gwalior	Govt	Nursing
115	Government College of Nursing	Rewa	Govt	Nursing
116	Government College of Nursing	Sagar	Govt	Nursing
117	People's College of Dental Sciences	Bhopal	Private	Dental
118	Bhabha College of Dental Sciences	Bhopal	Private	Dental
119	Mansarovar Dental College	Bhopal	Private	Dental
120	Rishiraj College of Dental Sciences	Bhopal	Private	Dental
121	Hitkarini Dental College	Jabalpur	Private	Dental
122	College of Dental Sciences	Rau/Indore	Private	Dental
123	Modern Dental College & Research Centre	Indore	Private	Dental
124	Sri Aurobindo College of Dentistry	Indore	Private	Dental
125	People's College of Pharmacy	Bhopal	Private	Pharmacy
126	Bansal College of Pharmacy	Bhopal	Private	Pharmacy
127	LNCT College of Pharmacy	Bhopal	Private	Pharmacy
128	Oriental College of Pharmacy	Bhopal	Private	Pharmacy
129	RKDF College of Pharmacy	Bhopal	Private	Pharmacy
130	Sagar Institute of Pharmaceutical Sciences	Sagar	Private	Pharmacy
131	IPS Academy College of Pharmacy	Indore	Private	Pharmacy
132	Acropolis Institute of Pharmaceutical Education	Indore	Private	Pharmacy
133	Shri Govindram Seksaria Institute of Technology & Science	Indore	Govt	Engineering
134	Institute of Engineering & Technology, DAVV	Indore	Govt	Engineering
135	University Institute of Technology, RGPV	Bhopal	Govt	Engineering
136	University Institute of Technology, RGPV	Jabalpur	Govt	Engineering
137	University Institute of Technology, RGPV	Shivpuri	Govt	Engineering
138	University Institute of Technology, RGPV	Satna	Govt	Engineering
139	University Institute of Technology, RGPV	Gwalior	Govt	Engineering
140	University Institute of Technology, Barkatullah University	Bhopal	Govt	Engineering
141	Ujjain Engineering College	Ujjain	Govt	Engineering
142	Rewa Engineering College	Rewa	Govt	Engineering
143	Jabalpur Engineering College	Jabalpur	Govt	Engineering
144	Madhav Institute of Technology & Science	Gwalior	Govt	Engineering
145	Mahakal Institute of Technology	Ujjain	Private	Engineering
146	Rustamji Institute of Technology	Gwalior	Private	Engineering
147	Institute of Engineering & Technology, DAVV	Indore	Govt	Engineering
148	IPS Academy Institute of Engineering & Science	Indore	Private	Engineering
149	Acropolis Institute of Technology & Research	Indore	Private	Engineering
150	Sri Aurobindo Institute of Technology	Indore	Private	Engineering
151	Oriental College of Technology	Bhopal	Private	Engineering
152	Bansal Institute of Science & Technology	Bhopal	Private	Engineering
153	Sagar Institute of Research & Technology	Bhopal	Private	Engineering
154	Sagar Institute of Science & Technology	Bhopal	Private	Engineering
155	Technocrats Institute of Technology	Bhopal	Private	Engineering
156	Technocrats Institute of Technology – Excellence	Bhopal	Private	Engineering
157	IES College of Technology	Bhopal	Private	Engineering
158	Lakshmi Narain College of Technology	Bhopal	Private	Engineering
159	Lakshmi Narain College of Technology & Science	Bhopal	Private	Engineering
160	Patel College of Science & Technology	Bhopal	Private	Engineering
161	Truba Institute of Engineering & Information Technology	Bhopal	Private	Engineering
162	BIST, Bhopal	Bhopal	Private	Engineering
163	SISTec	Bhopal	Private	Engineering
164	SISTec-R	Bhopal	Private	Engineering
165	TIT College	Bhopal	Private	Engineering
166	NRI Institute of Information Science & Technology	Bhopal	Private	Engineering
167	LNCT & Research Centre	Indore	Private	Engineering
168	Chameli Devi Group of Institutions	Indore	Private	Engineering
169	Malwa Institute of Technology	Indore	Private	Engineering
170	SVITS	Indore	Private	Engineering
171	Medi-Caps Institute of Technology & Management	Indore	Private	Engineering
172	IPS Academy Institute of Pharmacy	Indore	Private	Pharmacy
173	Sushila Devi Bansal College of Technology	Indore	Private	Engineering
174	Indore Institute of Science & Technology	Indore	Private	Engineering
175	BM College of Technology	Indore	Private	Engineering
176	Oriental Institute of Science & Technology	Bhopal	Private	Engineering
177	Bhabha Engineering Research Institute	Bhopal	Private	Engineering
178	Millennium Institute of Technology & Science	Bhopal	Private	Engineering
179	VNS Group of Institutions	Bhopal	Private	Engineering
180	Corporate Institute of Science & Technology	Bhopal	Private	Engineering
181	Jagran University	Bhopal	Private	University
182	SAGE University	Bhopal	Private	University
183	SAGE University	Indore	Private	University
184	Jagran Lakecity University	Bhopal	Private	University
185	LNCT University	Bhopal	Private	University
186	People’s University	Bhopal	Private	University
187	Sarvepalli Radhakrishnan University	Bhopal	Private	University
188	RKDF University	Bhopal	Private	University
189	Mansarovar Global University	Sehore	Private	University
190	Rabindranath Tagore University	Raisen	Private	University
191	Renaissance University	Indore	Private	University
192	Oriental University	Indore	Private	University
193	Medi-Caps University	Indore	Private	University
194	SVKM's NMIMS Indore Campus	Indore	Private	Management
195	Symbiosis University of Applied Sciences	Indore	Private	University
196	ITM University	Gwalior	Private	University
197	Amity University	Gwalior	Private	University
198	ITM University	Raipur/MP region*	Private	University
199	Jagran Social Welfare University	Bhopal	Private	University
200	Sri Satya Sai University of Medical Sciences & Technology	Sehore	Private	University`;

const rawPart3 = `201	Pt. Khushilal Sharma Govt. Ayurveda College	Bhopal	Govt	BAMS
202	Govt. Ayurvedic College	Gwalior	Govt	BAMS
203	Govt. Ayurveda College	Indore	Govt	BAMS
204	Govt. Ayurveda College	Jabalpur	Govt	BAMS
205	Rani Dullaiya Smriti Ayurved PG College	Bhopal	Private	BAMS
206	L.N. Ayurvedic College & Hospital	Bhopal	Private	BAMS
207	Vaidya Yagya Dutt Sharma Ayurved Mahavidyalaya	Bhopal	Private	BAMS
208	Mahamaya Ayurvedic Medical College	Balaghat	Private	BAMS
209	Mansarovar Ayurvedic Medical College	Bhopal	Private	BAMS
210	Sri Sai Institute of Ayurvedic Research & Medicine	Bhopal	Private	BAMS
211	Ram Krishna College of Ayurveda	Bhopal	Private	BAMS
212	Sardar Patel Ayurvedic Medical College	Balaghat	Private	BAMS
213	Government Homeopathic Medical College	Bhopal	Govt	BHMS
214	Government Homeopathic Medical College	Indore	Govt	BHMS
215	Government Homeopathic Medical College	Jabalpur	Govt	BHMS
216	R.K.D.F. Homoeopathic Medical College	Bhopal	Private	BHMS
217	Smt. Kamlaben Raheja Homeopathic Medical College	Bhopal	Private	BHMS
218	Bakson Homeopathic Medical College	MP	Private	BHMS
219	Chandramukhi Homeopathic Medical College	Indore	Private	BHMS
220	Homeopathic Medical College & Hospital	Bhopal	Private	BHMS
221	Government Unani Medical College	Bhopal	Govt	BUMS
222	Government Unani Medical College	Burhanpur	Govt	BUMS
223	Unani Medical College & Hospital	Bhopal	Private	BUMS
224	Government College of Nursing	Bhopal	Govt	B.Sc Nursing
225	Government College of Nursing	Indore	Govt	B.Sc Nursing
226	Government College of Nursing	Jabalpur	Govt	B.Sc Nursing
227	Government College of Nursing	Gwalior	Govt	B.Sc Nursing
228	Government College of Nursing	Rewa	Govt	B.Sc Nursing
229	Government College of Nursing	Sagar	Govt	B.Sc Nursing
230	Government College of Nursing	Ujjain	Govt	B.Sc Nursing
231	AIIMS Bhopal College of Nursing	Bhopal	Govt	B.Sc Nursing
232	People's College of Nursing	Bhopal	Private	Nursing
233	LNCT College of Nursing	Bhopal	Private	Nursing
234	Chirayu College of Nursing	Bhopal	Private	Nursing
235	RKDF College of Nursing	Bhopal	Private	Nursing
236	Bansal College of Nursing	Bhopal	Private	Nursing
237	Mansarovar College of Nursing	Bhopal	Private	Nursing
238	SAGE College of Nursing	Bhopal	Private	Nursing
239	Career College of Nursing	Bhopal	Private	Nursing
240	Sri Aurobindo College of Nursing	Indore	Private	Nursing
241	Index College of Nursing	Indore	Private	Nursing
242	Amaltas College of Nursing	Dewas	Private	Nursing
243	Gyan Ganga College of Nursing	Jabalpur	Private	Nursing
244	Hitkarini College of Nursing Sciences	Jabalpur	Private	Nursing
245	ITM College of Nursing	Gwalior	Private	Nursing
246	BMLT Institute/College	Bhopal	Private	Allied Health
247	People’s College of Paramedical Sciences	Bhopal	Private	Paramedical
248	LNCT College of Paramedical Sciences	Bhopal	Private	Paramedical
249	Chirayu Institute of Medical Sciences	Bhopal	Private	Allied Health
250	Index Institute of Paramedical Sciences	Indore	Private	Paramedical
251	Sri Aurobindo Institute of Paramedical Sciences	Indore	Private	Paramedical
252	Government College of Physiotherapy	Jabalpur	Govt	BPT
253	Government College of Physiotherapy	Bhopal	Govt	BPT
254	People's College of Physiotherapy	Bhopal	Private	BPT
255	LNCT College of Physiotherapy	Bhopal	Private	BPT
256	RKDF College of Physiotherapy	Bhopal	Private	BPT
257	Chirayu College of Physiotherapy	Bhopal	Private	BPT
258	Sri Aurobindo College of Physiotherapy	Indore	Private	BPT
259	Index College of Physiotherapy	Indore	Private	BPT
260	Amaltas College of Physiotherapy	Dewas	Private	BPT
261	People's College of Medical Laboratory Technology	Bhopal	Private	BMLT
262	LNCT College of Medical Laboratory Technology	Bhopal	Private	BMLT
263	Chirayu College of Medical Laboratory Technology	Bhopal	Private	BMLT
264	RKDF College of Medical Laboratory Technology	Bhopal	Private	BMLT
265	Index College of Medical Laboratory Technology	Indore	Private	BMLT
266	Sri Aurobindo College of Medical Laboratory Technology	Indore	Private	BMLT
267	People's College of Radiology	Bhopal	Private	Radiology
268	LNCT College of Radiology	Bhopal	Private	Radiology
269	Chirayu College of Radiology	Bhopal	Private	Radiology
270	Index College of Radiology	Indore	Private	Radiology
271	People's College of Optometry	Bhopal	Private	Optometry
272	LNCT College of Optometry	Bhopal	Private	Optometry
273	Sri Aurobindo College of Optometry	Indore	Private	Optometry
274	Government College of Agriculture	Jabalpur	Govt	Agriculture
275	College of Agriculture, JNKVV	Jabalpur	Govt	Agriculture
276	College of Agriculture, RVSKVV	Gwalior	Govt	Agriculture
277	College of Agriculture	Indore	Govt	Agriculture
278	College of Agriculture	Rewa	Govt	Agriculture
279	College of Agriculture	Sehore	Govt	Agriculture
280	College of Horticulture	Mandsaur	Govt	Horticulture
281	College of Horticulture	Rewa	Govt	Horticulture
282	College of Forestry	Jabalpur	Govt	Forestry
283	College of Veterinary Science & Animal Husbandry	Jabalpur	Govt	Veterinary
284	College of Veterinary Science & Animal Husbandry	Mhow	Govt	Veterinary
285	College of Veterinary Science & Animal Husbandry	Rewa	Govt	Veterinary
286	College of Fisheries	Jabalpur	Govt	Fisheries
287	Jawaharlal Nehru Krishi Vishwavidyalaya	Jabalpur	Govt	Agriculture
288	Rajmata Vijayaraje Scindia Krishi Vishwa Vidyalaya	Gwalior	Govt	Agriculture
289	College of Agriculture	Khandwa	Govt	Agriculture
290	College of Agriculture	Tikamgarh	Govt	Agriculture
291	College of Agriculture	Khargone	Govt	Agriculture
292	College of Agriculture	Balaghat	Govt	Agriculture
293	College of Agriculture	Shivpuri	Govt	Agriculture
294	College of Agriculture	Mandsaur	Govt	Agriculture
295	College of Agriculture	Chhindwara	Govt	Agriculture
296	College of Agriculture	Vidisha	Govt	Agriculture
297	College of Agriculture	Sagar	Govt	Agriculture
298	College of Agriculture	Ujjain	Govt	Agriculture
299	College of Agriculture	Damoh	Govt	Agriculture
300	College of Agriculture	Betul	Govt	Agriculture`;

const rawPart4 = `301	Bhopal School of Social Sciences (BSSS)	Bhopal	Private	B.Com, BBA, BA
302	Institute for Excellence in Higher Education (IEHE)	Bhopal	Govt	BA, BSc, BCom
303	Career College	Bhopal	Private	BCom, BSc, BA, BBA
304	Sarojini Naidu Govt. Girls PG College	Bhopal	Govt	Arts, Science, Commerce
305	Government Hamidia Arts & Commerce College	Bhopal	Govt	Arts, Commerce
306	Government MVM College	Bhopal	Govt	Science, Commerce
307	Government Motilal Vigyan Mahavidyalaya	Bhopal	Govt	Science
308	Govt. Geetanjali Girls P.G. College	Bhopal	Govt	Arts, Science, Commerce
309	Govt. Benazeer College	Bhopal	Govt	Arts, Commerce
310	Government College, BHEL	Bhopal	Govt	UG, PG
311	The Bhopal School of Social Sciences	Bhopal	Private	Management, Commerce
312	Sarvepalli Radhakrishnan University	Bhopal	Private	UG, PG, Professional
313	Jagran Lakecity University	Bhopal	Private	Management, Law, Media
314	Jagran University	Bhopal	Private	Management, Commerce
315	Rabindranath Tagore University	Raisen	Private	Engineering, Management, UG/PG
316	Barkatullah University Institute of Technology	Bhopal	Govt	Engineering
317	Barkatullah University	Bhopal	Govt	UG, PG, PhD
318	Makhanlal Chaturvedi National University of Journalism & Communication	Bhopal	Govt	Journalism, Media, IT
319	National Law Institute University	Bhopal	Govt	BA LLB, LLM, PhD
320	Madhya Pradesh Bhoj Open University	Bhopal	Govt	UG, PG, Distance
321	National Forensic Sciences University, Bhopal Campus	Bhopal	Govt	Forensic Science
322	National Law University	Bhopal	Govt	Law
323	Govt. Maharani Laxmi Bai Girls P.G. College	Gwalior	Govt	Arts, Commerce
324	Govt. Kamla Raja Girls P.G. College	Gwalior	Govt	Arts, Science, Commerce
325	Maharani Laxmi Bai Arts & Commerce College	Gwalior	Govt	Arts, Commerce
326	Jiwaji University	Gwalior	Govt	UG, PG, PhD
327	Institute of Information Technology & Management	Gwalior	Private	IT, Management
328	Prestige Institute of Management	Gwalior	Private	MBA, BBA, BCA
329	Amity University Madhya Pradesh	Gwalior	Private	Engineering, Management, Law
330	ITM University	Gwalior	Private	Engineering, Management
331	Government Science College	Jabalpur	Govt	BSc, MSc
332	Government Mahakoshal Arts & Commerce College	Jabalpur	Govt	BA, BCom
333	St. Aloysius College	Jabalpur	Private	Arts, Science, Commerce
334	Hitkarini College of Engineering & Technology	Jabalpur	Private	Engineering
335	Gyan Ganga College	Jabalpur	Private	Engineering, Management
336	Takshshila Institute of Engineering & Technology	Jabalpur	Private	Engineering
337	Global Engineering & Management College	Jabalpur	Private	Engineering
338	Gyan Ganga Institute of Technology & Sciences	Jabalpur	Private	Engineering
339	Rani Durgavati University	Jabalpur	Govt	UG, PG, PhD
340	Government Science College	Jabalpur	Govt	Science
341	Holkar Science College	Indore	Govt	BSc, MSc
342	Govt. Maharani Laxmi Bai Girls P.G. College	Indore	Govt	Arts, Commerce
343	Govt. New Science College	Indore	Govt	Science
344	Govt. Arts & Commerce College	Indore	Govt	Arts, Commerce
345	Christian Eminent College	Indore	Private	UG, PG
346	BSSS/Commerce Institute	Indore	Private	Commerce, Management
347	Prestige Institute of Management & Research	Indore	Private	MBA, BBA, BCA
348	IPS Academy	Indore	Private	UG, PG, Professional
349	Renaissance University	Indore	Private	Management, Law, Commerce
350	SAGE University	Indore	Private	Engineering, Management
351	Medicaps University	Indore	Private	Engineering, Management
352	Oriental University	Indore	Private	Engineering, Management, Law
353	Symbiosis University of Applied Sciences	Indore	Private	Management, Technology
354	SVKM's NMIMS Indore Campus	Indore	Private	Management
355	Devi Ahilya Vishwavidyalaya	Indore	Govt	UG, PG, Engineering
356	Institute of Management Studies, DAVV	Indore	Govt	MBA
357	International Institute of Professional Studies	Indore	Govt	Management, IT
358	School of Law, DAVV	Indore	Govt	Law
359	School of Computer Science, DAVV	Indore	Govt	Computer Science
360	School of Commerce, DAVV	Indore	Govt	Commerce
361	Vikram University	Ujjain	Govt	UG, PG, PhD
362	Madhav Science College	Ujjain	Govt	Science
363	Govt. Girls P.G. College	Ujjain	Govt	Arts, Science
364	Govt. Kalidas Girls College	Ujjain	Govt	UG, PG
365	Govt. Madhav College	Ujjain	Govt	Arts, Commerce
366	Mahakal Institute of Technology	Ujjain	Private	Engineering
367	Vikrant Institute of Technology & Management	Indore	Private	Engineering
368	Govt. Autonomous College	Satna	Govt	UG, PG
369	Govt. P.G. College	Rewa	Govt	Arts, Science, Commerce
370	Govt. Thakur Ranmat Singh College	Rewa	Govt	UG, PG
371	Awadhesh Pratap Singh University	Rewa	Govt	UG, PG, PhD
372	Govt. P.G. College	Satna	Govt	UG, PG
373	Govt. P.G. College	Sagar	Govt	UG, PG
374	Dr. Harisingh Gour Vishwavidyalaya	Sagar	Central	UG, PG, PhD
375	Govt. Girls Degree College	Sagar	Govt	Arts, Science
376	Bundelkhand Medical College	Sagar	Govt	Medical
377	Dr. Hari Singh Gour University – Law Department	Sagar	Central	Law
378	Govt. Autonomous College	Sagar	Govt	UG, PG
379	Govt. Degree College	Vidisha	Govt	UG, PG
380	Samrat Ashok Technological Institute	Vidisha	Govt	Engineering
381	Govt. P.G. College	Chhindwara	Govt	UG, PG
382	Govt. College	Betul	Govt	UG, PG
383	Govt. P.G. College	Hoshangabad/Narmadapuram	Govt	UG, PG
384	Govt. Girls College	Narmadapuram	Govt	UG, PG
385	Govt. P.G. College	Sehore	Govt	UG, PG
386	Govt. College	Raisen	Govt	UG, PG
387	Rabindranath Tagore University	Raisen	Private	UG, PG
388	Govt. P.G. College	Dewas	Govt	UG, PG
389	Govt. College	Mandsaur	Govt	UG, PG
390	Govt. P.G. College	Neemuch	Govt	UG, PG
391	Govt. College	Ratlam	Govt	UG, PG
392	Govt. Arts & Commerce College	Ratlam	Govt	Arts, Commerce
393	Govt. College	Dhar	Govt	UG, PG
394	Govt. College	Khargone	Govt	UG, PG
395	Govt. College	Khandwa	Govt	UG, PG
396	Govt. College	Burhanpur	Govt	UG, PG
397	Govt. College	Shivpuri	Govt	UG, PG
398	Govt. College	Morena	Govt	UG, PG
399	Govt. College	Bhind	Govt	UG, PG
400	Govt. College	Datia	Govt	UG, PG`;

const rawPart5 = `401	Govt. P.G. College	Morena	Govt	UG/PG
402	Govt. P.G. College	Bhind	Govt	UG/PG
403	Govt. P.G. College	Datia	Govt	UG/PG
404	Govt. P.G. College	Shivpuri	Govt	UG/PG
405	Govt. P.G. College	Guna	Govt	UG/PG
406	Govt. P.G. College	Ashoknagar	Govt	UG/PG
407	Govt. P.G. College	Sheopur	Govt	UG/PG
408	Govt. P.G. College	Vidisha	Govt	UG/PG
409	Govt. P.G. College	Raisen	Govt	UG/PG
410	Govt. P.G. College	Sehore	Govt	UG/PG
411	Govt. P.G. College	Narsinghpur	Govt	UG/PG
412	Govt. P.G. College	Mandla	Govt	UG/PG
413	Govt. P.G. College	Dindori	Govt	UG/PG
414	Govt. P.G. College	Balaghat	Govt	UG/PG
415	Govt. P.G. College	Seoni	Govt	UG/PG
416	Govt. P.G. College	Chhindwara	Govt	UG/PG
417	Govt. P.G. College	Betul	Govt	UG/PG
418	Govt. P.G. College	Harda	Govt	UG/PG
419	Govt. P.G. College	Khandwa	Govt	UG/PG
420	Govt. P.G. College	Burhanpur	Govt	UG/PG
421	Govt. P.G. College	Khargone	Govt	UG/PG
422	Govt. P.G. College	Barwani	Govt	UG/PG
423	Govt. P.G. College	Dhar	Govt	UG/PG
424	Govt. P.G. College	Jhabua	Govt	UG/PG
425	Govt. P.G. College	Alirajpur	Govt	UG/PG
426	Govt. P.G. College	Ratlam	Govt	UG/PG
427	Govt. P.G. College	Mandsaur	Govt	UG/PG
428	Govt. P.G. College	Neemuch	Govt	UG/PG
429	Govt. P.G. College	Shajapur	Govt	UG/PG
430	Govt. P.G. College	Agar Malwa	Govt	UG/PG
431	Govt. P.G. College	Dewas	Govt	UG/PG
432	Govt. P.G. College	Ujjain	Govt	UG/PG
433	Govt. P.G. College	Indore	Govt	UG/PG
434	Govt. P.G. College	Jabalpur	Govt	UG/PG
435	Govt. P.G. College	Sagar	Govt	UG/PG
436	Govt. P.G. College	Damoh	Govt	UG/PG
437	Govt. P.G. College	Panna	Govt	UG/PG
438	Govt. P.G. College	Chhatarpur	Govt	UG/PG
439	Govt. P.G. College	Tikamgarh	Govt	UG/PG
440	Govt. P.G. College	Niwari	Govt	UG/PG
441	Govt. P.G. College	Rewa	Govt	UG/PG
442	Govt. P.G. College	Satna	Govt	UG/PG
443	Govt. P.G. College	Sidhi	Govt	UG/PG
444	Govt. P.G. College	Singrauli	Govt	UG/PG
445	Govt. P.G. College	Shahdol	Govt	UG/PG
446	Govt. P.G. College	Umaria	Govt	UG/PG
447	Govt. P.G. College	Anuppur	Govt	UG/PG
448	Govt. P.G. College	Katni	Govt	UG/PG
449	Govt. P.G. College	Panna	Govt	UG/PG
450	Govt. P.G. College	Damoh	Govt	UG/PG
451	Renaissance University	Indore	Private	UG/PG
452	SAGE University	Bhopal	Private	UG/PG
453	SAGE University	Indore	Private	UG/PG
454	Rabindranath Tagore University	Raisen	Private	UG/PG
455	Mansarovar Global University	Sehore	Private	UG/PG
456	RKDF University	Bhopal	Private	UG/PG
457	People's University	Bhopal	Private	Medical/UG/PG
458	LNCT University	Bhopal	Private	Professional
459	Jagran Lakecity University	Bhopal	Private	Management/Law/Media
460	Oriental University	Indore	Private	Engineering/Management
461	Medicaps University	Indore	Private	Engineering/Management
462	ITM University	Gwalior	Private	Engineering/Management
463	Amity University Madhya Pradesh	Gwalior	Private	Engineering/Management
464	Symbiosis University of Applied Sciences	Indore	Private	Applied Sciences/Management
465	Sri Satya Sai University	Sehore	Private	Engineering/Management
466	Career College	Bhopal	Private	UG/PG
467	BSSS	Bhopal	Private	Commerce/Management
468	St. Aloysius College	Jabalpur	Private	Arts/Science/Commerce
469	Christian Eminent College	Indore	Private	UG/PG
470	Pioneer Institute of Professional Studies	Indore	Private	Management/Commerce
471	St. Paul Institute of Professional Studies	Indore	Private	Commerce/Management
472	Indore Institute of Law	Indore	Private	Law
473	Jagran Institute of Management	Bhopal	Private	Management
474	LNCT College of Management	Bhopal	Private	Management
475	SIRT College	Bhopal	Private	Engineering
476	Sagar Institute of Research & Technology	Bhopal	Private	Engineering
477	Bansal Institute of Science & Technology	Bhopal	Private	Engineering
478	Oriental College of Technology	Bhopal	Private	Engineering
479	Truba Institute of Engineering & Information Technology	Bhopal	Private	Engineering
480	VNS Group of Institutions	Bhopal	Private	Engineering/Management
481	Millennium Institute of Technology & Science	Bhopal	Private	Engineering
482	NRI Institute of Information Science & Technology	Bhopal	Private	Engineering
483	IES College of Technology	Bhopal	Private	Engineering
484	Patel College of Science & Technology	Bhopal	Private	Engineering
485	TIT College	Bhopal	Private	Engineering
486	Technocrats Institute of Technology	Bhopal	Private	Engineering
487	Gyan Ganga Institute of Technology & Sciences	Jabalpur	Private	Engineering
488	Hitkarini College of Engineering & Technology	Jabalpur	Private	Engineering
489	Takshshila Institute of Engineering & Technology	Jabalpur	Private	Engineering
490	Global Engineering & Management College	Jabalpur	Private	Engineering
491	Rustamji Institute of Technology	Gwalior	Private	Engineering
492	Mahakal Institute of Technology	Ujjain	Private	Engineering
493	Acropolis Institute of Technology & Research	Indore	Private	Engineering
494	Sri Aurobindo Institute of Technology	Indore	Private	Engineering
495	Malwa Institute of Technology	Indore	Private	Engineering
496	Chameli Devi Group of Institutions	Indore	Private	Engineering
497	SVITS	Indore	Private	Engineering
498	Sushila Devi Bansal College of Technology	Indore	Private	Engineering
499	Indore Institute of Science & Technology	Indore	Private	Engineering
500	BM College of Technology	Indore	Private	Engineering`;

function inferStream(name, area) {
  if (area && area.trim()) return area.trim();
  const n = name.toLowerCase();
  if (n.includes('medical') || n.includes('aiims') || n.includes('mgm') || n.includes('gmc')) return 'Medical';
  if (n.includes('dental')) return 'Dental';
  if (n.includes('ayurved') || n.includes('bams')) return 'BAMS';
  if (n.includes('homeopath') || n.includes('bhms')) return 'BHMS';
  if (n.includes('unani') || n.includes('bums')) return 'BUMS';
  if (n.includes('nursing')) return 'Nursing';
  if (n.includes('pharmacy')) return 'Pharmacy';
  if (n.includes('physiotherapy') || n.includes('bpt')) return 'BPT';
  if (n.includes('laboratory') || n.includes('bmlt')) return 'BMLT';
  if (n.includes('radiology')) return 'Radiology';
  if (n.includes('optometry')) return 'Optometry';
  if (n.includes('paramedical') || n.includes('allied')) return 'Paramedical';
  if (n.includes('agriculture') || n.includes('horticulture') || n.includes('forestry') || n.includes('krishi')) return 'Agriculture';
  if (n.includes('veterinary') || n.includes('animal husbandry') || n.includes('fisheries')) return 'Veterinary';
  if (n.includes('technology') || n.includes('engineering') || n.includes('iit') || n.includes('iiit') || n.includes('manit') || n.includes('sgsits') || n.includes('rgpv') || n.includes('tit') || n.includes('lnct') || n.includes('sistec')) return 'Engineering';
  if (n.includes('law')) return 'Law';
  if (n.includes('commerce') || n.includes('economics')) return 'Commerce';
  if (n.includes('management') || n.includes('business')) return 'Management';
  if (n.includes('science')) return 'Science';
  if (n.includes('university') || n.includes('vishwavidyalaya')) return 'University';
  return 'General Higher Education';
}

function parseRaw(rawStr, partNum) {
  const lines = rawStr.trim().split('\n');
  const result = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split('\t').map(p => p.trim());
    if (parts.length >= 3) {
      const rank = parseInt(parts[0], 10);
      const name = parts[1];
      const city = parts[2];
      const type = parts[3] || 'Govt';
      const area = parts[4] || '';
      const stream = inferStream(name, area);

      // Eligibility and Admission Mode heuristic
      let admissionThrough = 'MP State Merit / MPOnline';
      let eligibility = '10+2 with 50%';
      let estFee = '₹2,000 - ₹25,000/yr (Govt Regulated)';

      const streamLower = stream.toLowerCase();
      if (streamLower.includes('medical') || streamLower.includes('mbbs')) {
        admissionThrough = 'NEET UG (MP DME 85% + MCC 15% AIQ)';
        eligibility = 'NEET UG Qualified (Physics, Chem, Bio >= 50%)';
        estFee = type === 'Govt' ? '₹1,14,000/yr (100% MMVY Waiver eligible)' : '₹9,50,000 - ₹14,00,000/yr';
      } else if (streamLower.includes('dental') || streamLower.includes('bds')) {
        admissionThrough = 'NEET UG Counselling (MP DME)';
        eligibility = 'NEET Qualified with PCB';
        estFee = type === 'Govt' ? '₹60,000/yr' : '₹2,50,000 - ₹3,50,000/yr';
      } else if (streamLower.includes('bams') || streamLower.includes('ayurved') || streamLower.includes('bhms') || streamLower.includes('bums')) {
        admissionThrough = 'NEET UG (MP AYUSH Counselling)';
        eligibility = 'NEET UG Qualified';
        estFee = type === 'Govt' ? '₹40,000/yr' : '₹1,80,000 - ₹2,80,000/yr';
      } else if (streamLower.includes('nursing')) {
        admissionThrough = 'PNST / MP PNST / State Merit (MP Nursing Council)';
        eligibility = '10+2 with PCB >= 45%';
        estFee = type === 'Govt' ? '₹25,000/yr' : '₹70,000 - ₹1,10,000/yr';
      } else if (streamLower.includes('engineering') || name.includes('IIT') || name.includes('MANIT') || name.includes('SGSITS')) {
        admissionThrough = (name.includes('IIT') ? 'JEE Advanced' : (name.includes('MANIT') ? 'JEE Main (CSAB/JoSAA)' : 'JEE Main / 12th Merit (MP DTE Counselling)'));
        eligibility = '10+2 with PCM >= 45-75%';
        estFee = type === 'Govt' ? '₹45,000 - ₹1,20,000/yr' : '₹75,000 - ₹1,40,000/yr';
      } else if (streamLower.includes('pharmacy')) {
        admissionThrough = 'MP DTE Pharmacy Counselling / GPAT';
        eligibility = '10+2 with PCM/PCB';
        estFee = '₹50,000 - ₹90,000/yr';
      } else if (streamLower.includes('agriculture') || streamLower.includes('veterinary')) {
        admissionThrough = 'MP PAT (Pre-Agriculture Test) / PV&FT (Veterinary)';
        eligibility = '10+2 Agriculture / PCB/PCM';
        estFee = '₹20,000 - ₹45,000/yr';
      } else if (streamLower.includes('law')) {
        admissionThrough = name.includes('National Law') ? 'CLAT Examination' : 'State Law Entrance / Merit';
        eligibility = '10+2 or Graduation';
        estFee = '₹30,000 - ₹1,80,000/yr';
      }

      result.push({
        rank,
        id: 'mp-col-' + rank,
        name,
        city,
        state: 'Madhya Pradesh',
        type,
        stream,
        part: partNum,
        admissionThrough,
        eligibility,
        estFee,
        scholarshipEligible: 'MP MMVY (100% Tuition Waiver) / Post-Matric SC/ST/OBC'
      });
    }
  }
  return result;
}

const all500 = [
  ...parseRaw(rawPart1, 1),
  ...parseRaw(rawPart2, 2),
  ...parseRaw(rawPart3, 3),
  ...parseRaw(rawPart4, 4),
  ...parseRaw(rawPart5, 5)
];

console.log('Total Parsed MP Colleges:', all500.length);

// Write to server data
const outDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'mp_colleges_500.json'), JSON.stringify(all500, null, 2), 'utf-8');

// Write client-side JS file
const clientJsPath = path.join(__dirname, '..', '..', 'js', 'mp_colleges_data.js');
const jsContent = `/**
 * EDUCATION SATHI - TOP 500 MADHYA PRADESH COLLEGES MASTER DATASET
 * Complete 1 to 500 Colleges across All 55 Districts, Government & Private Institutions,
 * Medical, Engineering, AYUSH, Nursing, Pharmacy, Agriculture, Law, and Degree Colleges.
 */
const MP_TOP_500_COLLEGES = ${JSON.stringify(all500, null, 2)};
`;
fs.writeFileSync(clientJsPath, jsContent, 'utf-8');

console.log('✅ Generated mp_colleges_500.json and js/mp_colleges_data.js successfully!');
