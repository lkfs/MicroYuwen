<?php


namespace App\Repositories;

use App\Models\MNewWord;
use App\Models\MWordGroup;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use stdClass;

/**
 * 词组
 * @package App\Repositories
 */
class WordGroupV2Repository extends BaseRepository
{
    private $splitServer = array('114.67.84.223', '120.26.6.172', '116.196.101.207');
    private $splitIndex = 0;

    private $content = <<<eof
千门万户 歪歪扭扭 高高兴兴 漂漂亮亮 兴致勃勃 莺歌燕舞 自言自语 东张西望 万紫千红 鸟语花香 和风细雨 取人之长补己之短 夕发朝至 齐心合力 层林尽染 叠翠流金 春华秋实 绿树成荫 川流不息 不约而同 尺有所短 寸有所长 相得益彰 管中窥豹 坐井观天 一叶障目 不见泰山 拔苗助长 徒劳无功 瓜熟蒂落 水到渠成 无影无踪 迫不及待 一本正经 六神无主 七嘴八舌 八仙过海 九牛一毛 十全十美 吞吞吐吐 议论纷纷 叫苦连天 雪中送炭 指手画脚 后羿射日 精卫填海 嫦娥奔月 女娲补天 引人注目 遮遮掩掩 倾盆大雨 四面八方 冷冷清清 隐隐约约 五光十色 笑容满面 金碧辉煌 焕然一新 绚丽多彩 光彩夺目 从天而降 五颜六色 能工巧匠 冥思苦想 刨根问底 浓墨涂抹 栩栩如生 风和日丽 目不转睛 揠苗助长 筋疲力尽 守株待兔 同心协力 众志成城 万众一心 战无不胜 天外有天 博采众长 多多益善 贪小失大 舍本逐末 轻重倒置 小题大做 书读百遍其义自见 恍然大悟 万马奔腾 满载而归 闻鸡起舞 翻来覆去 翩翩起舞 大惊失色 垂头丧气 五彩缤纷 争奇斗艳 昙花一现 千里迢迢 不紧不慢 风餐露宿 风尘仆仆 奔流不息 舍近求远 头重脚轻 异口同声 左邻右舍 里应外合 成群结队 琳琅满目 应有尽有 物美价廉 一应俱全 举世闻名 五洲四海 山重水复 柳暗花明 合二为一 大显神威 庞然大物 相提并论 没精打采 无精打采 灰心丧气 千里之行始于足下 百尺竿头更进一步 耳听为虚眼见为实 人无完人金无足赤 刻舟求剑 不假思索 兴高采烈 沉默不语 如愿以偿 彬彬有礼 恋恋不舍 日夜兼程 高楼大厦 糊里糊涂 摇头晃脑 鸦雀无声 一字不漏 不知不觉 翩翩起舞 活蹦乱跳 惊叹不已 群芳吐艳 落英缤纷 郁郁葱葱 喷薄欲出 旭日东升 夕阳西下 皓月当空 崇山峻岭 悬崖峭壁 层峦叠翠 苍翠欲滴 生花妙笔 饥寒交迫 应有尽有 沉默不语 亡羊补牢 南辕北辙 惊弓之鸟 和颜悦色 连绵起伏 买椟还珠 光阴似箭 日月如梭 诚心诚意 脱口而出 博览群书 孜孜不倦 勤学好问 学而不厌 业精于勤 专心致志 聚精会神 废寝忘食 竭尽全力 脚踏实地 开门见山 大材小用 小题大做 百发百中 异口同声 神气十足 左顾右盼 寂然无声 迫在眉睫 喜出望外 如愿以偿 蹑手蹑脚 寸草不生 目不转睛 恋恋不舍 无影无踪 荒无人烟 身无分文 趔趔趄趄 名不虚传 游人如织 琳琅满目 栩栩如生 爱不释手 语无伦次 交口称赞 下落不明 闻名遐迩 历历在目 面面俱到 头头是道 源源不断 彬彬有礼 息息相关 蒸蒸日上 津津有味 滔滔不绝 心灵手巧 人烟稀少 提心吊胆 面如土色 欢歌笑语 熊熊大火 夸父逐日 四面八方 人山人海 惟妙惟肖 零零星星 大惊小怪 画龙点睛 赞不绝口 美中不足 风雨交加 腾云驾雾 垂头丧气 妙不可言 气焰嚣张 争分夺秒 横行霸道 拍手称快 同归于尽 奔走相告 喜气洋洋 痛改前非 若隐若现 人声鼎沸 水天相接 齐头并进 浩浩荡荡 山崩地裂 风号浪吼 汹涌澎湃 咫尺为邻 不容置疑 千姿百态 神来之笔 人迹罕至 涓涓细流 应接不暇 恍恍惚惚 神秘莫测 随遇而安 坐卧不安 不可思议 枉费心机 浩如烟海 胸有成竹 家喻户晓 妇孺皆知 呲牙咧嘴 嘟嘟囔囔 左顾右盼 大模大样 一丝不苟 从容不迫 扬长而去 空空如也 不胜其烦 慢条斯理 无忧无虑 耀武扬威 偷偷摸摸 生气勃勃 跃然纸上 颤颤巍巍 如怨如诉 趁其不备 变化多端 局促不安 望子成龙 来龙去脉 群龙无首 龙飞凤舞 如虎添翼 调虎离山 骑虎难下 照猫画虎 天马行空 汗马功劳 马到成功 老马识途 牛刀小试 小试牛刀 笨鸟先飞 呆若木鸡 胆小如鼠 不以为然 打躬作揖 目瞪口呆 崇山峻岭 神清气爽 所向披靡 昂首挺胸 神态自若 久经沙场 整装待发 跃跃欲试 颔首低眉 惟妙惟肖 流连忘返 曲径通幽 突如其来 屏息凝神 号啕大哭 饶有兴趣 杏林春满 誉满杏林 疑惑不解 衣衫褴褛 得意洋洋 铿锵有力 莫名其妙 受益匪浅 形单影只 年逾古稀 古稀之年 灯红酒绿 腾云驾雾 欣喜若狂 画龙点睛 点睛之笔 茹毛饮血 毋庸置疑 用武之地 呼风唤雨 出乎意料 无可奈何 迥然不同 气势磅礴 虎背熊腰 纤尘不染 比比皆是 名副其实 烟熏火燎 战火纷飞 不露声色 大名鼎鼎 名不见经传 一举成名 赞叹不已 波澜壮阔 拔地而起 斑斑点点 重重叠叠 星罗棋布 梦寐以求 闷闷不乐 走街串巷 疲惫不堪 狼吞虎咽 骨瘦如柴 将心比心 言而有信 己所不欲，勿施于人 精诚所至，金石为开 争先恐后 若无其事 见死不救 鱼贯而出 愚不可及 气喘吁吁 响彻云霄 叫苦不迭 不折不扣 横七竖八 异想天开 轻而易举 垂头丧气 不慌不忙 聚精会神 不速之客 知己知彼，百战百胜 运筹帷幄，决胜千里 出其不意，攻其不备 围魏救赵，声东击西 四面楚歌 腹背受敌 草木皆兵 所向无敌 兵贵神速 神出鬼没 风声鹤唳 枝繁叶茂 磕磕绊绊 凹凸不平 栩栩如生 热泪盈眶 与世长辞 重见天日 夺眶而出 改天换地 傲然挺立 神气十足 前赴后继 手不释卷 头头是道 悠然自得 默默无言 万紫千红 当之无愧 纵横交错 此起彼落 胆大妄为 全神贯注 莫名其妙 拍手叫好 赏心悦目 融为一体 雄心壮志 坚定不移 坚忍不拔 自强不息 聚沙成塔 集腋成裘 持之以恒 全力以赴 知难而进 无坚不摧 知难而退 碌碌无为 一曝十寒 寸进尺退 有始无终 半途而废 鹏程万里 纪昌学射 百发百中 无能为力 气急败坏 笑逐颜开 无恶不作 荣华富贵 恩将仇报 灵机一动 寝食不安 杳无音信 泪如泉涌 情不自禁 举目四望 饥肠辘辘 依依不舍 绿林好汉 滚瓜烂熟 毫不犹豫 津津有味 天长日久 如醉如痴 浮想联翩 囫囵吞枣 不求甚解 悲欢离合 如饥似渴 不言而喻 黯然神伤 千篇一律 别出心裁 与众不同 大显身手 呕心沥血 心安理得 念念不忘 开卷有益 颇负盛名 顶天立地 指指点点 日出而作，日落而息 守望相助 安然无恙 藕断丝连 庞然大物 气象万千 小心翼翼 不容置辩 大喜过望 源源不断 络绎不绝 不动声色 心灵手巧 发人深思 水滴石穿 绳锯木断 七嘴八舌 井然有序 恭恭敬敬 付之东流 盖世无双 抑扬顿挫 古色古香 肃然起敬 无穷无尽 失魂落魄 震耳欲聋 万水千山 失声痛哭 一如既往 喋喋不休 雪上加霜 按图索骥 来日方长 忐忑不安 毫无疑义 聊胜于无 淡泊明志，宁静致远 不可估量 众星拱月 玲珑剔透 诗情画意 奇珍异宝 满腔怒火 斩钉截铁 坚强不屈 气壮山河 同仇敌忾 临危不惧 勇往直前 前仆后继 力挽狂澜 中流砥柱 大义凛然 不屈不挠 披荆斩棘 奋发图强 励精图治 任重道远 再接再厉 排山倒海 马革裹尸 夜以继日 大公无私 响遏行云 腾空而起 生生不息 名门望族 瞻前顾后 充耳不闻 无动于衷 正襟危坐 不苟言笑 声名远扬 窃窃私语 纷纷扬扬 一碧千里 不计其数 美轮美奂 投笔从戎 严阵以待 斗志昂扬 七零八落 不翼而飞 劈头盖脸 杯水车薪 始料不及 废寝忘食 遥遥在望 急中生智 不声不响 马马虎虎 绞尽脑汁 默不作声 不怀好意 一动不动 面不改色 完好无损 能言善辩 喃喃自语 不动声色 了如指掌 安居乐业 不惜代价 同归于尽 喜出望外 三长两短 奄奄一息 势不可当 势不可挡 跌跌撞撞 生死关头 舍己为人 辛辛苦苦 一声不吭 程门立雪 理直气壮 完璧归赵 负荆请罪 神机妙算 三顾茅庐 踉踉跄跄 拖男挈女 喜不自胜 天造地设 伸头缩颈 抓耳挠腮 拱伏无违 自有妙用 平安无事 故伎重演 按兵不动 心急如焚 不能自拔 一落千丈 铤而走险 良药苦口 忠言逆耳 人才辈出 手疾眼快 精神抖擞 仰面朝天 敛声屏气 半信半疑 天衣无缝 妙不可言 淋漓尽致 文质彬彬 仪表堂堂 虎背熊腰 身强力壮 神采奕奕 满面春风 目瞪口呆 健步如飞 活蹦乱跳 大摇大摆 点头哈腰 低声细语 巧舌如簧 娓娓动听 语重心长 入木三分 莞尔一笑 花团锦簇 姹紫嫣红 应接不暇 耐人寻味 手忙脚乱 水天一色 熟视无睹 冲锋陷阵 以一当十 彬彬有礼 翩翩起舞 摇头晃脑 色彩斑斓 繁花似锦 含情脉脉 目不暇接 取之不尽，用之不竭 融为一体 多姿多彩 大饱眼福 息息相关 无与伦比 鹤立鸡群 叹为观止 呲牙咧嘴 讨价还价 风烛残年 神态自若 三言两语 和颜悦色 冰天雪地 不约而同 笑容可掬 旁若无人 别出心裁 德高望重 津津乐道 熙熙攘攘 意味深长 大街小巷 望而生畏 不拘一格 旁逸斜出 亭亭玉立 窈窕淑女 年过花甲 返璞归真 别有深意 行色匆匆 左冲右撞 名噪一时 悬崖峭壁 食不下咽 寝不安席 思潮起伏 可见一斑 魂牵梦萦 碧空如洗 波涛起伏 百折不回 顶天立地 蹒跚学步 大江南北 长风破浪 水落石出 牙牙学语 汹涌澎湃 干干净净 心惊肉跳 忐忑不安 流连忘返 身无分文 溜之大吉 刻骨铭心 十指连心 怒目圆睁 不由分说 蹑手蹑脚 尽心尽力 无法割舍 无所不知 从未谋面 自作自受 大吃一惊 和蔼可亲 苟延残喘 面目全非 罪魁祸首 风雨同舟 三番五次 一命呜呼 敌众我寡 竭泽而渔 论功行赏 囫囵吞枣 张冠李戴 饱经风霜 模模糊糊 三更半夜 跃然纸上 谋财害命 哄堂大笑 五花八门 若隐若现 姗姗来迟 逸闻趣事 略胜一筹 有声有色 不甘落后 千方百计 哭笑不得 威风凛凛 悠哉游哉 漫不经心 久别重逢 泣不成声 日落西山 震耳欲聋 炯炯有神 长途跋涉 横遭不幸 引人入胜 享有盛誉 高山流水 波涛汹涌 举足轻重 回味无穷 百看不厌 有朝一日 转瞬即逝 不解之缘 暗无天日 兴味盎然 为所欲为 目不忍视 雕梁画栋 巧夺天工 独具匠心 余音绕梁 不落窠臼 雅俗共赏 美不胜收 脍炙人口 曲高和寡 妙笔生花 阳春白雪 笔走龙蛇 不同凡响 别具一格 高不可攀 盛气凌人 万古长青 兴国安邦 一声不响 疲倦不堪 郁郁葱葱 心旷神怡 一针见血 从容镇定 一声不吭 无动于衷 虎视眈眈 专心致志 莫名其妙 无缘无故 勃勃生机 座无虚席 不知所措 各有所长 养尊处优 一鼓作气 邯郸学步 跋山涉水 手足无措 绚丽多姿 万象更新 万不得已 截然不同 张灯结彩 热气腾腾 悠悠扬扬 开山鼻祖 两面三刀 青面獠牙 安然无恙 秩序井然 遮天盖地 蜂拥而至 喜气洋洋 载歌载舞 郑重其事 知足安命 聊以自慰 臭味相投 无依无靠 游手好闲 荒无人烟 无拘无束 落荒而逃 鱼贯而入 东窜西走 惊弓之鸟 软弱无力 费尽口舌 荒唐离奇 卧床不起 衣衫褴褛 滔滔不绝 闻所未闻 与世隔绝 有血有肉 济济一堂 匆匆忙忙 果不其然 人声鼎沸 肃然无声 顺藤摸瓜 卓有成效 严于律己 公正不阿 鲲鹏展翅 九天揽月 夜以继日 积劳成疾 风华正茂 猝然长逝 锲而不舍 司空见惯 追根求源 无独有偶 打破沙锅问到底 见微知著 出人意料 侃侃而谈 深信不疑 想方设法 饶有趣味 百炼成钢 奋发图强 坚持不懈 迎难而上 集思广益 群策群力 革故鼎新 标新立异 独出心裁 举一反三 实事求是 各抒己见 不耻下问 触类旁通 精益求精 古为今用 舍本逐末 细枝末节 图文并茂 桃李满门 娓娓动听 身临其境 戛然而止 十年树木，百年树人 前仰后合 诲人不倦 热火朝天 琳琅满目 历历在目 流光溢彩 置之不理 奇花异草 秉烛夜游 三年五载 惊涛骇浪 望子成龙 龙腾虎跃 生龙活虎 龙凤呈祥 举世瞩目 扭转乾坤 前俯后仰 开门见山 一五一十
eof;


