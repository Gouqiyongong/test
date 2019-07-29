export default function(){
	let search = location.search;
	search += (search.indexOf('?') > -1 ? '&refresh_t=' + Date.now() : '?refresh_t=' + Date.now());
	location.replace(location.origin + location.pathname + search + location.hash);
}