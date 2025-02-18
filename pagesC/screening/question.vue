<template>
	<view>
		<u-navbar title="基因派" :leftIconColor="leftIconColor" :placeholder="true" :border="border">
			<view class="u-nav-slot" slot="left">
				<u-icon name="home" size="20" @click="leftClick"></u-icon>
			</view>
		</u-navbar>
		<view class="screen-content">
			<view class="screen-bg">
				<img class="screen-img" src="https://genepiapi.ypzlfx.com/file/genepi/2024/06/05/question.png" />
			</view>
			<view class="screen-info">
				<view class="screen-card" v-if="index == curr && !result" v-for="(item, index) in question">
					<view class="screen-title">{{ item.title }}</view>
					<view class="screen-item" v-for="(items, indexs) in item.content">
						<view class="screen-key">{{ items.name }}</view>
						<view class="screen-value">
							<u-radio-group v-model="items.value" placement="row" :size="22">
								<u-radio v-for="(item2, index2) in items.radio" :label="item2.name" :name="item2.value"></u-radio>
							</u-radio-group>
						</view>
					</view>
				</view>

				<view class="screen-result" v-if="result">
					<swiper class="swiper" circular>
						<swiper-item>
							<view class="swiper-item hidden">
								<view class="screen-result-title">您属于：{{ maxObj.name }}体质</view>
								<view class="screen-result-sub-title speical-title">
									<view class="left-arr">
										<u-icon name="arrow-left-double"></u-icon>
									</view>
									左右滑动查看各体质详细说明
									<view class="right-arr">
										<u-icon style="margin-left: 15px" name="arrow-right-double"></u-icon>
									</view>
								</view>
								<l-echart style="position: relative; top: -30px" ref="chart1"></l-echart>
							</view>
						</swiper-item>

						<swiper-item>
							<view class="swiper-item">
								<view class="screen-result-title">平和质体质</view>

								<view class="screen-result-sub-title">
									平和质是指先天禀赋良好，后天调养得当，以体态适中、面色红润、精力充沛、脏腑功能状态强健壮实为主要特征的一种体质状态。
								</view>
								<view class="screen-result-desc">基本特征如下:</view>
								<view class="screen-result-desc">①形体特征;体形称健壮。</view>
								<view class="screen-result-desc">②心理特征;性格随和开朗。</view>
								<view class="screen-result-desc">
									③常见表现:面色、肤色润泽，头发需有光泽，目光有神，鼻色明润，嗅觉通利，味觉正常，色红.精力充沛，不易疲劳，耐受寒热，睡眠安和，胃纳良好，二便正常，舌色淡红，苔薄白，脉和有神。
								</view>
								<view class="screen-result-desc">④发病倾向:平素患病较少。</view>
								<view class="screen-result-desc">⑤对外界环境适应能力:对自然环境和社会环境适应能力较强。</view>
								<view class="screen-result-desc">调治方法:平和质者，注意摄生保养，饮食有节，劳逸结台，生活规律，坚持锻炼。</view>
								<view class="screen-result-desc">调治要点:根据人体生长规律，适当进补。</view>
								<view class="screen-result-desc">一是小儿的生长发育时期，食谱当多样化，富有营养，促进其正常生长发育；</view>
								<view class="screen-result-desc">二是更年期，为体质的转变时期，可根据阴阳偏颇酌服补益肾阴肾阻之剂；</view>
								<view class="screen-result-desc">三是人至年老，五脏逐渐虚衰,应适当调补，促其新陈代谢，延缓衰老。</view>
								<view class="screen-result-desc">文献来源：中医体质进展研究-孙理军 2021.05</view>
							</view>
						</swiper-item>

						<swiper-item>
							<view class="swiper-item">
								<view class="screen-result-title">气虚质体质</view>
								<view class="screen-result-sub-title"
									>气虚质是指由于一身之气不足，以气息低弱、脏腑功能状态低下为主要特征的体质状态。</view
								>
								<view class="screen-result-desc">基本特征：</view>
								<view class="screen-result-desc">①形体特征:肌肉松软</view>
								<view class="screen-result-desc">②心理特征:性格内向、情绪不稳定、胆小不喜欢冒险。</view>
								<view class="screen-result-desc">
									③常见表现:主项:平素气短懒言，语音低怯，精神不振，肢体容易疲乏，易出汗，舌淡红、胖嫩、边有齿痕，脉象虚缓。副项:面色萎黄或淡白，目光少神，口淡，唇色少华，毛发不泽，头晕，健忘，大便正常，或虽便秘但不结硬，或大便不成形，便后仍觉未尽，小便正常或偏多。
								</view>
								<view class="screen-result-desc">
									④发病倾向:平素体质虚弱，卫表不固易患感冒;或病后抗病能力弱，易迁延不愈;易患内脏下垂、虚劳等病。
								</view>
								<view class="screen-result-desc">⑤对外界环境适应能</view>
								<view class="screen-result-desc">易患内脏下垂、虚损性疾患或慢性病，虚劳，或病后迁延不愈</view>
								<view class="screen-result-desc">调治方法:培补元气，补气健脾。</view>
								<view class="screen-result-desc">调治要点:</view>
								<view class="screen-result-desc">
									其一，把握剂量，不可峻补:气虚质者使用人参补气强质，注意把握剂量的多少，缓图渐进，或配伍其他方药使用。
								</view>
								<view class="screen-result-desc">
									其二，补气佐以理气:补气调体药易于壅滞气机，若中有湿者要与化痰祛湿药同用，或少佐理气行滞之品。
								</view>
								<view class="screen-result-desc">
									其三，补气须防虚中夹实;气虚质者内脏功能脆弱，常因外邪或内在饮积滞产生内热等虚实夹杂之证。
								</view>
								<view class="screen-result-desc">文献来源：中医体质进展研究-孙理军 2021.05</view>
							</view>
						</swiper-item>

						<swiper-item>
							<view class="swiper-item">
								<view class="screen-result-title">阳虚质体质</view>
								<view class="screen-result-sub-title"
									>阳虚质是指由于阳气不足，失于温煦，以形寒肢冷等虚寒现象为主要特征的体质状态。</view
								>
								<view class="screen-result-desc">基本特征:</view>
								<view class="screen-result-desc">①形体特征:多形体白胖，肌肉松软</view>
								<view class="screen-result-desc">②心理特征:性格多沉静、内向。</view>
								<view class="screen-result-desc">
									③常见表现:主项:平素畏冷，手足不温，喜热饮食，精神不振，睡眠偏多，舌淡胖嫩边有齿痕，苔润，脉象沉迟。副项:面色白，目胞晦暗口唇色淡，毛发易落，易出汗，大便溏薄，小便清长。
								</view>
								<view class="screen-result-desc">④发病倾向:发病多为寒证，或易从寒化，易病痰饮、肿胀、泄泻、阳痿。</view>
								<view class="screen-result-desc">⑤对外界环境适应能力:不耐受寒邪、耐夏不耐冬;易感湿邪。</view>
								<view class="screen-result-desc">易患感冒、咳喘、腹泻、肿胀、阳痿、遗尿、郁证，痰饮、惊悸等。</view>
								<view class="screen-result-desc">调治方法:补肾温阳，益火之源。调理虚质时要慢温、慢补，缓缓调治。</view>
								<view class="screen-result-desc">调治要点:</view>
								<view class="screen-result-desc">
									其一，温阳佐以养阴:根据阴阳互根的理论,在温壮元阳的同时，佐人适量补阴之品，如熟地、山茱萸等，以达阳得阴助而生化无穷;阳虚者，可阳损及阴，导致阴阳两虚，用药要阴阳相顾，切忌温阳太过，耗血伤津，转现燥热。
								</view>
								<view class="screen-result-desc">
									其二，温阳兼顾脾胃:调治阳虚之质，有益气、补火之别，除温壮元阳外，当兼顾脾胃，只有脾胃健运，始能饮食多进，化源不绝，体质强健，亦即养后天以济先天。
								</view>
								<view class="screen-result-desc">文献来源：中医体质进展研究-孙理军 2021.05</view>
							</view>
						</swiper-item>

						<swiper-item>
							<view class="swiper-item">
								<view class="screen-result-title">阴虚质体质</view>
								<view class="screen-result-sub-title"
									>阴虚质是指由于体内津液精血等阴液号少，以阴虚内热等表现为主要特征的体质状态。</view
								>
								<view class="screen-result-desc">基本特征:</view>
								<view class="screen-result-desc">①形体特征:体形瘦长。</view>
								<view class="screen-result-desc">②心理特征:性情急躁，外向好动，活泼。</view>
								<view class="screen-result-desc">
									③常见表现:主项:手足心热平素易口燥咽干，鼻微干，口渴喜冷饮，大便干燥，舌红少津少苔。副项:面色潮红，有烘热感，两目干涩，视物模糊，唇红微干，皮肤偏干，易生皱纹，眩晕耳鸣，睡眠差，小便短，脉象细弦或数。
								</view>
								<view class="screen-result-desc">④发病倾向:平素易患有阴亏燥热的病变，或病后易表现为阴亏症状。</view>
								<view class="screen-result-desc">⑤对外界环境适应能力:平素不耐热邪，耐冬不耐夏;不耐受</view>
								<view class="screen-result-desc">易患多发久咳、肺痨、不寐、噎膈、便秘、消渴、内伤发热等</view>
								<view class="screen-result-desc">
									调治方法:滋补肾阴，壮水制火。常用药物有熟地、山药、山茱萸、丹皮、茯苓、泽泻、桑椹、女贞子等。
								</view>
								<view class="screen-result-desc">调治要点:</view>
								<view class="screen-result-desc">其一，滋阴与清热并用:阴虚生内热，故滋阴应注意与清热法同用，或滋阴润燥同用。</view>
								<view class="screen-result-desc">
									其二，保津即是保血、养血即可生津:由于人体生理、病理上的相互关系，真阴不足，可涉及精、血、津、液的虚亏，因此在调治阴虚的同时，注意结合填精、养血、滋阴的方药。
								</view>
								<view class="screen-result-desc">
									其三，养阴兼顾理气健脾:滋阴药多性柔而腻，久服易伤脾阳，容易引起胃纳呆滞，腹胀腹泻等，可加木香、砂仁、陈皮、鸡内金等理气健脾消导之品。
								</view>
								<view class="screen-result-desc">文献来源：中医体质进展研究-孙理军 2021.05</view>
							</view>
						</swiper-item>

						<swiper-item>
							<view class="swiper-item">
								<view class="screen-result-title">痰湿质体质</view>
								<view class="screen-result-sub-title">
									痰湿质是指由于水液内停而痰湿凝聚，以黏滞重浊为主要特征的体质状态。多因先天遗传，或后天过食肥甘而形成。
								</view>
								<view class="screen-result-desc">基本特征:</view>
								<view class="screen-result-desc">①形体特征;体形肥胖，腹部肥满松软。</view>
								<view class="screen-result-desc">②心理特征;生机偏温和，稳重恭谦，和达，多善于忍耐。</view>
								<view class="screen-result-desc">
									③常见表现:主项面部皮肤油脂较多，多汗且黏，胸闷，痰多。副项:面色责胖而黯，眼胞微浮，容易困倦，平素舌体胖大，舌苔白腻口黏腻或甜，身重不爽，脉滑，喜食肥甘，大便正常或不实小便不多或微混。
								</view>
								<view class="screen-result-desc">④发病倾向:易患消渴、中风、胸痹等证。</view>
								<view class="screen-result-desc">⑤对外界环境适应能力:对梅雨季节及潮湿环境适应能力差，易患湿证。</view>
								<view class="screen-result-desc">易患中满、水肿、瘿瘤、消渴、中风、眩晕、胸痹、咳喘、痛风、痰饮等病证</view>
								<view class="screen-result-desc">调治方法:</view>
								<view class="screen-result-desc">
									①健脾利湿，化痰泻浊。常用药物有党参、白术、茯苓、炙甘草、山药、扁豆、薏苡仁、砂仁、莲子肉、白芥子等。
								</view>
								<view class="screen-result-desc">②痰湿质肥胖者，可加人升清醒脾之荷叶、苍术等;痰浊阻肺者。</view>
								<view class="screen-result-desc">调治要点:</view>
								<view class="screen-result-desc">
									其一，配用温化通阳:湿为阴邪，其性黏滞宜温化通阳，根据病情需要可酌加桂枝、厚朴、干姜以及淫羊藿补骨脂等，但须防温热太过，水液受灼，化热生变。
								</view>
								<view class="screen-result-desc">
									其二，细察瘀互夹:痰湿黏滞，阻遏气机，常致血瘀，形成痰互夹，治宜化痰利湿，兼以活血。
								</view>
								<view class="screen-result-desc">
									其三，少用甜腻:甜腻油脂食物，易于生痰助湿，痰湿质者饮食应以清淡为主。临床上甘酸柔润之药，亦能滞湿生痰，应予慎用。
								</view>
								<view class="screen-result-desc">文献来源：中医体质进展研究-孙理军 2021.05</view>
							</view>
						</swiper-item>

						<swiper-item>
							<view class="swiper-item">
								<view class="screen-result-title">湿热质体质</view>
								<view class="screen-result-sub-title">
									湿热质是指以湿热内蕴为主要特征的体质状态。多因先天禀赋，或久居湿地，喜食肥甘，或长期饮酒，湿热内蕴等因素形成。
								</view>
								<view class="screen-result-desc">基本特征:</view>
								<view class="screen-result-desc">①形体特征:形体偏胖。</view>
								<view class="screen-result-desc">
									②常见表现:主项:平素面垢油光，易生痤疮粉刺，舌质偏红苔黄腻，容易口苦口干，身重困倦。副项:心烦懈息，眼筋红赤，大便结、或黏滞，小便短赤、男易阴囊潮湿，女易带下量多，脉象多见滑数。
								</view>
								<view class="screen-result-desc">③心理特征:性格多急躁易怒。</view>
								<view class="screen-result-desc">④发病倾向;易患疮疳黄疸、火热等病证。</view>
								<view class="screen-result-desc">⑤对外界环境适应能力;对湿环境或气温偏高尤其夏末秋初，湿热交蒸气候较难适应。</view>
								<view class="screen-result-desc">易患疮疖飞黄疸、热淋、衄血。</view>
								<view class="screen-result-desc">调治方法:</view>
								<view class="screen-result-desc">
									分消湿浊，清泄伏火。常用药物有藿香、山栀、石膏、甘草、防风、龙胆草、当归、茵陈、大黄、羌活、苦参、地骨皮、贝母、石斛、茯苓、泽泻等。
								</view>
								<view class="screen-result-desc">热者清之，湿而有热，苦寒之剂燥之。宜</view>
								<view class="screen-result-desc">戒烟限酒,少食辛辣香燥，常食绿豆、冬瓜汤及瓜果蔬菜，保持大小便通调。</view>
								<view class="screen-result-desc">调治要点:</view>
								<view class="screen-result-desc">其一，宣疏化湿以散热:可于泻火解毒之剂加用藿香、防风、茵陈、白等品，宣疏清化。</view>
								<view class="screen-result-desc">
									其二，通利化湿以泄热:根据渗湿于热下之理，在清热化湿同时佐以通利之白茅根、木通、竹叶、煮苡仁，使热从下泄。
								</view>
								<view class="screen-result-desc">文献来源：中医体质进展研究-孙理军 2021.05</view>
							</view>
						</swiper-item>

						<swiper-item>
							<view class="swiper-item">
								<view class="screen-result-title">瘀血质体质</view>
								<view class="screen-result-sub-title">
									瘀血质是指体内有血液运行不畅的潜在倾向或瘀血内阻的病理基础，以血瘀表现为主要特征的体质状态。形成因素有:先天禀赋，或后天损伤，忧郁气滞，久病人络等。
								</view>
								<view class="screen-result-desc">基本特征:</view>
								<view class="screen-result-desc">①形体特征:瘦人居多。</view>
								<view class="screen-result-desc">②心理特征:性格内郁，心情不快易烦，急躁健忘。</view>
								<view class="screen-result-desc">
									③常见表现:主项:平素面色晦暗，皮肤偏黯或色素沉着，容易出现瘀斑，易患疼痛，口唇黯淡或紫，舌质黯有瘀点，或片状斑，舌下静脉曲张，脉象细涩或结代。副项:眼眶黯黑，鼻部黯滞，发易脱落，肌肤干或甲错，女性多见痛经、闭经，或经色紫黑有块、崩漏。
								</view>
								<view class="screen-result-desc">④发病倾向:易患出血、癥痕、中风、胸痹等病。</view>
								<view class="screen-result-desc">⑤对外界环境适</view>
								<view class="screen-result-desc">易患痛证、出血证、瘀血证、癥痕、中风、胸痹等</view>
								<view class="screen-result-desc">调治方法:</view>
								<view class="screen-result-desc">
									①活血祛瘀，疏利通络，疏其血气，令其条达的原则，改善血黑以浊，以使脉道流畅。常用药物有桃仁、红花、生地、赤芍当归、川芎、丹参、茜草、蒲黄、丹参、山楂等。
								</view>
								<view class="screen-result-desc">
									②现代研究认为，大黄虫丸可以改善血液的理化性质，调整凝血及抗凝血系统，防止血栓形成。
								</view>
								<view class="screen-result-desc">调治要点:</view>
								<view class="screen-result-desc">
									其一，养阴以活血:由于津血同源，津枯则血燥，体内津液不足，“干血”内留，亦是瘀與质的成因之一。
								</view>
								<view class="screen-result-desc">
									其二，调气以化察:气滞则血瘀，气行则血畅，故活血调体常配以理气之剂，如机壳、陈皮、柴胡等。
								</view>
								<view class="screen-result-desc">文献来源：中医体质进展研究-孙理军 2021.05</view>
							</view>
						</swiper-item>

						<swiper-item>
							<view class="swiper-item">
								<view class="screen-result-title">气郁质体质</view>
								<view class="screen-result-sub-title">
									气郁质是指由于长期情志不畅、气机郁滞而形成的以性格内向不稳定，忧郁脆弱、敏感多疑为主要表现的体质状态。多因先天遗传，或因精神刺激、暴受惊恐、所欲不遂、忧郁思虑等因素形成。
								</view>
								<view class="screen-result-desc">基本特征:</view>
								<view class="screen-result-desc">①形体特征:形体偏瘦。</view>
								<view class="screen-result-desc">②心理特征:性格内向不稳定，忧郁脆弱，敏感多疑。</view>
								<view class="screen-result-desc">
									③常见表现:主项:平素忧郁面貌，神情多烦闷不乐。副项:胸胁胀满，或走窜疼痛，多伴善太息，或气呃逆，或咽间有异物感，或乳房胀痛，睡眠较差，食欲减退，惊悸怔忡，健忘,痰多，大便偏干，小便正常，舌淡红，苔薄白，脉象弦细。
								</view>
								<view class="screen-result-desc">④发病倾向:易患郁证、脏躁、百合病、不寐、梅核气、惊恐等病证。</view>
								<view class="screen-result-desc">⑤对外界环境适应能力:对精神刺激适应能力较差，不喜欢阴雨天气。</view>
								<view class="screen-result-desc">
									易患郁证、脏躁、百合病、梅核气、不寐、胁痛眩晕、胸痹、中风、癜痕病变，常有出血倾向等病。
								</view>
								<view class="screen-result-desc">调治方法:</view>
								<view class="screen-result-desc">
									①疏肝行气，开其郁结。常用药物有柴胡、陈皮、川芎、香附、枳壳、白芍、甘草、当归、薄荷等。
								</view>
								<view class="screen-result-desc">②此外，移情易性，亦是一种调治方法。</view>
								<view class="screen-result-desc">调治要点:</view>
								<view class="screen-result-desc">
									其一，掌握用药法度:理气不宜过燥，以防伤阴;养阴不宜过腻，以防黏滞;用药不宜峻猛，以防伤正。
								</view>
								<view class="screen-result-desc">
									其二,提倡情志相胜:气郁质者情志不畅，必须充分重视精神调节，如语言开导、顺情解郁，或采用情志相胜、移情易性等方法。
								</view>
								<view class="screen-result-desc">文献来源：中医体质进展研究-孙理军 2021.05</view>
							</view>
						</swiper-item>

						<swiper-item>
							<view class="swiper-item">
								<view class="screen-result-title">特禀质体质</view>
								<view class="screen-result-sub-title">
									特禀质是指由于先天禀赋不足和禀赋遗传等因素造成的一种特殊体质。形成因素有先天禀赋不足、遗传等，或环境因素、药物因素等。
								</view>
								<view class="screen-result-desc">基本特征:</view>
								<view class="screen-result-desc">①形体特征:无特殊，或有畸形，或有先天生理缺陷。</view>
								<view class="screen-result-desc">②心理特征:因禀质特异情况而不同。</view>
								<view class="screen-result-desc">
									③常见表现:遗传性疾病有垂直遗传，先天性、家族性特征;胎传性疾病为母体影响胎儿个体生长发育及相关疾病特征。
								</view>
								<view class="screen-result-desc">
									④发病倾向:过敏体质者易药物过敏，易患花粉症;遗传疾病如血友病、先天愚型及中医所称“五迟”“五软”“解颅”等;胎传疾病如胎寒、胎热、胎惊、胎肥、胎痫、胎弱等。
								</view>
								<view class="screen-result-desc">⑤对外界环境适应能力:适应能力差，如过敏体质者对过敏季节适应能力差，易引发宿疾。</view>
								<view class="screen-result-desc">
									易患药物过敏。过敏质者主要是肺气不足，卫表不固，则易致外邪内侵，形成风团、瘾疹、咳喘等。
								</view>
								<view class="screen-result-desc">调治方法:</view>
								<view class="screen-result-desc">
									益气固表，养血消风。常用药物有黄芪、白术、荆芥、防风、蝉蜕、乌梅、益母草、当归、生地黄、黄芩、丹皮等。
								</view>
								<view class="screen-result-desc">调治要点:</view>
								<view class="screen-result-desc">其一，顺应气候:顺应四时变化，以适寒温。</view>
								<view class="screen-result-desc">
									其二，避免接触致敏物质，忌食鱼腥发物:致敏物质如尘螨、花粉、油漆等，应避免接触。
								</view>
								<view class="screen-result-desc">文献来源：中医体质进展研究-孙理军 2021.05</view>
							</view>
						</swiper-item>
					</swiper>

					<!-- <view class="screen-result-description">{{ maxObj.desc }}</view> -->
				</view>

				<view v-if="!result" :class="timeLeft == 0 ? 'submit' : 'disable'" @click="handleNext">
					{{ timeLeft == 0 ? "下一步" : `${timeLeft}秒后可提交` }}
				</view>

				<view v-if="result && !isResult" :class="timeLeft == 0 ? 'submit' : 'disable'" @click="handleSubmit"> 提交 </view>

				<view style="height: 30px"></view>
			</view>
		</view>
	</view>
