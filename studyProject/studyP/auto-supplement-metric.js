module.exports = function(content) {
  if(!content.includes('/Book/Detail')) return content;
  return content.replace(new RegExp(/(v-for)[^"|']+("|')[^"|']+("|')/,'g'),function(res) {
    try{
      const value = res.split('"')[1].match(/[$_\w]+/)[0];
      const addEvent = `
        @touchstart="
        window.metric=${value}.metric;
        window.infoId=${value}.infoId;
        window.bookId=${value}.bookId;
        "
       `;
      return res + addEvent;
    }catch(e){
      console.log('\n',e,'\n');
      return res;
    }
  });
};
