import axios from 'axios';
export const base_url="https://app.emcjet.com/api/";

export function CALL_API(method,url,data){
		if(data){
		return axios({
		  method: method,
		  url: base_url+url,
		  data: data,
		})
		// return axios[method](url+commonParams,data)
		}else{
			return axios({
			  method: method,
			  url: base_url+url
			})
		}
}

export function multiString(string,length){
		return length>1?string+"s":string;
}