    public function make()
    {

        $content = explode(' ', $this->content);
        foreach ($content as $item){
            $found = MWordGroup::where("word_group", $item)->first();
            if(!$found){
                $wordGroup = new MWordGroup();
                $wordGroup->word_group = $item;
                $wordGroup->save();
            }
        }
        return;
        $newWords = MNewWord::orderBy('grade')
            ->where('word_id', '>=', 681)
            ->orderBy('term')//->limit(10)
            ->get();
        $newWords->each(function ($newWord, $key) {
            Log::info('word = ' . $newWord->word);
            $wordGroups = $this->searchWordGroup($newWord->word);
            if ($wordGroups) {
                $wordGroups = collect($wordGroups);
                $wordGroups->filter(function ($wordGroup, $key) use ($newWord) {
                    return strpos($wordGroup, $newWord->word);
                })->each(function ($wordGroup, $key) {
                    MWordGroup::where('word_group', $wordGroup)->delete();

                    $newWordGroup = new MWordGroup();
                    $newWordGroup->word_group = $wordGroup;
                    list($grade, $term) = $this->computeGradeAndTerm($wordGroup);
                    $newWordGroup->grade = $grade;
                    $newWordGroup->term = $term;
                    $newWordGroup->save();
                });
                sleep(5);
            }
        });
        return 'success';
    }

