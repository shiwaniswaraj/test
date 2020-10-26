import {CALL_API} from "../../config/";
import {Toast } from 'native-base';
export const AIRPORT_SEARCH = 'AIRPORT_SEARCH';
export const AIRCRAFT_LIST = 'AIRCRAFT_LIST';
export const AIRCRAFT_DETAIL = 'AIRCRAFT_DETAIL';
export const TRIPS = 'TRIPS';
export const BOOKING = 'TRIPS';
export const PRICECAL = 'PRICECAL';


 
const notify = (message,type) => {
  Toast.show({
    text: message ,
    buttonText: "Okay",
    duration: 3000,
    position: "top",
    type

  })

}



export const searchAirport = (filter,pgNo,perPage) => {
    return async  (dispatch, getState) => {  
            var data = new FormData();
            data.append("filter",filter);
            data.append("pagenumber",pgNo);
            data.append("perpage",perPage);
            
            
          dispatch({type:"seaerchingAirpot",paylod:true});
             
        await CALL_API("post","Airpot/Getairpot",data).then((res)=>{
          // console.log(res)

          if(res.data.status==200){      
            
          dispatch({type:AIRPORT_SEARCH,paylod:res.data.data});
          // notify(res.data.message,"success");
          }else{
            // notify(res.data.message,"danger");
          }
          dispatch({type:"seaerchingAirpot",paylod:false});

          return "success";          
        })
    }
    }


    export const searchFlight = (data) => {
      return async  (dispatch, getState) => {  
              var fromdata = new FormData();
              fromdata.append("data",data);
              dispatch({type:"showloading",paylod:true});
            // dispatch({type:AIRCRAFT_LIST,paylod:null});
              
          await CALL_API("post","Airpot/Searchaircarft",fromdata).then((res)=>{
            
              setTimeout(()=>{
              dispatch({type:"hideloading",paylod:true});
              },1000);

              if(res.data.status==200){      
            dispatch({type:AIRCRAFT_LIST,paylod:res.data.data});
            // notify(res.data.message,"success");
            }else{
              // notify(res.data.message,"danger");
            dispatch({type:AIRCRAFT_LIST,paylod:[]});

            }

            
            return "success";          
          }).catch((err)=>{
            dispatch({type:"hideloading",paylod:true});
          });
      }
      }
    

      
    export const flightDetails = (id) => {
      return async  (dispatch, getState) => {  
              var fromdata = new FormData();
              fromdata.append("aircraftid",id);
              dispatch({type:"showloading",paylod:true});
                
          await CALL_API("post","Airpot/Aircraftdetail",fromdata).then((res)=>{
            
              setTimeout(()=>{
              dispatch({type:"hideloading",paylod:true});
              },1000);

              if(res.data.status==200){      
            dispatch({type:AIRCRAFT_DETAIL,paylod:res.data.data});
            // notify(res.data.message,"success");
            }else{
              // notify(res.data.message,"danger");
            }
            
            return "success";          
          }).catch((err)=>{
            dispatch({type:"hideloading",paylod:true});
          });
      }
      }
    
      export const getTrip = (id) => {
        return async  (dispatch, getState) => {  
                var fromdata = new FormData();
                fromdata.append("action","getcustomerbooking");
                fromdata.append("id_customer",id);
                dispatch({type:"showloading",paylod:true});
                  
            await CALL_API("post","Customer/Getcustomerbooking",fromdata).then((res)=>{
              setTimeout(()=>{
              dispatch({type:"hideloading",paylod:true});
              },1000);

              if(res.data.status==200){      
              dispatch({type:TRIPS,paylod:res.data.data});
              console.log(res.data.data);
              // notify(res.data.message,"success");
              }else{
                // notify(res.data.message,"danger");
              }

              return "success";          
            }).catch((err)=>{
              dispatch({type:"hideloading",paylod:true});
            });
        }
        }
      

        
      export const book = (data) => {
        return async  (dispatch, getState) => {  
                var fromdata = new FormData();
                // fromdata.append("action","getcustomerbooking");
                fromdata.append("data",data);
    dispatch({type:"showloading",paylod:true});
                  
            await CALL_API("post","Airpot/Addbooking",fromdata).then((res)=>{
                setTimeout(()=>{
                dispatch({type:"hideloading",paylod:true});
                },1000);  
              if(res.data.status==200){      
              dispatch({type:BOOKING,paylod:res.data.data});
              notify("Your Booking is created will keep in touch shortly","success");
              }else{
                // notify(res.data.message,"danger");
              }

              
              return "success";          
            }).catch((err)=>{
              dispatch({type:"hideloading",paylod:true});
            });
        }
        }
      

        
        
      export const getDealPrice = (startposition,endposition,time) => {
        return async  (dispatch, getState) => {  
                var fromdata = new FormData();
                // fromdata.append("action","getcustomerbooking");
        fromdata.append("action","getdealprice");
        fromdata.append("startposition",startposition);
        fromdata.append("endposition",endposition);
        fromdata.append("time",time);

    // dispatch({type:"showloading",paylod:true});
                  
            await CALL_API("post","Airpot/Getdealprice",fromdata).then((res)=>{
                setTimeout(()=>{
                // dispatch({type:"hideloading",paylod:true});
                },1000);  
                // console.log(res);
              if(res.data.status==200){      
              dispatch({type:PRICECAL,paylod:res.data.data});
              // notify(res.data.message,"success");
              }else{
                // notify(res.data.message,"danger");
              }

              
              return "success";          
            }).catch((err)=>{
              dispatch({type:"hideloading",paylod:true});
            });
        }
        }
      
        
      export const getDealHome = () => {
        return async  (dispatch, getState) => {  
                var fromdata = new FormData();
                fromdata.append("action","getdeals");        
                  dispatch({type:"showloading",paylod:true});
                  
            await CALL_API("post","Airpot/Getdeals",fromdata).then((res)=>{
                setTimeout(()=>{
                dispatch({type:"hideloading",paylod:true});
                },1000);  
                // console.log(res);
              if(res.data.status==200){      
              dispatch({type:"HOMEDEAL",paylod:res.data.data});
              // notify(res.data.message,"success");
              }else{
                // notify(res.data.message,"danger");
              }

              
              return "success";          
            })
        }
        }

        export const resetAircraft = () => {
          return async  (dispatch, getState) => {  
             dispatch({type:"reset",paylod:true})
          }
          }

        
         