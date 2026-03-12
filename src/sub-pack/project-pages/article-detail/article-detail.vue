<template>
	<!--  -->
    <z-paging 
        ref="paging" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
        :fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
        :loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
    >
        <view slot="top"><u-navbar  :title="param.name" :fixed="false" background="transparent" :leftIcon="$leftIcon" @leftClick="onBack" /></view>
        <view class="pubArticleDetail">
            <view class="detail br10">
                <u-skeleton
                    v-if="!firstLoaded"
                    rows="18" loading animation
                    bgColor="transparent"
                />
                <u-empty v-if="firstLoaded&&!param.content" text="暂无内容" />
                <u-parse 
                    v-if="firstLoaded&&param.content" 
                    :content="param.content" :selectable="true" 
                />
            </view>
        </view>
    </z-paging>
</template>

<script>
const content = {
    '1': `<div>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:center; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">用户服务协议</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">特别提示</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">欢迎申请使用昆明英派科技有限公司及其关联公司（以下称“服务提供者”）旗下E-AI（包括网站、小程序及手机应用等多平台）提供的服务。请服务使用人（以下称“用户”）仔细阅读以下全部内容。如用户不同意本服务协议任意内容，请不要注册或使用服务提供者的网络服务。如用户通过进入注册程序，即表示用户与服务提供者达成协议，自愿接受本服务协议的所有内容。此后，用户不得以未阅读本服务协议内容作任何形式的抗辩。用户注册成功后，服务提供者将给予每个用户一个用户账号及相应的密码，该用户账号和密码由用户自行负责保管；用户应当对其用户账号进行的所有活动和事件负法律责任。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">一、服务内容</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(1)</span>
                <span style="font-family:宋体; font-size:10.5pt">服务提供者具体内容由服务提供者根据实际情况提供，服务提供者并不承诺服务在开始、变更或者结束时，均事先知会用户。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(2)</span>
                <span style="font-family:宋体; font-size:10.5pt">服务提供者的服务若为收费的网络服务，用户使用收费网络服务需要向服务提供者支付一定的费用。对于收费的网络服务，服务提供者会在用户使用之前给予用户明确的提示，只有用户根据提示确认其愿意支付相关费用，用户才能使用该等收费网络服务。如用户拒绝支付相关费用，则服务提供者有权不向用户提供该收费网络服务。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(3)</span>
                <span style="font-family:宋体; font-size:10.5pt">服务提供者仅提供相关的互联网服务，用户必须自行负责上网设备，如个人电脑、手机或其他上网设备，以及自行解决互联网接入和支付与此服务有关的费用。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">二、服务协议变更</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">服务提供者有权在必要时通过在网页上发出公告等合理方式修改本服务协议以及各单项服务的相关协议。用户在享受各项服务时，应当及时查阅了解修改的内容，并自觉遵守本服务协议及各单项服务的相关协议。用户如继续使用本服务协议涉及的服务，则视为对修改内容的同意；用户在不同意修改内容的情况下，有权停止使用本服务协议涉及的服务。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">三、服务变更、中断或终止</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">鉴于互联网服务的特殊性，用户同意服务提供者有权随时变更、中断或终止部分或全部的网络服务（包括收费网络服务）。如变更、中断或终止的网络服务，平台无需通知用户，也无需对任何用户或任何第三方承担任何责任。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">四、用户资料合法性和真实性</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">考虑到服务提供者产品服务的重要性，用户同意：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(1)</span>
                <span style="font-family:宋体; font-size:10.5pt">您承诺提交信息过程中向平台及平台工作人员提交的信息资料完全真实，无任何虚构事实及隐瞒真相的情况，并承担相应的法律责任；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(2)</span>
                <span style="font-family:宋体; font-size:10.5pt">您必须提交本人信息资料，如非本人必须是经过病人</span>
                <span style="font-family:Calibri; font-size:10.5pt">/</span>
                <span style="font-family:宋体; font-size:10.5pt">监护人的授权后才可提交其资料，不得未经授权代他人提交患者信息、代他人报名；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(3)</span>
                <span style="font-family:宋体; font-size:10.5pt">您知晓并同意，平台的各类通知，通过网页公告、系统通知、官方管理账号通知（公开或者私下）、短信、电子邮件或者常规信件进行，通知发出时，即被视为已送达收件人。您对平台的通知，需要通过平台正式公布的联系方式、通信地址、传真号码、电子邮件地址等联系信息进行送达。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">五、免责声明</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(1)</span>
                <span style="font-family:宋体; font-size:10.5pt">用户明确同意其使用服务提供者服务所存在的风险将完全由其自己承担；服务提供者会审核用户提交的每一份资料，但无法保证审核用户每条信息发布的动机和内容的真实性，因其使用服务提供者服务而产生的一切后果也由其自己承担，服务提供者对用户不承担任何责任。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(2)</span>
                <span style="font-family:宋体; font-size:10.5pt">服务提供者所提供的任何信息（包括但不限于服务提供者官方提供的、用户发布的、服务提供者邀请的嘉宾提供的），服务提供者并不能保证其完全实时或完全准确，也不代表服务提供者已证实其描述或赞同其观点。所有内容仅供参考，由于仅依据用户描述而提供建议，不能作为诊断及治疗的依据，用户据此操作所造成的后果自行负责。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(3)</span>
                <span style="font-family:宋体; font-size:10.5pt">服务提供者不保证服务一定能满足用户的要求，也不保证服务不会中断，对服务的及时性、安全性、准确性也都不作保证。对于各种原因造成的网络服务中断、资料丢失、数据损毁或其他缺陷，平台不承担任何责任。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(4)</span>
                <span style="font-family:宋体; font-size:10.5pt">用户明确同意使用服务提供者的风险由用户个人承担。对于所有的用户注册资料、姓名、身份、发言内容以及其他行为，服务提供者拒绝提供任何担保。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(5)</span>
                <span style="font-family:宋体; font-size:10.5pt">用户知晓并且同意，对于服务提供者因为计算机系统、网络安全等问题，而导致用户资料意外泄漏，服务提供者并不对此负责。除非用户能证明，该泄漏是由于服务提供者的故意行为。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">六、内容的所有权</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(1)</span>
                <span style="font-family:宋体; font-size:10.5pt">内容的定义包括：文字、软件、声音、相片、视频、图表等。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(2)</span>
                <span style="font-family:宋体; font-size:10.5pt">用户同意，其发布上传到服务提供者的任何内容，服务提供者获得其全世界范围内免费的、永久性的、不可撤销的、非独家的、完全许可的权利和许可。服务提供者有权将内容用于其他合法用途，包括但不限于部分或者全部地复制、修改、改编、翻译、组装、分拆、推广、分发、广播、表演、演绎、出版。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(3)</span>
                <span style="font-family:宋体; font-size:10.5pt">服务提供者内容受知识产权法保护，不得擅自复制传播或者用于其他商业用途，本公司保留相应的法律权利。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">七、用户责任和义务</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">用户独立承担其发布内容相关的所有责任。用户对服务提供者服务的使用必须遵守所有适用于服务的地方法律、国家法律和国际法律。用户已经知晓并且承诺：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(1)</span>
                <span style="font-family:宋体; font-size:10.5pt">用户在服务提供者的网页上发布信息或者利用服务提供者的服务时必须符合中国有关法律法规，不得在服务提供者的网页上或者利用服务提供者的服务制作、复制、发布、传播以下信息：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">违反宪法制定的基本原则的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">损害国家荣誉和利益的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">煽动民族仇恨、民族歧视，破坏民族团结的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">破坏国家宗教政策，宣扬邪教和封建迷信的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">散布谣言，扰乱社会秩序，破坏社会稳定的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">散布淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">侮辱或者诽谤他人，侵害他人合法权益的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">煽动非法集会、结社、游行、示威、聚众扰乱社会秩序的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">以非法民间组织名义活动的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">含有法律、行政法规禁止的其他内容的。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(2)</span>
                <span style="font-family:宋体; font-size:10.5pt">用户在服务提供者的网页上发布信息或者使用服务提供者的服务时还必须符合其他有关国家和地区的法律规定以及国际法的有关规定。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(3)</span>
                <span style="font-family:宋体; font-size:10.5pt">用户发表在服务提供者的任何内容，服务提供者可以根据自己标准和立场进行管理或者删除，而无需提前或者事后向用户说明；管理或者删除的标准，也完全由服务提供者独立制订，无需征求用户意见，也无需向用户公开。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(4)</span>
                <span style="font-family:宋体; font-size:10.5pt">用户不得以任何方式干扰服务提供者的服务。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(5)</span>
                <span style="font-family:宋体; font-size:10.5pt">用户应遵守服务提供者的所有其他规定和程序。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(6)</span>
                <span style="font-family:宋体; font-size:10.5pt">用户须对自己在使用服务提供者服务过程中的行为承担法律责任。用户承担法律责任的形式包括但不限于：对受侵害者进行赔偿，以及在服务提供者首先承担了因用户行为导致的行政处罚或侵权损害赔偿责任后，用户应给予服务提供者等额的赔偿。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(7)</span>
                <span style="font-family:宋体; font-size:10.5pt">用户理解，如果服务提供者发现其网站传输的信息明显属于上段第</span>
                <span style="font-family:Calibri; font-size:10.5pt">(1)</span>
                <span style="font-family:宋体; font-size:10.5pt">条所列内容之一，依据中国法律，服务提供者有义务立即停止传输，保存有关记录，向国家有关机关报告，并且删除含有该内容的地址、目录或关闭服务器。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(8)</span>
                <span style="font-family:宋体; font-size:10.5pt">用户使用服务提供者电子公告服务，包括电子布告牌、电子白板、电子论坛、网络聊天室和留言板等以交互形式为上网用户提供信息发布条件的行为，也须遵守本条的规定。若用户的行为不符合以上提到的服务协议，服务提供者将作出独立判断立即取消用户服务账号或者其他有必要的措施。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">八、通知和送达</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">用户知晓并且同意，服务提供者的各类通知，通过网页公告、系统通知、官方管理账号通知（公开或者私下）、电子邮件或者常规信件进行，通知发出时，即被视为已送达收件人。用户对服务提供者的通知，需要通过服务提供者正式公布的联系方式、通信地址、传真号码、电子邮件地址等联系信息进行送达。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">九、适用法律和管辖权</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">本协议适用中华人民共和国的法律，并且排除一切冲突法规定的适用。若产生纠纷的，用户和服务提供者一致同意将纠纷交由服务提供者所在地法院管辖。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:center; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">E-AI平台用户协议</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">一、定义</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">、“E-AI平台用户协议”（以下简称“协议”）是您与昆明英派有限公司之间订立的关于您使用E-AI平台的协议。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">、“E-AI平台”（以下简称“E-AI”或代称“本平台”）是指昆明英派科技有限公司自主研发的一</span>
                <span style="font-family:宋体; font-size:10.5pt">款“互联网肿瘤医疗健康服务</span>
                <span style="font-family:Calibri; font-size:10.5pt">+</span>
                <span style="font-family:宋体; font-size:10.5pt">数字医疗自媒体”平台。包括网址</span>
                <span style="font-family:Calibri; font-size:10.5pt">http://web.ypzlfx.com/</span>
                <span style="font-family:宋体; font-size:10.5pt">）等网站及客户端应用程序、微信公众号、微信小程序等。 </span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">、“用户”是指注册登录E-AI平台，并使用E-AI平台服务的使用人，包括但不限于自然人、法人、其他组织等，在本协议中更多地称为“您”或“用户”。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">4</span>
                <span style="font-family:宋体; font-size:10.5pt">、“用户注册”指您为了使用E-AI平台所提供的相关服务填写必要信息，在E-AI平台生成唯一账号的过程。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">5</span>
                <span style="font-family:宋体; font-size:10.5pt">、本协议中E-AI平台提供的服务目前包括：样本检验查询、社区论坛、线上质控、报告解读、冷链物流服务、科研知识库等；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">二、用户提示</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI平台是一个“互联网肿瘤医疗健康服务</span>
                <span style="font-family:Calibri; font-size:10.5pt">+</span>
                <span style="font-family:宋体; font-size:10.5pt">数字医疗自媒体”平台，为确保您能正常地使用E-AI的各项电子服务，您应当阅读并遵守本协议。重点内容我们以下划线的形式表示，请您务必审慎阅读、充分理解各条款内容，以及开通或使用某项服务的单独协议，并选择接受或不接受。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">、您查阅点击同意或接受，即视为您确认自己具有享受E-AI平台服务、下单购买等相应的权利能力和行为能力，能够独立承担法律责任。如您在</span>
                <span style="font-family:Calibri; font-size:10.5pt">18</span>
                <span style="font-family:宋体; font-size:10.5pt">周岁以下，您只能在父母或监护人的参与下使用E-AI平台。 </span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">、您在注册填写相关信息时应保证：提供详尽、真实、准确和完整的个人资料以符合实名认证的要求。如果资料发生变动，您应及时更改。若您提供任何错误、不实、过时或不完整的资料，并为E-AI所确知，或者E-AI有合理理由怀疑前述资料为错误、不实、过时或不完整的资料，E-AI有权暂停或终止您的帐号，并拒绝现在或将来申请使用本服务的全部或一部分的请求。在此情况下，您可通过E-AI的申诉途径与E-AI取得联系并修正个人资料经E-AI核实后恢复账号使用。您还应当保证：您具有签署本协议的能力和资质，并取得相关的授权，包括但不限于获得您的第一执业点的同意，符合国家的政策及法律的规定。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">三、服务条款的接受和修改 </span>
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">、除非您已阅读并接受本协议所有条款，否则您无法使用本平台的各项电子服务。您在E-AI平台的登录、查看、发布信息等行为即视为您已阅读并同意本协议的约束，包括接受更新后的本协议条款。当您与E-AI平台发生争议时，应以最新的服务协议为准。当您点击“阅读并同意《E-AI平台用户协议》”，点击“绑定手机号”或“保存”按钮即视为您已仔细阅读本协议，同意接受本协议项下的所有条款，包括接受E-AI对本协议条款随时所做的任何修改，并愿意受其约束。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">、如果您对本协议的任何条款或者将来随时可能修改、补充的条款有异议，您可能无法使用我们提供的相关电子服务。如对本协议内容有任何疑问、意见或建议，您可通过客服中心</span>
                <span style="font-family:Calibri; font-size:10.5pt">http://web.ypzlfx.com/</span>
                <span style="font-family:宋体; font-size:10.5pt">）电话：梁女士</span>
                <span style="font-family:Calibri; font-size:10.5pt">18987464073</span>
                <span style="font-family:宋体; font-size:10.5pt">与我们联系。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">四、用户注册</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">、用户注册所需信息以您提供医疗或信息内容服务的医疗机构的要求为准，您应根据要求真实、准确、及时、完整的填写有效注册信息，本平台及医疗机构有权核验您提供的信息的真实性、准确性、完整性。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">、若您提供的信息不真实、不准确、不完整，将无法完成用户注册过程或无法完整使用平台提供的相关服务。同时，本平台有权终止为您提供服务。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">、您一旦注册成功，成为E-AI的合法用户，将得到一个您的帐号和密码。您的帐号和密码由您负责保管。您要对任何以您帐号进行的活动和事件负全责，且您有权随时根据指示更改您的密码。若发现任何非法使用您的帐号或存在安全漏洞的情况，请立即通知E-AI。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">4</span>
                <span style="font-family:宋体; font-size:10.5pt">、因黑客行为或您的保管疏忽等情况导致帐号、密码遭他人非法使用，E-AI不承担责任。E-AI将根据法律法规的要求，履行其作为移动互联网信息服务提供者应当履行的义务。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">五、用户管理</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">、您拥有您在本平台注册的账号的使用权利，但不得用于非法用途。 </span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">、如您发现其他用户有违法或违反本协议的行为，可以向本平台公示的渠道反映要求处理。 </span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">、您一旦注册成功，即成为本平台的合法用户，您需要对任何以您的账号进行的活动和事件负全责，且有权随时根据您的需要更改账号绑定状态。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">4</span>
                <span style="font-family:宋体; font-size:10.5pt">、若发现有任何非法使用您的账号等安全漏洞的存在，您有权通知本平台处理。 </span>
                <span style="font-family:Calibri; font-size:10.5pt">5</span>
                <span style="font-family:宋体; font-size:10.5pt">、因黑客行为或您的保管疏忽等情况导致账号被他人非法使用，本平台不承担责任。 </span>
                <span style="font-family:Calibri; font-size:10.5pt">6</span>
                <span style="font-family:宋体; font-size:10.5pt">、您在使用本平台过程中，必须遵守国家、地方法律法规、公序良俗，包括但不限于：</span>
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">）不得危害国家安全、泄露国家秘密，不得散布谣言、扰乱社会秩序；</span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">）不得恶意攻击本平台及其相关系统、计算机网络，或使用任何手段干预本平台的正常运行；</span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">）不得盗取、篡改、拦截本平台及其相关系统传输、存储的数据；</span>
                <span style="font-family:Calibri; font-size:10.5pt">4</span>
                <span style="font-family:宋体; font-size:10.5pt">）不得对本平台上的任何数据做商业性利用，包括但不限于未经本平台运营方事先书面同意的情况下，以复制、传播等方式使用本平台上展示的资料；</span>
                <span style="font-family:Calibri; font-size:10.5pt">5</span>
                <span style="font-family:宋体; font-size:10.5pt">）不得利用本平台恶意下单，或利用技术手段大量发送虚假请求；</span>
                <span style="font-family:Calibri; font-size:10.5pt">6</span>
                <span style="font-family:宋体; font-size:10.5pt">）不得盗用、冒用、倒卖他人账号与信息；不得利用或协助他人利用本平台从事恶意刷单、囤积单源、倒卖平台产品等影响正常平台市场秩序或为自己牟取不正常利益的行为；
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7</span>
                <span style="font-family:宋体; font-size:10.5pt">、如有违反而导致任何法律后果的发生，您将以自己的名义独立承担所有相应的法律责任。同时，本平台有权再此情况下停止为您提供部分或全部服务，并视司法部门要求，协助司法部门开展调查。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">8</span>
                <span style="font-family:宋体; font-size:10.5pt">、您不得发布任何不基于事实、虚构、夸大、引人误解的信息；不得发布涉及政治、性别、种族歧视或攻击他人的文字、图片、视频或语言等信息；不得发布介绍个人、科室等广告性质的内容；不得有其它涉及违反当地法规、国家法律和国际法律的行为。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">9</span>
                <span style="font-family:宋体; font-size:10.5pt">、对E-AI而言，您帐号和密码是唯一验证您真实性的依据，请您妥善保管账户及密码，只要使用了正确的您帐号和密码无论是谁登录均视为已经得到您本人的授权。若因您未保管好自己的账号和密码而对您、我们或其他第三方造成的损害，您将对此承担全部责任。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">10</span>
                <span style="font-family:宋体; font-size:10.5pt">、对于您违反本协议或法律法规、社会公德，致使本平台遭受损害、损失，或导致第三方主张索赔、损失，或任何行政管理部门的处罚，您同意对此承担赔偿责任后，还应承担以下责任（包括但不限于：诉讼费、律师费、鉴定费、公证费、保全费、保函费等）。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">六、本平台的权利和义务</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">、本平台利用国际互联网为您提供网络服务，并承担本协议和服务条款所规定的用户责任和义务。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">、本平台在必要时有权修改服务条款，协议条款一旦变动，届时将提示您修改内容，该提示视为本平台已经通知您修改内容，如果您不同意所做的修改，可以主主动取消服务。如果您继续使用本平台服务，则视为您接受服务条款变动。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">、本平台有义务对您反映的合理问题进行处理，但鉴于网络服务的依赖性，您理解并认可本平台对您反映的问题存在无法解决、部分解决或完全解决的情况。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">4</span>
                <span style="font-family:宋体; font-size:10.5pt">、保护您隐私是E-AI的一项基本政策。您的信任对E-AI非常重要，E-AI深知个人信息安全的重要性，E-AI将严格按照法律法规的要求，采取安全保护措施，保护您的个人信息安全。具体详见本协议“七、信息使用和隐私保护”</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">七、信息使用和隐私保护</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">7.1</span>
                <span style="font-family:宋体; font-size:10.5pt">信息收集和使用个人信息是指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。本平台仅会出于本政策所述的以下目的，收集和使用您的个人信息：
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.1.1</span>
                <span style="font-family:宋体; font-size:10.5pt">、本平台为您提供服务的医疗机构、监管机构等组织与本平台将共同控制您的个人信息。我们会与其按照法律条款采取安全措施来处理个人信息。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.1.2</span>
                <span style="font-family:宋体; font-size:10.5pt">、为方便您使用本平台相关服务，完成核心业务功能所需，本平台将根据合作医疗机构要求，需要您提供以下部分或全部信息，包括姓名、有效证件（包括但不限于身份证、护照）的号码、性别、出生日期、就诊卡号（或病历号、住院号）、成员关系、监护人、手机号码、家庭住址、民族、职业。如您选择不提供或不同意我们采集、使用以上个人信息，将导致您无法使用报告查询等医疗就诊服务。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.1.3</span>
                <span style="font-family:宋体; font-size:10.5pt">、如医疗机构提供儿童身份建卡服务，且您需使用儿童建卡服务，您知悉并同意我们收集、使用以下部分或全部信息，且此部分信息需您手工在页面填写，包括：儿童姓名、
                    儿童性别、儿童身份证、监护人姓名、监护人身份证、监护人手机号、家庭地址。如您选择不提供或不同意我们采集、使用以上个人信息，将导致您无法使用儿童建卡服务，但不影响其他服务的使用。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.1.4</span>
                <span style="font-family:宋体; font-size:10.5pt">、为实现住院服务功能，您知悉并同意我们收集、使用：住院患者姓名、住院号、住院记录、申请人姓名、申请人证件号、申请人身份证件复印件、申请人手机号（具体所需信息以该服务页面呈现内容为准），如您选择不提供或不同意我们采集、使用以上个人信息，将无法使用该服务；
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.1.5</span>
                <span style="font-family:宋体; font-size:10.5pt">、为实现人脸核身，鉴别您的身份真实性与证件一致性，您知悉并同意我们收集、使用您的姓名、证件号，并用于第三方人脸核身份服务鉴别身份，但本平台并不存储您的人脸信息。如您选择不提供或不同意我们采集、使用以上信息，将无法使用该服务完成身份核验，进而可能会根据情况影响您的用户注册或病案复印服务（若医疗机构无相关要求，则不会影响对您的用户注册或病案复印服务的使用）
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.1.6</span>
                <span style="font-family:宋体; font-size:10.5pt">、为实现身份证</span>
                <span style="font-family:Calibri; font-size:10.5pt">OCR</span>
                <span style="font-family:宋体; font-size:10.5pt">识别自动识别您的证件、报告信息，您知悉并同意我们收集、使用您的证件照片、报告信息并通过第三方</span>
                <span style="font-family:Calibri; font-size:10.5pt">OCR</span>
                <span style="font-family:宋体; font-size:10.5pt">服务识别信息自动页面填充，但本平台。如您选择不提供或不同意我们采集该信息，则将无法使用该服务，但不影响您正常使用用户注册流程；
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.1.7</span>
                <span style="font-family:宋体; font-size:10.5pt">、为了在您每次点击操作时鉴别您的身份，我们可能会使用浏览器网络存储机制缓存您的身份标识，但此身份标识并不能单独识别您的个人信息，不属于个人信息的一部分，仅用于程序上技术性识别；
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.1.8</span>
                <span style="font-family:宋体; font-size:10.5pt">、我们可能从第三方间接获取您的个人信息： </span>
                <span style="font-family:Calibri; font-size:10.5pt">A.</span>
                <span style="font-family:宋体; font-size:10.5pt">您关注医疗机构微信公众号或小程序、支付宝生活号或小程序，进入相应注册页面，可选择本平台在符合相关法律法规要求的前提下读取并获得您在微信或支付宝上记录的第三方用户标识，该</span>
                <span style="font-family:Calibri; font-size:10.5pt">ID</span>
                <span style="font-family:宋体; font-size:10.5pt">仅可用于技术上的身份标识，但通过该字段无法单独识别您的个人信息，不属于个人信息的一部分。在部分场景下，本平台需获取您的您在微信／支付宝上的个人信息，包括姓名、手机号、身份证号，则本平台将以弹窗形式提醒您知悉并同意授权，您授权后即可使用本平台的服务。如您选择不提供或不同意我们采集该信息，则将无法使用本平台的服务。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">B.</span>
                <span style="font-family:宋体; font-size:10.5pt">为实现为您推荐院区或报告查询功能，您知悉并同意我们通过微信、支付宝提供的</span>
                <span style="font-family:Calibri; font-size:10.5pt">API</span>
                <span style="font-family:宋体; font-size:10.5pt">收集、使用您的当前位置，本平台将以弹窗授权的方式征得您的同意后获取您的位置，如您选择不提供或不同意我们采集该信息，则将无法使用该服务；
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">C.</span>
                <span style="font-family:宋体; font-size:10.5pt">如您不希望与医疗机构微信公众号号或小程序、支付宝生活号或小程序绑定，您可以自行解除绑定或取消关注，或联系相应医疗机构操作解除绑定。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">D.</span>
                <span style="font-family:宋体; font-size:10.5pt">为实现电子就诊卡功能，我们将根据中华人民共和国国家卫健委的要求，接入各省市电子健康卡平台，向电子健康卡平台传输您的个人信息，或从电子健康卡平台获取您的个人信息，具体信息以各省市电子健康卡平台要求为准。如您选择不提供或不同意我们采集该信息，则将无法使用该服务及相关服务。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">E.</span>
                <span style="font-family:宋体; font-size:10.5pt">为实现医保支付功能，我们将根据各省市医疗保障局要求，接入各省市医保系统，向医保系统传输您的个人信息，或从医保系统获取您的个人信息，但本平台并不存储您的医保信息。如您选择不提供或不同意我们采集该信息，则将无法使用该服务及相关服务。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.1.9</span>
                <span style="font-family:宋体; font-size:10.5pt">、您提供的上述信息，将在您使用本服务期间持续授权我们使用。在您注销账号时，我们将停止使用并删除上述信息或作匿名化处理。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.1.10</span>
                <span style="font-family:宋体; font-size:10.5pt">、上述信息仅存储于中华人民共和国境内。如需跨境传输，我们将会单独征得您的授权同意。 </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.1.11</span>
                <span style="font-family:宋体; font-size:10.5pt">、当我们要将信息用于本政策未载明的其它用途时，会事先征求您的同意。当我们要将基于特定目的收集而来的信息用于其他目的时，会事先征求您的同意。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.1.12</span>
                <span style="font-family:宋体; font-size:10.5pt">、本平台有权根据实际情况，在法律规定范围内自行决定单个用户在本平台及服务中数据的最长储存期限以及用户日志的储存期限，并在境内服务器上为其分配数据存储空间等。除法律法规规定的情形外，未经您的许可本平台不会向第三方公开、透露您的个人信息。本平台对相关信息采取专业加密存储与传输方式，利用合理措施保障用户个人信息的安全。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.2</span>
                <span style="font-family:宋体; font-size:10.5pt">个人信息共享本平台不会与任何公司、组织和个人分享您的个人信息，但以下情况除外： </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.2.1</span>
                <span style="font-family:宋体; font-size:10.5pt">、在获取明确同意的情况下共享：获得您的明确同意后，我们会与其他方共享您的个人信息。 </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.2.2</span>
                <span style="font-family:宋体; font-size:10.5pt">、我们可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享您的个人信息。 </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.2.3</span>
                <span style="font-family:宋体; font-size:10.5pt">、与我们的关联公司共享：您的个人信息可能会与昆明英派科技有限公司的关联公司共享。我们只会共享必要的个人信息，且受本隐私政策中所声明目的的约束。附属公司如要改变个人信息的处理目的，将再次征求您的授权同意。（本公司存在与其他公司信息共享情况吗）
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.2.4</span>
                <span style="font-family:宋体; font-size:10.5pt">、医疗机构关联公司共享：为了实现通过本平台以外组织为您提供医疗服务，您的个人信息可能会与为您提供服务的医疗机构关联公司共享。我们只会共享必要的个人信息，且受本隐私政策中所声明目的的约束。通过由我们或第三方提供的功能，您可以主动公开分享、共享信息（如向其他互联网平台转发内容），在这种情况下共享信息将被广泛并即时传送。但只要您不删除被共享的信息，该信息会一直留存在公众领域；在一些情况下，即使您删除共享信息，该等信息仍可由其他用户或与我们没有关联及不受我们控制的第三方独立地缓存、复制或储存，或通过其他用户或该等第三方在公众领域保存。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.2.5</span>
                <span style="font-family:宋体; font-size:10.5pt">、与授权合作伙伴共享：仅为实现本政策中声明的目的，我们的某些服务将由授权合作伙伴提供。我们可能会与合作伙伴共享您的某些个人信息，以提供更好的客户服务和用户体验。我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息，并且只会共享提供服务所必要的个人信息。我们的合作伙伴无权将共享的个人信息用于任何其他用途。对我们与之共享个人信息的公司、组织和个人，我们会与其签署严格的保密协定，要求他们按照我们的说明、本隐私政策以及其他任何相关的保密和安全措施来处理个人信息。我们提供给他们的信息主要是：姓名、身份证号、手机号码。对我们与之共享个人信息的公司、组织和个人，我们会与其签署严格的保密协定，要求他们按照我们的说明、本隐私政策以及其他任何相关的保密和安全措施来处理个人信息。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.3</span>
                <span style="font-family:宋体; font-size:10.5pt">、个人信息转让：我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外： </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.3.1</span>
                <span style="font-family:宋体; font-size:10.5pt">、在获取明确同意的情况下转让：获得您的明确同意后，我们会向其他方转让您的个人信息； </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.3.2</span>
                <span style="font-family:宋体; font-size:10.5pt">、在涉及合并、收购或破产清算时，如涉及到个人信息转让，我们会在要求新的持有您个人信息的公司、组织继续受此隐私政策的约束，否则我们将要求该公司、组织重新向您征求授权同意。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.4</span>
                <span style="font-family:宋体; font-size:10.5pt">、公开披露我们仅会在以下情况下，公开披露您的个人信息： </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.4.1</span>
                <span style="font-family:宋体; font-size:10.5pt">、获得您明确同意后； </span>
                <span style="font-family:Calibri; font-size:10.5pt">7.4.2</span>
                <span style="font-family:宋体; font-size:10.5pt">、基于法律的披露：在法律、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会公开披露您的个人信息如果发生安全事故导致您的个人信息泄露、损毁、篡改、丢失等，我们会及时通知您，并提供补救措施。若您对上述说明存在疑问，可与我们的客服取得联系。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">八、E-AI拒绝提供担保</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI拒绝提供任何形式的担保，无论是明示还是隐含的。包括对移动网络服务，我们无法确保移动网络能够满足您的要求，也无法保证所提供的服务不会受网络、通信等原因而中断，对服务的及时性、安全性、错误程序的发生都不作担保；包括我们无法保证您在我们平台上获取的健康、诊疗意见。包括E-AI平台及其所包含的或以其它方式通过E-AI平台提供给您的全部信息、内容、材料、产品（包括软件）和服务；包括通过E-AI平台提供给您的全部信息、内容、材料、产品（包括软件）和服务、其服务器或从E-AI平台发出的电子信件、信息没有病毒或其他有害成分。如因不可抗力或其它E-AI平台无法控制的原因使E-AI平台系统崩溃或无法正常使用导致网上交易无法完成或丢失有关的信息、记录等，E-AI会合理地尽力协助处理善后事宜。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI平台所承载的内容（文、图、视频、音频）均为传播有益健康资讯目的，不对其真实性、科学性、严肃性做任何形式保证。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">、因您的服务需要，我们会有部份的点击链接至其他合作伙伴开展的网站，我们不对其他第三方网站如何开展服务，如何收集您的个人信息作出任何担保。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">九、责任限制</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI平台服务是按照现有技术和条件所能达到的水平提供的服务。E-AI会尽最大努力为您提供服务，确保服务的连贯性和安全性；但E-AI不能随时预见和防范法律、技术以及其他风险，包括但不限于不可抗力、病毒、木马、黑客攻击、系统不稳定、第三方服务瑕疵、政府行为等原因可能导致的服务中断、数据丢失以及其他的损失和风险。E-AI所不能控制的事件而影响E-AI提供服务，E-AI无须承担任何责任。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI对您使用网络服务而受到的任何直接、间接、偶然、特殊及继起的损害（E-AI违反法律、法规和本协议的条款除外）不负责任，这些损害可能来自：不正当使用网络服务，私自在网上进行交易，非法使用网络服务或您传送的信息有所变动。这些行为都有可能会导致E-AI的形象受损，所以E-AI事先提出这种损害的可能性。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI所有信息仅供参考。E-AI致力于提供正确、完整的健康资讯，但不保证信息的绝对正确性和完整性，且不对因信息的不正确或遗漏导致的任何损失或损害承担责任。E-AI所提供的任何健康资讯，仅供参考，不能替代医生和其他医务人员的建议，如自行使用E-AI资料发生偏差，E-AI不承担任何法律责任。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">4</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI拒绝回复的问题，包括但不限于如下情况： （</span>
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">）非各项电子类问题，如动物疾病问题、社会意识形态问题等； （</span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">）医疗司法举证或询证问题； （</span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">）胎儿性别鉴定问题； （</span>
                <span style="font-family:Calibri; font-size:10.5pt">4</span>
                <span style="font-family:宋体; font-size:10.5pt">）未按提问要求提问，如提问时未指定医生，却要求具体医生回复； （</span>
                <span style="font-family:Calibri; font-size:10.5pt">5</span>
                <span style="font-family:宋体; font-size:10.5pt">）有危害他人</span>
                <span style="font-family:Calibri; font-size:10.5pt">/</span>
                <span style="font-family:宋体; font-size:10.5pt">自己可能的问题； （</span>
                <span style="font-family:Calibri; font-size:10.5pt">6</span>
                <span style="font-family:宋体; font-size:10.5pt">）追问医生个人信息的问题； （</span>
                <span style="font-family:Calibri; font-size:10.5pt">7</span>
                <span style="font-family:宋体; font-size:10.5pt">）故意挑逗、侮辱医生的提问。 </span>
                <span style="font-family:Calibri; font-size:10.5pt">5</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI平台所提供的任何各项电子信息，症状自查等服务仅供参考，如自行使用E-AI平台中资料发生偏差，E-AI概不负责，亦不负任何法律责任。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">6</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI保留对本协议作出不定时修改的权利。 </span>
                <span style="font-family:Calibri; font-size:10.5pt">7</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI不对您所发布信息的删除或储存失败负责。E-AI积极采用数据备份加密等措施保障您数据的安全，但不对由于因意外因素导致的数据损失和泄漏负责。E-AI有权审查和监督您的行为是否符合本协议的要求，如果您违背了本协议的约定，则E-AI有权中断您的服务。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">8</span>
                <span style="font-family:宋体; font-size:10.5pt">、如果您或第三方就相关服务购买了保险，因发生保险事故导致损失的，保险公司已经向您或第三方承担或许诺承担保险理赔责任后，E-AI在此范围内不再承担赔偿责任。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">十、服务的暂停与终止</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">、鉴于网络服务的特殊性，本平台有权随时变更、中断或终止部分或全部的网络服务。如变更、中断或终止网络服务，本平台无需通知您，也无需对您或第三方承担责任。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">、本平台需要定期或不定期的对提供网络服务的平台或相关设备进行检修、维护，如因此造成的网络服务中断，本平台无需承担任何责任，但本平台应尽可能事先通告。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">、您有权向自行注销／解除绑定您在本平台绑定的就诊人信息，包括但不限于您在本平台绑定的医疗机构就诊卡、病历号、住院号等身份信息。您解除后，本平台将终止为您提供相应服务。但注销该用户信息后，本平台仍保留下列权利：</span>
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">）您注销后，本平台将删除您的注册数据或对相应记录做匿名化处理；</span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">）您注销后，如您在注销前在本平台上存在违法行为或违反协议的行为，本平台仍可行使本服务协议所规定的权利；</span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">）如您在使用本平台过程中涉及医疗机构、第三方公司等组织，您在本平台注销后，不影响您在相应组织的服务使用（依赖于本平台的服务除外）。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">4</span>
                <span style="font-family:宋体; font-size:10.5pt">、本平台有权在下述情况下，不通知您并对您采取删除、限制、暂停或终止服务措施，包括：违反本协议或相关法律法规；违反社会公德，扰乱社会秩序、就医秩序；侵犯本平台、合作机构、其他用户或第三方合法权益或公共利益；本平台认为的需暂停或终止服务的其他情况。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">十一、争议解决方法</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">凡因解释或执行服务协议所发生的或与本服务协议有关的一切争议，双方应通过友好协商解决；协商不成的，昆明英派科技有限公司注册地人民法院为管辖法院。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">十二、知识产权声明</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">、您一旦接受本协议，即表明您主动将其在任何时间段在E-AI平台发表的任何形式的信息内容（包括但不限于用户评价、用户咨询、各类话题文章等信息内容）的财产性权利等任何可转让的权利，如著作权财产权（包括并不限于：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权以及应当由著作权人享有的其他可转让权利），全部独家且不可撤销地转让给E-AI所有，您同意E-AI有权就任何主体侵权而单独提起诉讼。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">、本协议已经构成《中华人民共和国著作权法》第二十七条（条文序号依照</span>
                <span style="font-family:Calibri; font-size:10.5pt">2021</span>
                <span style="font-family:宋体; font-size:10.5pt">年</span>
                <span style="font-family:Calibri; font-size:10.5pt">6</span>
                <span style="font-family:宋体; font-size:10.5pt">月</span>
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">日施行的著作权法确定）及相关法律规定的著作财产权等权利转让书面协议，其效力及于您在E-AI平台上发布的任何受著作权法保护的作品内容，无论该等内容形成于本协议订立前还是本协议订立后。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">、您同意并已充分了解本协议的条款，承诺不将已发表于E-AI平台的信息，以任何形式发布或授权其它主体以任何方式使用（包括但限于在各类网站、媒体上使用）。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">4</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI是E-AI平台的制作者，拥有E-AI平台内容及资源的著作权等合法权利，受国家法律保护，有权不断地对本协议及E-AI平台的内容进行修改，修改后的协议和内容会进行公示和重新确认。在法律允许的最大限度范围内，E-AI对本协议及E-AI平台的内容拥有解释权。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">5</span>
                <span style="font-family:宋体; font-size:10.5pt">、除法律另有强制性规定外，未经E-AI明确的特别书面许可，任何单位或个人不得以任何方式非法地全部或部分复制、转载、引用、链接、抓取或以其他方式使用E-AI平台的信息内容，否则，E-AI有权追究其法律责任。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">6</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI平台所刊登的资料信息（诸如文字、图表、标识、按钮图标、图像、声音文件片段、数字下载、数据编辑和软件），均是E-AI或其内容提供者的财产，受中国和国际版权法的保护。E-AI平台上所有内容的汇编是E-AI的排他财产，受中国和国际版权法的保护。E-AI平台上的所有软件都是E-AI或其关联公司或其软件供应商的财产，受中国和国际版权法的保护。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">十三、广告说明</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI平台上为您的便利而提供的外部链接，包括但不限于任何广告内容链接，以及该链接所指向网页之所有内容，均系该网页所属第三方的所有者制作和提供（以下简称“第三方网页”）。第三方网页并非也不反映E-AI之任何意见和主张，也不表示E-AI同意或支持该第三方网页上的任何内容、主张或立场。E-AI对第三方网页中内容之合法性、准确性、真实性、适用性、安全性和完整性等概不承担任何责任。任何单位或个人如需要第三方网页中内容（包括资讯、资料、消息、产品或服务介绍、报价等），并欲据此进行交易或其他行为前，应慎重辨别这些内容的合法性、准确性、真实性、适用性、完整性和安全性（包括下载第三方网页中内容是否会感染电脑病毒），并采取谨慎的预防措施。如您不确定这些内容是否合法、准确、真实、实用、完整和安全，建议您先咨询专业人士。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">、任何单位或者个人因相信、使用第三方网页中信息、服务、产品等内容，或据此进行交易等行为，而引致的人身伤亡、财产毁损（包括因下载而感染电脑病毒）、名誉或商誉诽谤、版权或知识产权等权利的侵犯等事件，及因该等事件所造成的损害后果，E-AI概不承担任何法律责任。无论何种原因，E-AI不对任何非与E-AI直接发生的交易和行为承担任何直接、间接、附带或衍生的损失和责任。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">十四、协议修改</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">根据国家法律法规变化及网络运营需要，E-AI有权对本协议条款不时地进行修改，修改后的协议一旦被张贴在E-AI平台上即生效，并代替原来的协议，E-AI将公告通知变更信息。您可随时登陆查阅最新协议；您有义务不时关注并阅读最新版的协议及E-AI平台公告。如您不同意更新后的协议，可以且应立即停止接受E-AI平台依据本协议提供的服务；如您继续使用E-AI平台提供的服务，即视为同意更新后的协议。E-AI建议您在使用E-AI平台之前阅读本协议及E-AI平台的公告。如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。当发生有关争议时，以最新的服务协议为准。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">十五、通告</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1.</span>
                <span style="font-family:宋体; font-size:10.5pt">本协议项下所有的通知均可通过重要页面公告、电子邮件或常规的信件传送等方式进行；该等通知于发送之日视为已送达。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">2.</span>
                <span style="font-family:宋体; font-size:10.5pt">您对于E-AI的通知应当通过E-AI平台对外正式公布的通信地址、电子邮件地址等联系信息进行邮寄书面送达。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">十六、其他</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">、E-AI尊重您的合法权利，本协议及E-AI平台上发布的各类规则、声明等其他内容，均是为了更好、更便利的为您提供服务。E-AI平台欢迎您和社会各界提出宝贵意见和建议，E-AI将虚心接受并适时修改本协议及E-AI平台的各类规则。
                </span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">、本协议内容中以黑体、加粗、下划线、斜体等方式显著标识的条款，请您认真阅读。 </span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">、您注册使用E-AI平台即视为您完全接受本协议，在点击“阅读并同意《E-AI平台用户协议》”，点击“绑定手机号”或“保存”按钮之前请您再次确认已知悉并完全理解本协议的全部内容。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
        </div>`,
    '2':`<div>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:center; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">隐私协议</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">保护用户隐私是E-AI和昆明英派科技有限公司（以下简称平台）的基本政策，非经用户许可，平台保证不对外公开或向第三方提供用户的注册资料及用户在使用网络服务时存储在服务提供者的非公开内容。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">一、平台可能收集的信息</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">平台在提供服务时，根据合法、正当、必要的原则，仅可能收集、储存和使用为您提供服务所必要的下列与个人（“您”）有关的信息：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt; font-weight:bold">1.</span>
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">与个人身份相关的信息：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">当您使用服务时，平台可能收集、汇总或要求您提供与个人身份相关的信息。例如：您的姓名、生日、年龄、性别、住址、身份证号、电话号码、电子邮箱地址、微信号、用户名、</span>
                <span style="font-family:Calibri; font-size:10.5pt">IP</span>
                <span style="font-family:宋体; font-size:10.5pt">地址、个人位置信息、用户的设备信息等；您在使用服务时提交的个人健康信息，例如病历病史资料、检查报告、手术及麻醉记录、护理记录、药物食物过敏信息、生育信息、诊治情况、家族病史、其他与个人身体健康状况相关的信息，如体重、身高肺活量等，以及您通过平台的客服或参加平台举办的活动时所提交的个人信息。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt; font-weight:bold">2.</span>
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">与个人身份有关的信息：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">当您使用服务时，平台将可能自动收集、获取并存储为服务日志的信息，例如来源途径、访问顺序、停留时间以及电子日志信息等。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt; font-weight:bold">3.</span>
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">其他基于为您提供服务需要而收集或汇总的您的信息：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">例如，其他用户分享的信息中含有您的信息、推荐您参加活动的信息等。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">二、平台如何收集和使用您的个人信息</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">平台严格遵守法律法规的规定及与用户的约定，出于以下目的，收集、储存和使用您的个人信息。若平台超出以下用途或者将基于特定目的收集而来的信息用于其他目的使用您的信息，平台将再次向您进行说明，并征得您的同意。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1.</span>
                <span style="font-family:宋体; font-size:10.5pt">帮助您成为平台的用户；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">2.</span>
                <span style="font-family:宋体; font-size:10.5pt">向您提供服务或产品；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">3.</span>
                <span style="font-family:宋体; font-size:10.5pt">向您展示并推荐您可能感兴趣的资讯、活动等相关信息和服务；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">4.</span>
                <span style="font-family:宋体; font-size:10.5pt">邀请您参与有关平台服务的调查，评估、改善平台的服务及推广活动的效果；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">5.</span>
                <span style="font-family:宋体; font-size:10.5pt">将所收集到的信息用于数据分析。例如，平台将收集到的信息用于分析形成不包含任何个人信息的行业洞察报告；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">6.</span>
                <span style="font-family:宋体; font-size:10.5pt">为您提供安全保障；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">7.</span>
                <span style="font-family:宋体; font-size:10.5pt">征得授权同意的例外：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">以下情形中收集您的个人信息无需征得您的授权同意：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">与国家安全、国防安全有关的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">与公共安全、公共卫生、重大公共利益有关的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">与犯罪侦查、起诉、审判和判决执行等有关的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到您本人同意的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">所收集的个人信息是您自行向社会公众公开的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">根据您的要求签订合同所必需的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">用于维护所提供的产品或服务的安全稳定运行所必需的，例如发现、处置产品或服务的故障；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">为合法的新闻报道所必需的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">学术研究机构基于公共利益开展统计或学术研究所必要，且对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:normal">法律法规规定的其他情形。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">三、平台如何共享、转让、公开披露您的个人信息</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1.</span>
                <span style="font-family:宋体; font-size:10.5pt">共享：平台不会向除服务提供者以外的任何公司、组织和个人分享您的信息，但以下情况除外：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(1)</span>
                <span style="font-family:宋体; font-size:10.5pt">平台可能会根据法律法规规定，或按政府主管部门的强制性要求，在紧急情况下竭力维护用户个人和社会大众的隐私安全，对外共享或公开披露您的个人信息。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(2)</span>
                <span style="font-family:宋体; font-size:10.5pt">在获取明确同意的情况下共享：获得您的明确同意后，平台会与其他方共享您的个人信息。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(3)</span>
                <span style="font-family:宋体; font-size:10.5pt">与授权合作伙伴共享：仅为实现本政策中所声明之目的，平台的某些服务将由授权合作伙伴提供。平台可能会与合作伙伴共享您的某些个人信息，为了提供更好的客户服务和用户体验。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(4)</span>
                <span style="font-family:宋体; font-size:10.5pt">维护服务提供者的知识产权和其他重要权利下，服务提供者一旦发现用户发布虚假信息的，有权立即采取可能的一切措施（包括但不限于公示、黑名单等手段）。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">(5)</span>
                <span style="font-family:宋体; font-size:10.5pt">根据本协议相关规定或者服务提供者认为必要的其他情况下。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">2.</span>
                <span style="font-family:宋体; font-size:10.5pt">转让：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">平台不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">在获取明确同意的情况下转让：获得您的明确同意后，平台会向其他方转让您的个人信息。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">3.</span>
                <span style="font-family:宋体; font-size:10.5pt">共享、转让、公开披露个人信息时事先征得授权同意的例外：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">与国家安全、国防安全有关的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">与公共安全、公共卫生、重大公共利益有关的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">与犯罪侦查、起诉、审判和判决执行等有关的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">您自行向社会公众公开的个人信息；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">四、平台如何保护您的个人信息</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1.</span>
                <span style="font-family:宋体; font-size:10.5pt">平台已采取符合业界标准、合理可行的安全防护措施保护您提供的个人信息安全，防止个人信息遭到未经授权访问、公开披露、使用、修改、损坏或丢失。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">2.</span>
                <span style="font-family:宋体; font-size:10.5pt">平台会采取合理可行的措施，尽力避免收集无关的个人信息。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">3.</span>
                <span style="font-family:宋体; font-size:10.5pt">平台将在合理的安全范围内使用各种安全保护措施以保障信息的安全。例如，服务提供者使用加密技术（例如，</span>
                <span style="font-family:Calibri; font-size:10.5pt">TLS</span>
                <span style="font-family:宋体; font-size:10.5pt">、</span>
                <span style="font-family:Calibri; font-size:10.5pt">SSL</span>
                <span style="font-family:宋体; font-size:10.5pt">）、匿名化处理等手段来保护您的个人信息。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">4.</span>
                <span style="font-family:宋体; font-size:10.5pt">平台建立专门的管理制度、流程和组织确保信息安全。例如，平台严格限制访问信息的人员范围，要求他们遵守保密义务，并进行审查。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">五、您如何管理您的个人信息</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1.</span>
                <span style="font-family:宋体; font-size:10.5pt">您可以在使用平台服务的过程中，访问、修改、补充和删除您提供的注册信息和其他个人信息，也可按照通知指引与平台联系。您访问、修改、补充和删除个人信息的范围和方式将取决于您使用的具体服务。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">2.</span>
                <span style="font-family:宋体; font-size:10.5pt">平台将按照本政策所述，仅为实现平台产品或服务的功能，收集、使用您的信息。如您发现平台违反法律、行政法规的规定或者双方的约定收集、使用您的个人信息，您可以要求平台删除。如您发现平台收集、存储的您的个人信息有错误的，您也可以要求平台更正。请通过本政策列明的联系方式与平台联系。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">3.</span>
                <span style="font-family:宋体; font-size:10.5pt">响应您的请求：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">对于您合理的请求，平台原则上不收取费用，但对多次重复、超出合理限度的请求，平台将视情况收取一定成本费用。对于那些无端重复、需要过多技术手段、给他人合法权益带来风险或者非常不切实际的请求，平台可能会予以拒绝。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">4.</span>
                <span style="font-family:宋体; font-size:10.5pt">响应您请求的例外：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">在以下情形中，平台将无法响应您的请求：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">与国家安全、国防安全有关的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">与公共安全、公共卫生、重大公共利益有关的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">与犯罪侦查、起诉、审判和执行判决等有关的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">有充分证据表明个人信息主体存在主观恶意或滥用权利的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">响应您的请求将导致您或其他个人、组织的合法权益受到严重损害的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">涉及商业秘密的。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:center; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">产品告知书</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">本协议是您与E-AI服务平台（简称“E-AI”）的所有者昆明英派有限公司（下称“英派”）之间就E-AI服务等相关事宜所订立的协议，请您仔细阅读本注册协议。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">您勾选“我同意用户使用协议”
                    即视为您完全接受本协议，在点击之前请您再次确认已知悉并完全理解本协议的全部内容，本协议即构成对双方有约束力的法律文件。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">第</span>
                <span style="font-family:Calibri; font-size:10.5pt; font-weight:bold">1</span>
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">条 E-AI服务条款的确认和接纳</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1.1 </span>
                <span style="font-family:宋体; font-size:10.5pt">用户同意所有注册协议条款并完成注册程序，才能成为E-AI的正式用户。用户确认：本协议条款是处理双方权利义务的契约，始终有效，法律另有强制性规定或双方另有特别约定的，依其规定。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1.2 </span>
                <span style="font-family:宋体; font-size:10.5pt">用户点击同意本协议的，即视为用户确认自己具有享受E-AI服务、报告查询、下单购买平台内服务等相应的权利能力和行为能力，能够独立承担法律责任。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1.3 </span>
                <span style="font-family:宋体; font-size:10.5pt">如果您在</span>
                <span style="font-family:Calibri; font-size:10.5pt">18</span>
                <span style="font-family:宋体; font-size:10.5pt">周岁以下，您只能在父母或监护人的监护参与下才能使用E-AI。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">1.4 </span>
                <span style="font-family:宋体; font-size:10.5pt">英派保留在中华人民共和国大陆地区法施行之法律允许的范围内独自决定拒绝服务、关闭用户账户、清除或编辑内容或取消订单的权利。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">第</span>
                <span style="font-family:Calibri; font-size:10.5pt; font-weight:bold">2</span>
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">条E-AI服务内容</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">2.1 </span>
                <span style="font-family:宋体; font-size:10.5pt">E-AI通过互联网依法为用户提供互联网信息等服务，用户在完全同意本协议及E-AI规定的情况下，方有权使用E-AI的服务及平台内的其他服务。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">2.2 </span>
                <span style="font-family:宋体; font-size:10.5pt">E-AI内展示的信息（包括但不限于医院</span>
                <span style="font-family:Calibri; font-size:10.5pt">/</span>
                <span style="font-family:宋体; font-size:10.5pt">商家名称、专家信息、联系人机联络信息等）均由相关第三方合作机构提供，E-AI进行形式审查后在平台内展示。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">2.3 </span>
                <span style="font-family:宋体; font-size:10.5pt">E-AI提供的服务仅为渠道服务。用户实际享受的服务或使用的产品，由平台内的第三方合作机构提供。因第三方合作机构提供的产品或服务等产生的任何纠纷（包括但不限于医患纠纷等），均由第三方合作机构负责处理并承担相应法律责任。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">在发生纠纷时，E-AI将协助用户与第三方合作机构进行协商与沟通。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">第</span>
                <span style="font-family:Calibri; font-size:10.5pt; font-weight:bold">3</span>
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">条 订单</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">在您下订单时，请您仔细确认所购服务的名称、价格、数量、说明、注意事项、联系地址、电话、联系人等信息。联系人与用户本人不一致的，联系人的行为和意思表示视为用户的行为和意思表示，用户应对联系人的行为及意思表示的法律后果承担连带责任。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">第</span>
                <span style="font-family:Calibri; font-size:10.5pt">4</span>
                <span style="font-family:宋体; font-size:10.5pt">条 责任限制及不承诺担保</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">4.1 </span>
                <span style="font-family:宋体; font-size:10.5pt">用户在享受第三方提供的服务或产品过程中，产生的任何纠纷（包括但不限于医患纠纷等），均由第三方合作机构负责处理并承担相应法律责任。E-AI仅协助用户与第三方合作机构进行协商与沟通。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">4.2 </span>
                <span style="font-family:宋体; font-size:10.5pt">除非另有明确的书面说明，E-AI及其所包含的或以其它方式通过E-AI提供给您的全部信息、内容、材料、产品（包括软件）和服务，均是在“按现状”和“按现有”的基础上提供的。除非另有明确的书面说明，英派不对E-AI的运营及其包含在E-AI上的信息、内容、材料、产品（包括软件）或服务作任何形式的、明示或默示的声明或担保（根据中华人民共和国法律另有规定的以外）。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">4.3 </span>
                <span style="font-family:宋体; font-size:10.5pt">如因不可抗力或其它本站无法控制的原因使E-AI系统崩溃或无法正常使用导致网上交易无法完成或丢失有关的信息、记录等，英派会合理地尽力协助处理善后事宜。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">4.4</span>
                <span style="font-family:宋体; font-size:10.5pt">英派所有信息仅供参考，不做个别诊断、用药和使用的根据。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">英派致力于提供正确、完整的肿瘤健康资讯，但不保证信息的正确性和完整性，且不对因信息的不正确或遗漏导致的任何损失或损害承担责任。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">英派所提供的任何医疗信息，仅供参考，不能替代医师和其他医务人员的建议，如自行使用E-AI中资料发生偏差，英派概不负责，亦不负任何法律责任。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">4.5 </span>
                <span style="font-family:宋体; font-size:10.5pt">是否采用E-AI的医师意见为提问者个人行为，英派不承担任何可能产生的责任。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">4.6 </span>
                <span style="font-family:宋体; font-size:10.5pt">英派保留对本协议作出不定时修改的权利。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">第</span>
                <span style="font-family:Calibri; font-size:10.5pt; font-weight:bold">5</span>
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">条 服务中E-AI与用户双方的权利及义务</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">5.1 </span>
                <span style="font-family:宋体; font-size:10.5pt">E-AI有义务在现有技术上维护平台服务的正常进行，并努力提升技术及改进技术，使网站服务更好进行。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">5.2 </span>
                <span style="font-family:宋体; font-size:10.5pt">对于用户在E-AI预定服务中的不当行为或其它任何E-AI认为应当终止服务的情况，E-AI有权随时作出删除相关信息、终止服务提供等处理，而无须征得用户的同意。E-AI有权根据不同情况选择保留或删除相关信息或继续、停止对该用户提供服务，并追究相关法律责任。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">5.3 </span>
                <span style="font-family:宋体; font-size:10.5pt">服务双方因服务引起的纠纷，请E-AI给予调解的，E-AI将有权了解相关信息，并将双方提供的信息与对方沟通。因在E-AI上发生服务纠纷，引起诉讼的，用户通过司法部门或行政部门依照法定程序要求E-AI提供相关数据，E-AI应积极配合并提供有关资料。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">5.4 </span>
                <span style="font-family:宋体; font-size:10.5pt">滇E-AI有权对用户的注册数据及服务的行为进行查阅，发现注册数据或服务行为中存在任何问题或怀疑，均有权向用户发出询问及要求改正的通知或者直接作出删除等处理。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">5.5 </span>
                <span style="font-family:宋体; font-size:10.5pt">当用户顺利使用完付费服务后不得因为服务中的内容不满意要求退款。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">用户对服务内容不满意，可以向E-AI提出投诉，E-AI有义务依据情况协调沟通，维护医师和用户关系和谐。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">5.6 </span>
                <span style="font-family:宋体; font-size:10.5pt">系统因下列状况无法正常运作，使用户无法使用服务时，英派不承担损害赔偿责任，该状况包括但不限于：</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">（</span>
                <span style="font-family:Calibri; font-size:10.5pt">1</span>
                <span style="font-family:宋体; font-size:10.5pt">）E-AI在系统停机维护期间；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">（</span>
                <span style="font-family:Calibri; font-size:10.5pt">2</span>
                <span style="font-family:宋体; font-size:10.5pt">）电信设备出现故障不能进行数据传输的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">（</span>
                <span style="font-family:Calibri; font-size:10.5pt">3</span>
                <span style="font-family:宋体; font-size:10.5pt">）因台风、地震、海啸、洪水、停电、战争、恐怖袭击等不可抗力之因素，造成系统障碍不能执行业务的；</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">（</span>
                <span style="font-family:Calibri; font-size:10.5pt">4</span>
                <span style="font-family:宋体; font-size:10.5pt">）由于黑客攻击、电信部门技术调整或故障、银行方面的问题等原因而造成的服务中断或者延迟。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">第</span>
                <span style="font-family:Calibri; font-size:10.5pt; font-weight:bold">6</span>
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">条 协议更新及用户关注义务</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">根据国家法律法规变化及网络运营需要，E-AI有权对本协议条款不时地进行修改，修改后的协议一旦被张贴在E-AI上即生效，并代替原来的协议。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">用户可随时登陆查阅最新协议；用户有义务不时关注并阅读最新版的协议及平台或客户端公告。如用户不同意更新后的协议，可以且应立即停止接受E-AI依据本协议提供的服务；如用户继续使用E-AI提供的服务，即视为同意更新后的协议。E-AI建议您在使用E-AI之前阅读本协议及E-AI的公告。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">第</span>
                <span style="font-family:Calibri; font-size:10.5pt; font-weight:bold">7</span>
                <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">条 法律管辖和适用</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:宋体; font-size:10.5pt">本协议的订立、执行和解释及争议的解决均应适用在中华人民共和国大陆地区适用之有效法律（但不包括其冲突法规则）。如发生本协议与适用之法律相抵触时，则这些条款将完全按法律规定重新解释，而其它有效条款继续有效。如缔约方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决。</span>
            </p>
            <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:Calibri; font-size:10.5pt">&nbsp;</span>
            </p>
        </div>`
}

export default {
	data() {
        return {
            dataList: [], firstLoaded: false,
            param: { id: '', name: '', content: '' }
        }
	},
    onLoad(options) {
        console.log('onLoad：', options);
        uni.setNavigationBarTitle({ title: options.name });
        this.param = { 
            id: '', 
            name: options.name, 
            content: options.type?content[options.type]:'' 
        }
        setTimeout(()=>{
            this.firstLoaded = true;
        }, 2750)
    },
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh()
            // this.$refs.paging.complete([])
            this.firstLoaded = true;
            uni.hideLoading();
		}
    }
}
</script>

<style scoped lang="scss">
	.pubArticleDetail {
		padding: 20rpx;
		.detail {
			background: #fff;
			padding: 25rpx 30rpx;
			color: #333;
			font-size: 28rpx;
			line-height: 58rpx;
            min-height: 70vh;
		}
	}
</style>