    private function computeGradeAndTerm($wordGroup)
    {
        $pattern = '/[\x{4e00}-\x{9fa5}]/u';
        $grade = -1;
        $term = -1;
        if (preg_match_all($pattern, $wordGroup, $matches)) {
            Log::info('$matches  =' . json_encode($matches));
            $newWords = collect($matches[0]);
            $newWords->each(function ($item, $key) use (&$grade, &$term, $wordGroup) {
                $newWord = MNewWord::where('word', $item)
                    ->first();
                if ($newWord) {
                    if (($grade * 10 + $term) < ($newWord->grade * 10 + $newWord->term)) {
                        $grade = $newWord->grade;
                        $term = $newWord->term;
                    }
                } else {
                    Log::info('生僻字 = ' . $wordGroup);
                    $grade = 9;
                    $term = 9;
                }
            });
        }
        return array($grade, $term);
    }

    //调用梁斌分词，过滤乱七八糟的词组
    private function checkWord($words)
    {
        Log::info('fenci = ' . implode(',', $words));
        $client = new Client([
            'base_uri' => 'http://api.pullword.com/',
            'timeout' => 5.0,
        ]);
        $url = 'http://' . $this->splitServer[$this->splitIndex++] . '/get.php?source=' . urlencode(implode(',', $words)) . ' &param1=0.5&param2=0';
        if ($this->splitIndex >= 3) $this->splitIndex = 0;
        try {
            $response = $client->request('GET', $url);
            $code = $response->getStatusCode();
            if ($code == 200) {
                $body = $response->getBody();
                $pattern = '/[\x{4e00}-\x{9fa5}].*/u';
                if (preg_match_all($pattern, $body, $matches)) {
                    return $matches[0];
                }
                return null;
            }
        } catch (Exception $e) {
            Log::info('sleep 60 seconds');
            sleep(60);
            return $this->checkWord($words);
        }
    }

