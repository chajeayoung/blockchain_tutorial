// truffle.js config for klaytn.
// 마지막으로환경설정을해야하는데 배포를할때 어느 네트워크에다가
// 할건지 정해야합니다.

const PrivateKeyConnector = require('connect-privkey-to-provider')
const NETWORK_ID = '1001'
const GASLIMIT = '20000000'
const URL = 'https://api.baobab.klaytn.net:8651'
const PRIVATE_KEY = '0x0963f718191cc438836db9b69c4290ea9618d329a48a250cd6653ecd77dc6839'
 // 싱글 따옴표 안에 자신의 프라이빗 키 입력하세요.

// 스마트 컨트랙트를 배포할 수 있는 간단한 기본 설정
module.exports = {
    networks: { // 네트워크는 클레이튼을쓰고 안에다가 4가지의 옵션을씀
        klaytn: {
            provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
            //먼저 프로바이더 즉 클레이튼 노드를 제공하는 공급자를 명시
            //프라비키 커넥터로 두개의 인자를넘김
            //1. 내게정의 비밀키, 2클레이튼이돌아가는 URL
            network_id: NETWORK_ID,    
            gas: GASLIMIT,
            gasPrice: null,
        }
    },
}