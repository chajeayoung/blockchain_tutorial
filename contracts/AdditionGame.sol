pragma solidity >=0.4.24;

contract AdditionGame {
    address public owner;

    // 배포하는순간 운영자 계정에 주소를 저장할수있는
    // 컨트렉변수를 만듭니다.

    constructor() public {
        owner = msg.sender;
           //mseg.sender는 이 함수를 호출하고있는 사람을 뜻함
    }
    
    function getBalance() public view returns (uint) {//컨트랙에 잔액 불러오는 함수
        //function 키워드를 쓰고 가시성은 public을 썼고 type은 view로 써서 읽기전용이다.
        //uint형을 반환한다.
        
        return address(this).balance;
        // address(this) : 현재 컨트랙트 자신, 즉 AdditionGame 컨트랙을 말함
        // member로 balance를 접근가능
        // 이렇게하면 이 컨트랙주소에 클레이잔액을 불러 올수있는 함수
    }

    function deposit() public payable {//owner 계정에서 컨트랙주소로 클레이를 송금하는 함수
        // type payable 이다.
        // 계정에서 solidity 함수로 클레이를 보낼때 항상 payable이라는 타입을 붙여야합니다.
        // 그래야 함수에서 돈을 받을수 있음.

        //밑은 유효성체크 require키워드를 써서 이안에 조건문이 맞지않다면 함수를 종료하게 된다.
        // msg.sender 는 이함수를 호출한 계정 을 뜻하고 = 상태변수 owner 계정과 같다면 이함수를 실행
        require(msg.sender == owner);
    }   
  
    function transfer(uint _value) public returns (bool) {
        //컨트랙에서 사용자로 클레이를 보내는 함수
        require(getBalance() >= _value);
        msg.sender.transfer(_value);
        return true;
    }

    




}
