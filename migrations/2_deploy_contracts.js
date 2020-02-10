const fs = require('fs')
const AdditionGame = artifacts.require('./AdditionGame.sol')

module.exports = function (deployer) {
  deployer.deploy(AdditionGame)

  //AdditionGame Contract를 가져와서 처리한다.
  // 기본적인 배포 과정은끝

  // 여기서 배포중 얻을수있는 정보를 bApp 내 어떤 파일에 저장할수있다.
  // 나중에 그정보를 컨트랙 인스턴스 만들대 유용하게 쓸수있습니다.
  
  //deploy가 AdditionGame을 Conract를 deploy하고나서 then을 통해
  // promiss?로 JSon 데이터를 받습니다. 
    .then(() => {
        if(AdditionGame._json){
            //additiong.json파일을 받았다면
            // 파일시스템모듈을 통해 파일에다가 저장할거입니다.
            //그럴러면 input 시켜야함 
            //const fs = require('fs') 맨위에

            fs.writeFile('deployedABI',JSON.stringify(AdditionGame._json.abi),
            // fs안에 writeFile이있는데 두가지를 넘긴다.
            // 첫번째는 어떤파일에다가 이것을 쓸건지 정의
            // 두번재는 json으로 받은 이 abi정보를 String화시켜서 인자로 넘긴다.
            

            //마지막으로 에러처리
            (err)=>{ 
                if(err) throw err;
                 console.log("파일에 ABI 입력 성공!");
                 }
              )

              fs.writeFile('deployedAddress',AdditionGame.address,   
              (err) => {
                  if(err) throw err;
              console.log("파일에 주소입력 성공");
              
            //여기까지하면 매번 배포할때 우리가 원하는 정보를 각 파일에다가 저장할수있게됨
          }
         
         )

        }
    })

}