    //调用百度汉语，查找词组
    private function searchWordGroup($word)
    {
        Log::info('baidu = ' . $word);
        $client = new Client([
            'base_uri' => 'https://hanyu.baidu.com',
            'timeout' => 5.0,
        ]);
        $url = 'https://hanyu.baidu.com/s?wd=' . urlencode($word) . '&from=zici';
        try {
            $response = $client->request('GET', $url);
            $code = $response->getStatusCode();
            if ($code == 200) {
                $body = $response->getBody();
                $pinyinPattern = '/<a href=".*ptype=term">([\x{4e00}-\x{9fa5}].*)<\/a>/u';
                if (preg_match_all($pinyinPattern, $body, $matches)) {
                    return $this->checkWord($matches[1]);
                }
                return null;
            } else {
                throw new Exception('$word = ' . $word . ' error, $code = ' . $code);
            }
        } catch (Exception $e) {
            Log::info('sleep 60 seconds for baidu');
            sleep(60);
            return $this->searchWordGroup($word);
        }
    }

    /**
     * 词组拆分为单字，便于拼音标注
     */
    public function split()
    {
        $pattern = '/[\x{4e00}-\x{9fa5}]/u';
        $newWords = MNewWord::orderBy('grade')
            ->orderBy('term')
            ->get();
        $wordGroups = MWordGroup::orderBy('grade')
            ->orderBy('term')
            ->get();
        $wordGroups->each(function ($item, $key) use ($pattern, $newWords){
            if (preg_match_all($pattern, $item->word_group, $matches)) {
                $split_json = array();
                foreach ($matches[0] as $word){
                    $new_word = $newWords->where('word', $word)->first();
                    $split_json[$word] = array(
                        'grade'=>$new_word->grade,
                        'term'=>$new_word->term,
                        'pinyin'=>$new_word->pinyin,
                    );
                }
                Log::info(json_encode($split_json));
                MWordGroup::where('word_group', $item->word_group)
                    ->update(
                        array('split_json'=>json_encode($split_json))
                    );
            }
        });

    }

    public function replace($raw_word_group, $new_word_group){
        MWordGroup::where('word_group', 'like', $raw_word_group.'%')
            ->update(
                array('word_group'=>$new_word_group)
            );
    }

}
