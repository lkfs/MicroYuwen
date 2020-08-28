<?php


namespace App\Repositories;

use App\Models\MNewWord;
use App\Models\MWordGroup;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

/**
 * 词组
 * @package App\Repositories
 */
class WordGroupV3Repository extends BaseRepository
{
    private $splitServer = array('114.67.84.223', '120.26.6.172', '116.196.101.207');
    private $splitIndex = 0;

    private $content = <<<eof
挨：āi;挨次、挨近、挨个、挨门挨户
挨：ái;挨时间、挨打
扒：bā;扒土、扒开、扒下来、
扒：pá;扒手、扒搂、扒犁、扒拉
把：bǎ;把关、把柄、把持、把握、把兄、
把：bà;掸子把儿、缸子把儿、花把、刀把
背：bèi;背包、手背、背光、背篼、背运、
背：bēi;背负、背榜、背债、背起、背黑锅
膀：bǎng;膀阔腰圆、膀子、臂膀
膀：páng;膀胱
剥：bō;剥削、剥夺
剥：bāo;剥皮、剥花生
薄：bó;薄技、单薄、淡薄、淡泊、刻薄
薄：bò;薄荷
薄：báo;薄板、薄片、薄饼、薄脆、变薄
刨：bào;刨冰、平刨、糟刨、刨床、刨花、刨刀
刨：páo;刨土、刨坑、刨根究底
暴：bào;暴露、暴病、暴动、暴戾、暴戾
暴：pù;一暴十寒
奔：bēn;奔丧、狂奔、奔驶、奔突、奔忙
奔：bèn;投奔、奔命、奔头
秘：bì;秘鲁、便秘
秘：mì;秘密
便：biàn;便秘、便当、便装、便捷、便饭
便：pián;大腹便便、便宜
别：bié;告别、姓别、别出心裁、别致
别：biè;闹别、别扭
屏：bǐng;屏除、屏气、屏息、屏弃
屏：píng;屏风、屏障、屏蔽、屏幕
颤：chàn;颤动、颤抖、颤音、颤悠
颤：zhàn;颤栗
长：cháng;特长、取长补短、决非长策、
长：zhǎng;师长、首长、长膘、长脸、长亲、长相
场：chǎng;场所、场合、场景、操场、逢场作戏
场：cháng;场院、外场、赶场
参：cān;参考、参拜、参订、
参：cēn;参差不齐、纵横参错
参：shēn;人参、海参
曾：céng;曾经、未曾、曾几何时、曾经沧海
曾：zēng;曾孙、曾祖、姓曾
差：chā;差错、差别、差额、差价、差距、
差：chà;差劲、差不多
差：chāi;差遣、差使、差事、差役、出差
处：chǔ;处分、处理、相处、处方、处罚
处：chù;住处、处所、长处、处长、原处、处署
刹：chà;古刹、刹那间
刹：shā;刹车、刹住歪风
称：chēng;称呼、称号、
称：chèn;称身、称愿、称职、称心如意
藏：cáng;包藏、藏匿、躲藏
藏：zàng;西藏、宝藏、藏青、
重：chóng;重逢、重播、重庆
重：zhòng;重办、重创、重读
传：chuán;师传、传递、传承、传颂、
传：zhuàn;经传、传记、列传、别传
蓄：chù;牲畜、畜生
蓄：xù;畜牧、畜养
答：dá;报答、答谢、答案、答辩、答对
答：dā;答理、答应、答言、答讪
大：dà;大度、大小、大器晚成、大相径庭、
大：dài;大王、大夫
呆：dāi;发呆、目瞪口呆、呆若木鸡、呆头呆脑
呆：ái;呆板
担：dān;担保、担心、负担、承担、分担、
担：dàn;担子、担柴、勇挑重担
弹：dàn;子弹、炮弹、弹弓、中弹、弹壳
弹：tán;弹琴、弹力、弹劾、弹簧
当：dāng;应当、当然、相当、当面、当初
当：dàng;当真、恰当、得当、妥当
都：dū;都城、都市、都督
都：doū;全都、都好
斗：dǒu;斗胆、斗笔、斗笠、斗门、斗室、
斗：dòu;械斗、斗殴、斗气、斗嘴、斗争
倒：dǎo;摔倒、倒闭、倒班、倒手
倒：dào;倒影、倒车、倒彩、倒刺、倒立
得：dé;得体、得便、得陇望蜀、得其所哉、
得：děi;得亏、需得、不得
得：de;跑得飞快
的：dí;的确、的士
的：dì;目的、有的放矢、众矢之的
的：de;漂亮的）
调：diào;调包、调度、
调：tiáo;调戏、调拨、调整、调和、调皮、
肚：dǔ;羊肚儿、拌肚丝
肚：dù;肚子、肚皮、肚量、肚脐
度：dù;度量、气度、度假、度日如年
度：duó;揣度、审时度势
恶：è;恶棍、罪恶、恶劣、恶行、恶习
恶：ě;恶心
恶：wù;可恶、厌恶、好逸恶劳
发：fā;发现、蒸发、发黄、发愁、发难
发：fà;头发、发妻、洗发水
佛：fó;念佛、佛法、如来佛、佛爷
佛：fú;仿佛
分：fēn;分析、分辨、分娩、分泌、分母
分：fèn;分内、分外、分量、过分
缝：féng;缝补、缝合、缝纫
缝：fèng;裂缝、门缝、缝隙、见缝插针
干：gān;干瘪、干旱、干涸、
干：gàn;骨干、干练、干将、才干
杆：gǎn;枪杆、笔杆、杆秤、杆菌、笔杆子
杆：gān;旗杆
冈：gǎng;岗哨、岗楼、岗亭、岗位
冈：gāng;山冈、景阳冈
冠：guān;衣冠楚楚、怒发冲冠、冠冕堂皇
冠：guàn;冠军、夺冠
更：gēng;变更、更改、打更、更新、更夫
更：gèng;更加、更好、更上一层楼
供：gong;供认、供词、供奉、供职、供状、供品
供：gōng;供销、供应、供不应求、供给
骨：gǔ;骨气、骨干、奴颜媚骨、仙风道骨
骨：gú;骨头、骨节、懒骨头、硬骨头
汗：hàn;流汗、汗腺、汗颜、汗斑
汗：hán;可汗
号：hào;符号、口号、商号、称号、号角、
号：háo;哀号、呼号、号丧、号啕、怒号、号啕大哭
好：hǎo;友好、好歹、好意、好转、好处chu
好：hào;嗜好、好客、好强、好胜
喝：hè;吆喝、喝彩、喝道、喝令、喝问
喝：hē;喝西北风、喝水
会：huì;会诊、会审、会客、开会、都会
会：kuài;会计
华：huā;奢华、华发、华裔、华胄、华表、
华：huà;华山
划：huà;划款、划款、筹划、策划、划拨
划：huá;划船、划拳、划桨、划算、划不着
和：hé;和睦、和气、温和、媾和、柔和
和：hè;唱和、奉和、随声附和、曲高和寡
和：huó;和泥、和面
和：huò;和弄、和药、和稀泥
和：hú;和了
横：héng;横竖、横幅、横亘、横心、横行
横：hèng;蛮横、强横、横财、横死、横祸
哄：hōng;哄动、哄传、哄然、哄抬、哄堂大笑
哄：hǒng;哄骗、哄弄
哄：hòng;起哄、一哄而散
晃：huàng;晃动、晃县、摇晃、晃悠you
晃：huǎng;虚晃一刀、一晃、晃得睁不开眼
荷：hè;荷锄、荷重、重荷、感荷、为荷、荷枪实弹
荷：hé;荷兰、荷花、荷包、荷尔蒙
还：huán;还乡、还俗、偿还、还手、
还：hái;副词，还是、还想
几：jī;几乎、茶几、几案、几率、窗明几净
几：jǐ;几个、几时、几曾、几多、几何
系：xì;直系、维系、系恋、系狱、系缚
系：jì;系上、系鞋带、系围裙
夹：jiā;夹子、夹杂、夹板、夹层、夹道、
夹：jiá;夹袄、夹被
夹：gā;夹肢窝
假：jiǎ;假如、假象、假座、假惺惺、不假思索
假：jià;请假、暑假、假期、假日、假条
间：jiān;田间、中间、夜间、车间、间距
间：jiàn;间谍、间接、间隔、间道、间断
见：jiàn;见长、见地、见教、姓见、见机
见：xiàn;风吹草低见牛羊
将：jiāng;将息、将次、姓将、将军、将养、
将：jiàng;少将、将才、将官、将领、将令、
将：qiāng;将进酒
劲：jìng;劲旅、强劲、刚劲、劲敌、
劲：jìn;干劲、没劲、用劲、劲头、鼓足干劲
结：jiē;结巴、结实
结：jié;结仇、结拜、结案、结存、结发、集结
禁：jìn;禁止、犯禁、监禁、禁锢、违禁、
禁：jīn;禁受、不禁、禁得起、禁不住、仅仅
尽：jǐn;尽管、尽快、尽量、尽早、
尽：jìn;尽力、尽情、尽量
给：jǐ;供给、补给、配给、给付、给水、
给：gěi;送给、给以、给面子
教：jiào;教育、教导、教诲、姓教、
教：jiāo;教书、教给、教学
解：jiě;瓦解、难解难分、解渴、解剖、
解：jiè;押解、解元、解差、起解、解送、
解：xiè;解数、姓解、解池
降：jiàng;降临、降幂mì、降价
降：xiáng;降表、降伏、降龙伏虎、降顺
角：jiǎo;牛角、号角、菱角、墙角、勾心斗角
角：jué;角斗、口角、主角、配角、名角、
觉：jué;觉醒、觉察、觉悟、觉得、听觉
觉：jiào;睡觉;
看：kān;看守、看管
看：kàn;看待、看茶
壳：ké;贝壳、;脑壳
壳：qiào;地壳、甲壳
空：kōng;领空、空洞
空：kòng;空白、空闲
eof;

