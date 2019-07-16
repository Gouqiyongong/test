// function print(n){
//   setTimeout(() => {
//     let arr = []
//     // setTimeout(() => {
//     //   console.log(n);

//     // }, n * 1000 + 1000);
//   }, Math.floor(Math.random() * 1000));
// }
// for(var i = 0; i < 100; i++){
//   print(i);
// }

function print(n) {

  setTimeout( (() => {
      console.log(n);
      return 1;
  })(), Math.floor(Math.random() * 1000));
}
for(var i = 0; i < 100; i++){
  print(i);
}