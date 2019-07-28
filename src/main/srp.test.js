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
];

describe('SRP methods', () => {
  describe('genA', () => {
    for (var i=0; i<srpTestCases.length; i++) {
      const testCase = srpTestCases[i];
      it(`should generate valid A from a for test case ${i+1}`, () => {
        const a_num = bigInt(testCase.a);
        const result = genA(params[testCase.paramKey], Buffer.from(a_num.toString(16), 'hex'));
        
        const A_num = bigInt(testCase.A);
        assert.strictEqual(A_num.toString(16), result);
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