    //多音字入库
    public function muti_input(){
        $multi = explode("\n", $this->content);
        foreach ($multi as $rowraw){
            $row = explode(";", $rowraw);
            $word = $row[0];
            $group = $row[1];
            $word = explode("：",$word);
            $group = explode("、",$group);
            //生字入库
            $newWord = MNewWord::where('word',$word[0])
                ->where('pinyin',$word[1])
                ->first();
            echo $word[0].'-'.$word[1]."\n";
            if($newWord==null){
                $newWord = new MNewWord();
                $newWord->word = $word[0];
                $newWord->pinyin = $word[1];
            }
            $newWord->multi_flag =1;
            $newWord->save();
            //单词入库

            //dd([$word, $group]);
        }
        //dd($multi);
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
        if (is_array($words)) $words = implode(',', $words);

        Log::info('fenci = ' . $words);
        $client = new Client([
            'base_uri' => 'http://api.pullword.com/',
            'timeout' => 5.0,
        ]);
        $url = 'http://' . $this->splitServer[$this->splitIndex++] . '/get.php?source=' . urlencode($words) . ' &param1=0.8&param2=0';
        if ($this->splitIndex >= 3) $this->splitIndex = 0;
        try {
            $response = $client->request('GET', $url);
            $code = $response->getStatusCode();
            if ($code == 200) {
                $body = $response->getBody();
                $pattern = '/[\x{4e00}-\x{9fa5}].*/u';
                if (preg_match_all($pattern, $body, $matches)) {
                    $result = $matches[0];
                    foreach ($result as $key => $item) {
                        $result[$key] = str_replace("\r", "", $item);

                    }
                    return $result;
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
        $wordGroups->each(function ($item, $key) use ($pattern, $newWords) {
            if (preg_match_all($pattern, $item->word_group, $matches)) {
                $pinyin_flag = 1; //0：未完整注音；1：完整注音
                foreach ($matches[0] as $word) {
                    $new_word = $newWords->where('word', $word)->first();
                    if($new_word){
                        $pinyin[] = $new_word->pinyin;
                    }
                    else{
                        $pinyin[] = $word;
                        $pinyin_flag = 0;
                    }
                }
                MWordGroup::where('word_group', $item->word_group)
                    ->update(
                        array(
                            'word_group' => implode(',',$matches[0] ),
                            'pinyin' => implode(',',$pinyin ),
                            'pinyin_flag'=>$pinyin_flag
                        )
                    );
                echo $item->word_group.' ok'."\n";
            }
        });

    }

}
