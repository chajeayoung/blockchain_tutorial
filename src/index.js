import Caver from "caver-js";
import {Spinner} from "spin.js";

const config = { //config 안에 rpcURL이있는데 우리가 어떤 클레이튼노드에 연결해서 쓸지 여기서 정의
  //바오밥테스트넷함
  rpcURL: 'https://api.baobab.klaytn.net:8651'
}
//그리고 rpcurl을 caver 생성자에 넘겨 인스턴스화 시키는 함수를 만들자
const cav = new Caver(config.rpcURL);

const agContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
//두개를 넘겼는데 Deployed abi ,address 는 bapp내에서 쓸수있는 전역상수입니다.
//배포하면서 두파일에 정보를 저장하게되는데 그 정보들을 읽어서 전역상수로 쓰일수있게 webpack에서 setting 한다!

const App = {

//3. start 함수 꾸미기전에 start함수에서는 session이라는것을 통해 계정인증을한적이 있는지 확인을 해야함
// 그런데 세션 사용하는부분이 나중에있어서 일단 start를 공백으로나두고 handleImportㅜ터 구현
  
auth: {
  accessType : 'keystore', //인증방식 프라이버리키 or keystore 방식
  keystore : '', //keystore 파일의 전체 정보를 저장 
  password: '' //keystore 파일과 조합된 비밀번호를 담는필드
},

  start: async function () {
  //새로고침시 계정정보가 초기화댐
  //로그인에 성공시 세션 스토리지에 계정정보를 저장한다. 
  //Bapp 이 실행하면서 제일먼저 실행되는게 start함수이다. 여기에서 session storage에 저장된 내 계쩡정보를 들고온다.
  
  const walletFromSession = sessionStorage.getItem('walletInstance');
  //getItem을 써서 key값을 넘기면 쌍으로 저장된 value값을 들고오고 그것을 const 상수에 저장시킨다. 
  //즉 내월렛 정보를 저장해놓은것

  //다음으로 그 상수에 정보가 들어가있는지 확인한다.
  if(walletFromSession){
    try{
      cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
      //cav wallet에 내 계정정보를 저장합니다. 어떤정보를 Session에있던 계정정보를!
      //왜 ? 새로고침시 다지워지니깐 있다면 다시 유지하기위해

      this.changeUI(JSON.parse(walletFromSession));
      //다음으로 로그인되었다는 상태를 보여주기위해 UI를 업데이틀 해줍니다.


    }catch(e){// 마지막으로 session storage에 있던 값이 유효한 인스턴스값이 아닐경우 catch문 실행한다.
      sessionStorage.removeItem('walletInstance');

    }
  }


  },

  //4. keystore 유효한지확인함
  handleImport: async function () {
  
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0]);
    //우리가선택한 파일을 뜻함
    fileReader.onload = (event) => {
        //이 받은 키스토퍼알이 유효한지 확인함
      try{
        if(!this.checkValidKeystore(event.target.result)){
           $('#message').text('유효하지 않은 keystore 파일입니다.');
         return;
         }
        this.auth.keystore = event.target.result;
         $('#message').text('keystore 통과, 비밀번호를 입력하세요.');
       document.querySelector('#input-password').focus();


      }catch(event){
        $('#message').text('유효하지 않은 keystore 파일입니다.22');
        return;
      }
    }
  },

  handlePassword: async function () {
    this.auth.password = event.target.value;
    //html 언체이지 이벤트를통해 비밀번호값을 가져오고
    //전역변수  auth.password에 대입함.
  },

  handleLogin: async function () {
    if(this.auth.accessType === 'keystore'){
      try{
         const privateKey = cav.klay.accounts.decrypt(this.auth.keystore, this.auth.password).privateKey;
         // cav 인스턴스의 acoounts 멤버를통해 decrypt함수를 쓸수있습니다.(해독) keystore파일의 내용과
         // 비밀번호를 인자로 넘겨서 decrypt된 오브젝트를 반환받을수있습니다. 그오브젝트안에는 여러가지 멤버가있는데
         // 그중에서 private Key를 가져와서 이 상수에 저장시키는것이다.

         //인증되면
        this.integrateWallet(privateKey);
        // //이 함수에 privateKey를 넘긴다.
        $('#message').text('통과');
        
      }catch(e){
        $('#message').text('비밀번호가 일치하지 않습니다.');
      }
    }

  },

  handleLogout: async function () {
    this.removeWallet();
    // 이 함수를 통해 Wallet을 clear를 시키고 session storage를 clear 시킨다.

    //페이지 새로고침해준다 UI 새로고침
    location.reload();

  },

  generateNumbers: async function () {
    var num1 = Math.floor(Math.random() * 50)+10 ; // 0 ~ 1아래의 소수랜덤
    var num2 = Math.floor(Math.random() * 50)+10 ; // 0 ~ 1아래의 소수랜덤

    sessionStorage.setItem('result', num1 + num2); // 위에 더한값의 결과를 session에다가 올려준다.

    //start를 누르면 start 부분을 감추는부분
    $('#start').hide();
    // 랜덤 생성된 숫자를 보이게 하는 부분
    $('#num1').text(num1);
    $('#num2').text(num2);
    $('#question').show();
    //정답 부분으로 포커스 이동
    document.querySelector('#answer').focus();

    this.showTimer();
  },

  submitAnswer: async function () {
    //정답을 session storage에 저장한값을 들고온다.
    const result = sessionStorage.getItem('result');
    var answer = $('#answer').val();//사용자가 제출한 답
   
    if(answer === result){
      //정답을 맞추었다면 
      //메시지를 보내고 확인버튼을 누르면 유저에게 klay를 송금하는 부분
      if(confirm("대단하네요^^ 0.1 KLAY 받기")){//확인취소있는 버튼
        if(await this.callContractBalance() >= 0.1){ // onwer 계좌에 0.1 klay이상있는지 확인
          this.receiveKlay();
        }else{//없다면
            alert("죄송합니다. 컨트랙의 KLAY가 다 소모되었습니다.");

        }
      }
    }else{
      alert("땡! 초등학생도 하는데 ㅠㅠ");
    }
  },

  deposit: async function () {
    var spinner = this.showSpinner();



    // 어떻게 구현할것이냐면
    // contract으로 kaly송금 하는것은 무조건 owner 계정만 할수있다
    // 즉 배포한사람만 접근가능, 주최자만 가능!
    // 그사람이라면 contract에 deposit함수에 접근하는 것이다.

    //먼저 배포했던 컨트랙에 접근할수 있도록 인스턴스를 하나 만든다.
    // ABI 정보와 주소가 필요함 맨위에 const agContrat = new cav.klay.Contract(DEPLOYED_ABI,DEPLOYED)~~


    //송금하기전에 제일먼저 owner 계정인지 확인해야합니다.
    // 1. 현재 로그인된 계정정보
    const walletInstance = this.getWallet();
    // 2. contract에 저장된 owner 계정정보를 들고온다.
    if(walletInstance){ //getWallet가 로받은 인스턴스가 존재한다면 
      //로그인된 계정주소와 컨트랙에서 불러온 owner 계정을 비교해본다.
      if(await this.callOwner() !== walletInstance.address) return;
      else{//다르면 return 같으면 진행
        var amount = $('#amount').val();
        if(amount){
          agContract.methods.deposit().send({
              //3가지를 적어야함
              from: walletInstance.address,
              gas : '250000',
              value: cav.utils.toPeb(amount, "KLAY")
          })
          .once('transactionHash',(txHash) => {
            console.log(`txHash : ${txHash}`); //`` 임 ''아님
          })

          //영수증 발행
          .once('receipt', (receipt) => {
              console.log(`(#${receipt.blockNumber})`,receipt);  
              spinner.stop();
              alert(amount + "KLAY를 컨트랙에 송금했습니다.");
           
              location.reload();
          })
          //receipt를 받으면 트랜잭션에 성공적으로 블록이 추가되었다는 뜻 어느블록에 추가되었는지도 확인가능

          //마지막으로 트랜잭션처리가 실패되었다면 error 를 리턴 받을수있습니다.
          .once('error', (error) => {
            alert(error.message);
          });



        }
        return;
      }


    }

  },

  callOwner: async function () {
    return await agContract.methods.owner().call();
    //우리가만든 additionGame Contract instacne를 통해 onwer 함수에 접근하고 값을 들고온다.
    //await 키워드를 사용해 비동기로 값을 받았음.
  },

  callContractBalance: async function () {
    return await agContract.methods.getBalance().call();
  },

  getWallet: function () {
    //현재 caverwallet에 존재하는 내 계정정보를 가져온다.

    if(cav.klay.accounts.wallet.length){//어떤 길이가있다면? 그럼 계쩡이 추가되 있는것 그것을 들고온다.
      return cav.klay.accounts.wallet[0]; // wallet[0] 인덱스는 월렛에 추가되어있는 계정들중 제일첫번째 계정 즉 지금 내가로그인 되어있는 계정을 말함
    }

  },

  checkValidKeystore: function (keystore) {
    const parsedKeystore = JSON.parse(keystore);
    const isValidKeystore = parsedKeystore.version &&
     parsedKeystore.id &&
     parsedKeystore.address &&
     parsedKeystore.crypto;

     return isValidKeystore;
  },

  integrateWallet: function (privateKey) {
      const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
      // 이 walletinstace가 내 계정정보를 가지고있다. 이 인스턴스를 wallet에 추가해야한다. 
      //바로아래에
      cav.klay.accounts.wallet.add(walletInstance);
      //cav wallet에 내계저을 추가해놓으면 앞으로 어떤 트랜잭션을 생성하게 될때 쉽게 내계정정보를 
      //cav instacne를 통해 다시 불러와서 트랜잭션을 처리할수있습니다.

      //이 것을 session에 올려준다.
      sessionStorage.setItem('walletInstance',JSON.stringify(walletInstance));
      //이 setItem은 key value를 쌍으로 받는다. 첫번재 값이 key 두번재 값이 value이다.
      //나중에 내가 session으로 내 계정정보를불러올때이 key값만 불러온다. 

      //sessionStorage를 쓰는이유는 계정의로그인되는 상태를 계속유지하기위해서이다.
      //cav.klay.accounts.wallet에 저장된 내 정보는 내가 다른 사이트나 페이지를 새로고침하면 정보가 날아간다.
      //하지만 sessionStorage에 저장하면 다른사이트를 갔다오거나 새로고침되어도  계쩡정보가 유지가된다.
      //그래서 나중에 start 함수에서 wallet instace 세션을 불러오고 로그인된 상태를 게속유지하도록 구현할것이다.
      
      this.changeUI(walletInstance);

  },

  reset: function () {
    //auth 변수를초기화시킨다.
    this.auth = {
   
      keystore : '', //keystore 파일의 전체 정보를 저장 
      password: '' //keystore 파일과 조합된 비밀번호를 담는필드
    
      
    }

  },

  changeUI: async function (walletInstance) {
    $('#loginModal').modal('hide');
    $('#login').hide();
    $('#logout').show();
    $('#game').show();
    $('#address').append('<br>'+'<p>'+'내 계정 주소 : '+walletInstance.address+'</p>');
    $('#contractBalance').append('<p>'+'이벤트 잔액 : '+cav.utils.fromPeb(await this.callContractBalance(),"KLAY")+' KLAY' +'</p>');
    //html에서 contract잔액을 보여주는 부분에 message를 추가할껀데 callContractBalance를 불러와서 잔액을 일단 가져오고
    //그잔액이 KLAY단위중 최소단위인 peb로 불러와진다 그럼 사용자입장에서 보기힘드니 cav.utils.fromPeb로 KLAY로 변환해준다.

    if(await this.callOwner() === walletInstance.address){
      $('#owner').show();
      //owner계정주소와 로그인된 계정주소가 같을때만 owner div를 보여주도록 설정
    }
  },

  removeWallet: function () {
    cav.klay.accounts.wallet.clear();
    sessionStorage.removeItem('walletInstance');
    this.reset();
    //reset함수에서는 전역변수를 auth를 초기화 시켜준다
  },

  showTimer: function () {
    //setInter 함수를 이용해 카운트다운 하는것을보여주며
    //3초가 지나면 문제가 안보이도록하고 다시 시작 클릭하는 부분으로 되돌리는 함수

    var seconds = 3; // 타이머 초설정
    $('#timer').text(seconds);

    var interval = setInterval(() => {
      $('#timer').text(--seconds);

      if(seconds<=0){//0초되면 리셋
        $('#timer').text('');
        $('#answer').val('');
        $('#question').hide();
        $('#start').show();
        clearInterval(interval); // 시간을 멈추게한다.
      }
    }, 1000); //1000 이 1초이다.
  },

  showSpinner: function () {
    var target = document.getElementById("spin");
    return new Spinner(opts).spin(target);
  },

  receiveKlay: function () { //유저가 정답을 맞췄을때 kaly받는 함수
    var spinner = this.showSpinner(); // 트랜잭션처리 동안 spinner을 통해 로딩중이라는것을 보여줌
    const walletInstance = this.getWallet();// 트랜잭션에 필요한 인증된 계정주소를 필요하기때문에 월렛인스턴스를 불러온다.

    if(!walletInstance) return; // 계정정보가없다면 종료
    //있다면 contrat에 transfer함수에 접근한다.
    agContract.methods.transfer(cav.utils.toPeb("0.1","KLAY")).send({ // 0.1KLAY를 Peb로 변환해서 전송
      from:walletInstance.address,        //계정인증된 나의 주소를 넘기고
      gas:'250000'                        //가스는 25만안에서 사용 여기서는 value필드 필요없음 왜냐하면 transfer함수 의 type이 payable이 아니기때문
    }).then(function (receipt){
        if(receipt.status){//true 성공한것
          
            spinner.stop(); //성공했으니 로딩 멈추고
          
            alert("0.1 KLAY가" + walletInstance.address+"계정으로 지급되었습니다.");
            //트랜잭션으로 처리된것을 링크로 확인할수있게하기위해 
            $('#transaction').html(""); //초기화하고
            $('#transaction')           
            .append(`<p><a href='https://baobab.scope.klaytn.com/tx/' 
              target='_blank'>클레이튼 Scope에서 트랜잭션 확인</a></p>`);
              //update된 잔액을 html에서 보이게해준다.
              return agContract.method.getBalance().call()
              .then(function (balance){
                $('#contractBalance').html("");
                $('#contractBalance').append('<p>'+'이벤트 잔액:'+cav.utils.fromPeb(balance,"KLAY")+'KLAY'+'</p>');
                
              })
      }
    })
  }
};

window.App = App;

window.addEventListener("load", function () {
  // 1. 페이지가 로드될때 제일먼저 App상수안에 start함수를 실행시킴
  App.start();
});

var opts = { //로딩할때 스피너을 보여주는 환경변수

  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#5bc0de', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};