</template>

<script>
import lEchart from "../components/lime-echart/components/l-echart/l-echart.vue";
import * as echarts from "../components/lime-echart/static/echarts.min.js";
import { getInfo, submitQuestion, check } from "@/api/book.js";
import { getInfoByToken } from "@/api/personalCenter/personalCenter";

export default {
	components: {
		lEchart,
	},
	data() {
		return {
			question: [],
			curr: 0,
			time: 26,
			timeLeft: null,
			result: false,
			resData: null,
			maxObj: null,
			isResult: false,
			trueValue: null,
		};
	},
	onLoad() {
		const isResult = uni.getStorageSync("questionState");
		this.isResult = isResult;
		if (isResult) {
			this.getResult();
		} else {
			this.getData();
		}
	},
	methods: {
		getData() {
			getInfo().then((res) => {
				this.resData = res.data;
				const arr = [];
				for (let i = 0; i < res.data.questionVoList.length; i += 1) {
					arr.push({ title: res.data.questionVoList[i].typeName, content: [] });
					for (let j = 0; j < res.data.questionVoList[i].content.length; j += 1) {
						arr[i].content.push({
							name: res.data.questionVoList[i].content[j].title,
							id: res.data.questionVoList[i].content[j].id,
							value: null,
							radio: res.data.questionVoList[i].content[j].option,
						});
					}
				}
				this.question = arr;
				this.timeInterval();
			});
		},
		getResult() {
			getInfoByToken().then((res) => {
				if (res.code == 200) {
					const pushArr = {
						openId: res.user.openId,
						questionId: "1797445758753525762",
					};
					check(pushArr).then((res) => {
						if (res.code == 200) {
							const question = JSON.parse(res.data.answerContent);
							this.question = question;
							this.showRadar();
						}
					});
				}
			});
		},
		timeInterval() {
			this.timeLeft = this.time;
			const timer = setInterval(() => {
				this.timeLeft--;
				if (this.timeLeft <= 0) {
					clearInterval(timer);
				}
			}, 1000);
		},
		leftClick() {
			uni.reLaunch({
				url: "/pages/index/index",
			});
		},
		checkValues() {
			for (let item of this.question[this.curr].content) {
				if (!item.value) {
					return false; // 如果有任何一个选项的 value 为 null 或 undefined，则返回 false
				}
			}
			return true; // 所有选项的 value 都有值，则返回 true
		},
		handleNext() {
			if (this.timeLeft != 0) {
				return;
			}

			if (!this.checkValues()) {
				uni.showToast({
					title: "请填写完成后进入下一步",
					icon: "none",
				});
				return;
			}

			if (this.curr + 1 < this.question.length) {
				this.curr += 1;
				this.timeInterval();
			} else {
				this.showRadar();
			}
		},
		showRadar() {
			const radarData = [];
			const radaValue = [];
			for (let i = 0; i < this.question.length; i += 1) {
				const name = this.question[i].title.replace(/问卷/g, "");
				radarData.push({ name, max: this.question[i].content.length * 5 });
				let num = 0;
				for (let j = 0; j < this.question[i].content.length; j += 1) {
					num += parseInt(this.question[i].content[j].value);
				}
				radaValue.push(num);
			}

			const trueValue = [];
			for (let i = 0; i < radaValue.length; i += 1) {
				const num = ((radaValue[i] - this.question[i].content.length) / (this.question[i].content.length * 4)) * 100;
				trueValue.push({ num: num.toFixed(2), name: this.question[i].title, desc: this.question[i].title });
			}

			const maxObj = trueValue.reduce((max, obj) => (parseFloat(obj.num) > parseFloat(max.num) ? obj : max));

			maxObj.name = maxObj.name.replace(/问卷/g, "");

			this.trueValue = trueValue;

			this.maxObj = maxObj;

			this.result = true;

			this.$nextTick(function () {
				this.$refs.chart1.init(echarts, (chart) => {
					const option = {
						radar: {
							// shape: 'circle',
							indicator: radarData,
						},
						series: [
							{
								type: "radar",
								data: [
									{
										value: radaValue,
									},
								],
							},
						],
					};

					chart.setOption(option);
				});
			});
		},
		handleSubmit() {
			const userId = uni.getStorageSync("userInfo");
			const result = JSON.stringify(this.trueValue);
			const answerContent = JSON.stringify(this.question);
			const pushArr = {
				questionnaireId: "1797445758753525762", //问卷id
				basicInformationId: userId, //基本信息id
				result, //最终计算结果
				answerContent, //填写的结果 json格式包含题目名称，题目id，选项，选项名称
			};

			submitQuestion(pushArr).then((res) => {
				if (res.code == 200) {
					uni.removeStorageSync("userInfo");
					uni.showToast({
						title: "提交成功，即将返回首页",
						icon: "none",
					});
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/index/index",
						});
					}, 2000);
				}
			});
		},
	},
};
</script>

