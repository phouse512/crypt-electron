import { assert } from 'chai';
const bigInt = require('big-integer');

import { genA, getHAMK, getk, getK, getM, getS, getu} from './srp';
import params, { hexToBigInt } from './srpParams';

const bigIntToBuffer = (num, width) => {
  const hex = num.toString(16);
  return Buffer.from(hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
};

const srpTestCases = [
  {
    B: '189262083140545621011029173565252992825161902861648496362848907250434626639347677891537815985676137224284268166784338264945112031597853565329097506663026883447823907025757364004756750139809610900860797117180439941012054132123330200714595424665762276709372813089917600850419153736186336599587502384042833427784072724643827742125465873452161677092653881802708905609891989523156821715104563686142321387155421476522531188389213060357788094335695267178974785310875290473761386542262679235203887581322265379034646645724671356724107541640585239324550053406702516132444052929649213406113148556155512251798936521051123961244',
    k: '34704849670668482647683711281700631885066964767156528400561350050202374645357',
    x: '96605723904677435393267606990100471890538533552084954682939862203822092241454',
    a: '45873659922612332313507173713043621899458142697424133141465876071684443944555',
    paramKey: '2048',
    A: '16632455044992761965593295386600020347570869472296431245527107351825708091489578939469425567458283274266561158181740193734709200288418324102659852541446088687820265684380485441595932067523631853800371628007850968538549900969340113792476990948815911503673289562918352388437014999278305054987092210698678571651531356489004796172840602014031716863741821087496631849054726295616469799168735117028945634971717317346994899599063243463030884908879138489641262125318014166104390752697868209271042002856629935565572020368113375057942708426604430274703798793246084366890900461539818021725644396779151972985569416817895456083263',
    v: '14635941060173048778656595511232629945494416248517220825970800099711551849275381489332204232865076970292734007637004602159272128774087503135843087956035477882287387736802951389924428326394018368719615747298695327395114875239450769572050779773540643079833400528898060840431174161571313783453822981493120769936043862748326146877398964316685351863951830534334598774701214887748649005442675677001657771706119164368408164359311463909059424981213589867050671837826919882312872289460449477346909577148885113845846403336552417613933239922348747430311615944444155093539516053360806727880983757162694857770682774058835103519253',
    u: '81554261337474058544831831302589800802913444197173368183958827715210115815516',
    b: '79179337791754027584153220676478511644608608060670460458572047289097548141810',
    S: '873664438876151141993728424567375209300224023025237208559968341068583094892731423853998447739648964218026690615260900342049159245646608164615098676249355097217069922171049182558305163008638017272778897056926176171197508679338761499836743870084397576760609220283185052062846361992931820502364618864275201230395850722129072436714935638465321971055685123003942251955645456947685942773690131992562558336858074599718594827313384509866922592821817161352747485189486402738174962278916641431079698536628752013617065470543659760686369339804267927990329015160434899002040279699184962929267375083996349169453227543694817911009',
    K: 'CdqRL3rlOyb1Czcx2V1eZzObSSGpky/+OaVqOd7jmYg=',
    M: 'tEqd5JeFfzgbNh/vgKZjasWBcBQDDn5wZDT4+1ZK1gs=',
    HAMK: 'cgmjw88+7ZLwRbaQ7zXshGC/y/ce3KGwleHRfYaqZSw=',
    s: 'WMQevuCi3srEq3it7WmJLIh33czi0cq//zLdNex/gak=',
    I: 'phouse512@gmail.com',
  },
  {
    B: '17172567521037072236368630140247026584350332348423853322191799639795714311585044325924009449316986597582590085226958368960987742474611443827347936996784661016417078177249483956807534268605472237973853965583924324380280780117661600020836264338526092776548428105076629952752939779495443472406081117975696666622044547524354016637363188308258814703010431272081253022850452537393571296696523390231860289376784742140543656675434030718452878242791645695744159883405319954463277563833895340979241927142375238443591409040859961865956632619235932134680349314411557588387466908356863063732091732811220933375552830970337833290375',
    k: '34704849670668482647683711281700631885066964767156528400561350050202374645357',
    x: '105476356391916133441568536936481275723421835298151033153708094451959257191319',
    a: '35385130766316435476197159084654412041666148792745120916199440722659000833127',
    paramKey: '2048',
    A: '8425887119324944916629891662866637703195045661227226481616200551009874481317557759422845477381089844094795143558857408184237138617256410263493055541174235237722911255719122519481253128547693559644346315532362107715944220793206925516438322288921601591940948865121122249531066014719681774933720795804677030074043933365152821782874894919539200960754139101092791612326768353635124092380892479848180901901610959176114975321081613212759747070909914254334565243679578943972444481314706621119986751521523168969725792426326275443883488270913079920837921204848160105138393253065250027479683506787352787051948355712760393602108',
    v: '5872311227626675844370894007737426640604184914363762350841103486178535828275253315228233176658002993993610627996755962943412086055513676541581044005365080970674678314737098698747153156566493396724100785085310028843092183749857364018181762281397403756054480221988088674492910651717642490594712142247152609343014406031066958876420104465543325083804233067969792898618055217008031463984938311150927973429264205230162486874877104796968105286184328909749841139273639891935820198184866224848250088425588899193612327859963215808679369582746755924407081388048425170427639565695291992826829675000144639263503192764735595233731',
    u: '115124779149585723401170831390742953388802262704931389936397437328887953098141',
    b: '99342576713584180657091336965664099403154688326298719536122007948323992589825',
    S: '8969955915199178283016780036946636790816840085443155736914055102703596492024399430869160335101944717797911323569690128647269625778511556967348032392735263270701892579309532759491191365765281645583523326748561994463290664459388688640390627407824952503170709649409356471316770178384330787244260946522201515957217630460173370080094726231865629576080749779429376601794771330042291076485858200496155101990510707062127352886865746351873824938366462285317460307122357054332251503826466770160368624326888767248203342579091918167484029584231535621430175740873447297857723222585782436680655217906907599016503084315515576948320',
    K: '16+wZlGMAD81h+HscaFlXwGD5U2Nq88RzjZe/zeDdvA=',
    M: 'tQJHsioKWgyeu9EEv+IVTgLa4QyLz/F2HpdOw4quIrg=',
    HAMK: 'ytUUx0nkrocJDZWbkfV1z5ezrv+mCJZI2Qb5ZzBBpu8=',
    s: 'J8FisigrnTPgreeoQdYA0bMOv/xbs/wysk1B6cAjumg=',
    I: '12@gmail.com',
  },
  // {
  //   B: '1650544630692752579176201309367697096268761475702471063091498874121032634305641600305718697943720225262845230599058377046223164444304924195823784563122404914005565344038912358613352257264283463979713525377606952952550253160297835054845911713651789549322231226128667007475766763942911830541300497896734799545113048509097810757819853074913223030140935331597886545076127871200732574955757314838978733867182736484680194975793347695711809948748353684473769743043313030823268394218772054238467274081697006230277897977161533012785648343605247629187979221635703109777123363179518381381767083351803980937048803558271985086074',
  //   k: '34704849670668482647683711281700631885066964767156528400561350050202374645357',
  //   x: '105476356391916133441568536936481275723421835298151033153708094451959257191319',
  //   a: '94394230686271977633249570293071780823207977290666209363383128181563483414577',
  //   paramKey: '2048',
  //   A: '14134382207739444287383824577244160161336596133490864789329105634370417329445559109186278345858007510726766010592688287260245535242836514870274074175429881942935497541037221190376976048777189913940332237773657769278524388361926873324930440013028214634542952567805848779796294869914181002881197267194999234462350324358913861591160116521540764369512039560814265416577976686527145514198585270119351963147727091633465220769541492959717273343671931277231950811101516353021879534905548907020704290068101486574958068046607407208283743832639845127999963618732547259890151370650101765503276434058519083867654238455696603798',
  //   v: '5872311227626675844370894007737426640604184914363762350841103486178535828275253315228233176658002993993610627996755962943412086055513676541581044005365080970674678314737098698747153156566493396724100785085310028843092183749857364018181762281397403756054480221988088674492910651717642490594712142247152609343014406031066958876420104465543325083804233067969792898618055217008031463984938311150927973429264205230162486874877104796968105286184328909749841139273639891935820198184866224848250088425588899193612327859963215808679369582746755924407081388048425170427639565695291992826829675000144639263503192764735595233731',
  //   u: '41024309802481901452737141404878012353648456491225687928671033446819888195198',
  //   b: '66882728135318499152767164911129643148139894224270155239966727881374481133259',
  //   S: '16553687709857023483779610747919676134548371724693581944075575158752507038303197003567470222992482364420290813270043167063883952036241566939096404516032501339852439817167504126576519180590717099962587426392060798203860828977817534678980888788498457527916913349044055149485293131292248184363831356572349500268971998530839057751197159361312421124050754969089163408896078610194724293917132532506998834538739999575200115478109306964463627914998842278755546973981661777650648201700864069208239033875875786174641055350662222117201785042547478577104348299111532437534546250377615556829229770353366758762179863520260179177854',
  //   K: 'gBAKddTHH73Sh7KUcXr2XZYwEho9zg+vUVK9dP0olOA=',
  //   M: 'ZpMi5yAdhSCKsE0+qihiuhSjHLE2kn1kUcabPIU76Aw=',
  //   HAMK: 'hRG1MBe0u06vydHdwi/SgfEKQDqIwfFNcOTR2lcd6es=',
  //   s: 'J8FisigrnTPgreeoQdYA0bMOv/xbs/wysk1B6cAjumg=',
  //   I: '12@gmail.com',
  // }
  {
    B: '19317326050387059618384202991414870253363506567992810207010003644071975760112880476239669062417465002244237722746144827114607897096829790450377922149973584594215154929654788249126856608344505216731734618521339317051018271594980381574294057362796099302080102992287862813370131829927657207111295866635518033978887459615273437488843217890559580220980672940183956380160050479695768486003554512295328393187254794501087557135251328710326954460036281325438168791067707100209658279577663948417743667183766459977245541902625741042333067855670188289934608902327063547623452935089866967542843731364552680065928061564775200257936',
    k: '34704849670668482647683711281700631885066964767156528400561350050202374645357',
    x: '105476356391916133441568536936481275723421835298151033153708094451959257191319',
    a: '112466640195161512682138572803334791334499445451040806376898918647650057307876',
    paramKey: '2048',
    A: '15066840135084761802416798257595041005355271391101721193462682290877728929776660117954085951985736548682259523097377440696666196698925137995834517627998998308535478137807850314483306578921544433055156894509754091503594014832576127914682913386056079111241479353631949754056207146744174846100517419907466726616545918528950528840524500463998531650740337070546555729276775979951067988005294223349415818940499238355985606570218911269775172255019699776028621797140729869410277829219934167523990815780198614584043395832731103179713796196930268411995805582439043138214081891338515582127309134751290631554741938584587856091548',
    v: '5872311227626675844370894007737426640604184914363762350841103486178535828275253315228233176658002993993610627996755962943412086055513676541581044005365080970674678314737098698747153156566493396724100785085310028843092183749857364018181762281397403756054480221988088674492910651717642490594712142247152609343014406031066958876420104465543325083804233067969792898618055217008031463984938311150927973429264205230162486874877104796968105286184328909749841139273639891935820198184866224848250088425588899193612327859963215808679369582746755924407081388048425170427639565695291992826829675000144639263503192764735595233731',
    u: '95328607547534225006107809801904799855512081874183747374866904604963899086917',
    b: '58225184923016587931797583606287810471238676571424653436848707154442565612523',
    S: '501362908583830609063559683866739196712364358554064273406145046436187789164743806960866600795794430558171124532418550715749754103707213834257304734027077444354582935069227065692642524885609428688471024911184028627439782871461314920245202038646252877940059719261614832597330911710747402023339269634921932387626758080628315784333576941865600023359648161996774934354809858410521985559342933010274293512010919993523476157956248426710547045704825136194912242088910456249113822975126985663599663009089000225223962132931255635619395203490813595815844645878710468095421807026201563985805274929800751706647791454440272865684',
    K: 'tDRXQhD8jeYNoaCgpi9WgvgPin4MpR0Lw1UMP4M1cms=',
    M: 'P4Z0m5CITNn6ZAQYtdI/9CD7VzTRTWCZdnXo6uMmDx4=',
    HAMK: 'c2MxOSLh2s7HLswhhL5e5XLsE22T8tWqtx08/BcTn64=',
    s: 'J8FisigrnTPgreeoQdYA0bMOv/xbs/wysk1B6cAjumg=',
    I: '12@gmail.com',
  },
];

describe('SRP methods', () => {
  describe('genA', () => {
    for (var i=0; i<srpTestCases.length; i++) {
      const testCase = srpTestCases[i];
      it(`should generate valid A from a for test case ${i+1}`, () => {
        const a_num = BigInt(testCase.a);
        const result = genA(params[testCase.paramKey], Buffer.from(a_num.toString(16), 'hex'));
        
        const A_num = BigInt(testCase.A);
        console.log(`Test case: ${i} - A num: ${A_num.toString(16)}`)
        assert.strictEqual(result, A_num.toString(16));
      });
    }
  });

  describe('getu', () => {
    for (var i=0; i<srpTestCases.length; i++) {
      const testCase = srpTestCases[i];
      it(`should generate valid u from A, B for test case ${i+1}`, () => {
        const A_buf = bigIntToBuffer(bigInt(testCase.A), Math.ceil(bigInt(testCase.A).bitLength() / 8));
        const B_buf = bigIntToBuffer(bigInt(testCase.B), Math.ceil(bigInt(testCase.B).bitLength() / 8));
        const actualu = getu(params[testCase.paramKey], A_buf, B_buf);

        const expectedu = bigInt(testCase.u)
        assert.strictEqual(expectedu.toString(16), actualu);
      });
    }
  });

  describe('getk', () => {
    for (var i=0; i<srpTestCases.length; i++) {
      const testCase = srpTestCases[i];
      it(`should generate a valid k for test case ${i+1}`, () => {
        const actualk = getk(params[testCase.paramKey]);

        const expectedk = bigInt(testCase.k);
        assert.strictEqual(expectedk.toString(16), actualk);
      });
    }
  });

  describe('getS', () => {
    for (var i=0; i<srpTestCases.length; i++) {
      const testCase = srpTestCases[i];
      it(`should generate a valid S for test case ${i+1}`, () => {
        const k_buf = bigIntToBuffer(bigInt(testCase.k), Math.ceil(bigInt(testCase.k).bitLength() / 8));
        const x_buf = bigIntToBuffer(bigInt(testCase.x), Math.ceil(bigInt(testCase.x).bitLength() / 8));
        const a_buf = bigIntToBuffer(bigInt(testCase.a), Math.ceil(bigInt(testCase.a).bitLength() / 8));
        const B_buf = bigIntToBuffer(bigInt(testCase.B), Math.ceil(bigInt(testCase.B).bitLength() / 8));
        const u_buf = bigIntToBuffer(bigInt(testCase.u), Math.ceil(bigInt(testCase.u).bitLength() / 8));
        const actualS = getS(params[testCase.paramKey], k_buf, x_buf, a_buf, B_buf, u_buf);

        const expectedS = bigInt(testCase.S);
        assert.strictEqual(expectedS.toString(16), actualS);
      });
    }
  });

  describe('getK', () => {
    for (var i=0; i<srpTestCases.length; i++) {
      const testCase = srpTestCases[i];
      it(`should generate a valid K for test case ${i+1}`, () => {
        const S_buf = bigIntToBuffer(bigInt(testCase.S), Math.ceil(bigInt(testCase.S).bitLength() / 8));
        const actualK = getK(params[testCase.paramKey], S_buf.toString('hex'));

        const expectedK = testCase.K;
        assert.strictEqual(expectedK, actualK.toString('base64'));
      });
    }
  });

  describe('getM', () => {
    for (var i=0; i<srpTestCases.length; i++) {
      const testCase = srpTestCases[i];
      it(`should generate a valid M for test case ${i+1}`, () => {
        const I_buf = Buffer.from(testCase.I);
        const s_buf = Buffer.from(testCase.s, 'base64');
        const A_buf = bigIntToBuffer(bigInt(testCase.A), Math.ceil(bigInt(testCase.A).bitLength() / 8));
        const B_buf = bigIntToBuffer(bigInt(testCase.B), Math.ceil(bigInt(testCase.B).bitLength() / 8));
        const K_buf = Buffer.from(testCase.K, 'base64');
        const actualM = getM(params[testCase.paramKey], I_buf, s_buf, A_buf, B_buf, K_buf);

        const expectedM = Buffer.from(testCase.M, 'base64');
        assert.isTrue(expectedM.equals(actualM));
      });
    }
  });

  describe('getHAMK', () => {
    for (var i=0; i<srpTestCases.length; i++) {
      const testCase = srpTestCases[i];
      it(`should generate a valid HAMK for test case ${i+1}`, () => {
        const A_buf = bigIntToBuffer(bigInt(testCase.A), Math.ceil(bigInt(testCase.A).bitLength() / 8));
        const M_buf = Buffer.from(testCase.M, 'base64');
        const K_buf = Buffer.from(testCase.K, 'base64');
        const actualHAMK = getHAMK(params[testCase.paramKey], A_buf, M_buf, K_buf);

        const expectedHAMK = Buffer.from(testCase.HAMK, 'base64');
        assert.isTrue(expectedHAMK.equals(actualHAMK));
      });
    }
  });
});