<style scoped lang="scss">
.u-nav-slot {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	border-width: 1rpx;
	border-radius: 200rpx;
	border-color: #dadbde;
	padding: 6rpx 14rpx;
	opacity: 0.8;
}

.screen-content {
	position: relative;
	width: 100%;
	.screen-bg {
		position: relative;
		width: 100%;
		aspect-ratio: 1/0.568;
		.screen-img {
			position: relative;
			width: 100%;
			height: 100%;
			display: block;
		}
	}
	.screen-card {
		position: relative;
		width: 85%;
		margin: 0px auto;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 0 8px #cecece;
		top: -3vh;
		padding: 1rem;
		font-size: 30rpx;
		margin-bottom: 2vh;
		.screen-title {
			position: relative;
			width: 100%;
			text-align: center;
			font-weight: bold;
			margin-bottom: 2rem;
			font-size: 50rpx;
		}
		.screen-item {
			position: relative;
			width: 100%;
			padding: 0.5rem;
			border-bottom: 1px solid #cecece;
			overflow: hidden;
			box-sizing: border-box;
			&:last-child {
				border-bottom: none;
			}
			.screen-key {
				position: relative;
				width: 100%;
				margin-bottom: 10px;
			}
			.screen-value {
				position: relative;
				width: 100%;
				.screen-value-select-placeholder {
					padding-top: 6px;
					padding-bottom: 6px;
					padding-left: 9px;
					padding-right: 9px;
					color: #c0c4cc;
					border: 1px solid #dadbde;
					border-radius: 4px;
					.screen-value-select-icon {
						position: absolute;
						top: 10px;
						right: 0px;
					}
				}
				.screen-value-select {
					padding-top: 6px;
					padding-bottom: 6px;
					padding-left: 9px;
					padding-right: 9px;
					color: #303133;
					border: 1px solid #dadbde;
					border-radius: 4px;
					.screen-value-select-icon {
						position: absolute;
						top: 10px;
						right: 0px;
					}
				}
			}
			.flex {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}

	.screen-result {
		position: relative;
		width: 85%;
		margin: 0px auto;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 0 8px #cecece;
		top: -3vh;
		padding: 1rem;
		font-size: 30rpx;
		margin-bottom: 1vh;

		.swiper {
			height: 48vh;
			.swiper-item {
				height: 48vh;
				overflow-y: auto;
				.screen-result-title {
					position: relative;
					width: 100%;
					font-size: 50rpx;
					font-weight: bold;
					text-align: center;
				}
				.speical-title {
					display: flex;
					align-items: center;
					justify-content: center;
					.left-arr {
						position: relative;
						left: -10px;
						animation: leftArr 0.5s linear infinite alternate;
					}
					.right-arr {
						position: relative;
						right: -10px;
						animation: rightArr 0.5s linear infinite alternate;
					}
				}
				.screen-result-sub-title {
					position: relative;
					width: 100%;
					margin: 20rpx 0;
					font-weight: bold;
				}
				.screen-result-desc {
					position: relative;
					width: 100%;
					margin-bottom: 20rpx;
					&:last-child {
						margin-bottom: 0;
					}
				}
			}
			.hidden {
				overflow-y: hidden;
			}
		}
	}

	.submit {
		position: relative;
		width: 90%;
		margin: 0px auto;
		text-align: center;
		line-height: 72rpx;
		height: 72rpx;
		font-size: 34rpx;
		font-weight: 500;
		color: #fff;
		background: linear-gradient(135deg, #00deff 0%, #0c5fff 100%);
		border-radius: 80rpx;
	}
	.disable {
		position: relative;
		width: 90%;
		margin: 0px auto;
		text-align: center;
		line-height: 72rpx;
		height: 72rpx;
		font-size: 34rpx;
		font-weight: 500;
		color: #000;
		background: #fff;
		border-radius: 80rpx;
		border: 1px solid #cecece;
	}
}

/deep/ .u-radio-group {
	flex-wrap: wrap;
	justify-content: space-between;
}

@keyframes leftArr {
	from {
		left: -10px;
	}

	to {
		left: -20px;
	}
}

@keyframes rightArr {
	from {
		right: -10px;
	}

	to {
		right: -20px;
	}
}
</style>
