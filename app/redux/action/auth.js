import axios from 'axios';
import {CALL_API} from "../../config/";
import {Toast } from 'native-base';


export const LOGIN = 'LOGIN';
export const ERROR = 'ERROR';
export const FORGOT='FORGOT';
export const LOGOUT='LOGOUT';
export const SUCCESS='SUCCESS';
export const REGISTER='REGISTER';
export const RESENDOTP='RESENDOTP';
export const VERIFYOTP='VERIFYOTP';
export const PROFILE='PROFILE';
export const CHATDATA='CHATDATA';
export const CHANGEDATA='CHANGEDATA';






const notify = (message,type) => {
  Toast.show({
    text: message ,
    buttonText: "Okay",
    duration: 3000,
    position: "top",
    type

  })

}


export const logoutAction=()=>{
return async  (dispatch, getState) => {     
  dispatch({type:LOGOUT})
}
}


const checkEmail=(em)=>{
if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(em))
{
    return (true)
}
return (false)
}



export const RegisterAction = (em,pass,countrycode,phonenumber,token) => {
  return async  (dispatch, getState) => {  
    var data = new FormData();
      data.append("action","register");
    data.append("email",em.toLowerCase());
    data.append("password",pass);
    data.append("countrycode",countrycode);
    data.append("phonenumber",phonenumber);
    data.append("devicetoken",token);
    
    dispatch({type:"showloading",paylod:true});

  CALL_API("post","Customer/register",data).then((res)=>{
    console.log(res.data);
    if(res.data.status==200){        
      dispatch({type:"ErrorRegister",paylod:false});
      dispatch({type:REGISTER,paylod:res.data});
      notify(res.data.message,"success");

    }else{
    dispatch({type:"ErrorRegister",paylod:true});

      
      notify(res.data.message,"danger");
    }
    setTimeout(()=>{
              dispatch({type:"hideloading",paylod:true});
              },1000);

}).catch((err)=>{
  dispatch({type:"hideloading",paylod:true});
});

}
}


export const VerifyOtp = (phonenumber,countrycode,otp) => {
  return async  (dispatch, getState) => {  
        var data = new FormData();
          data.append("action","verifyotp");
        data.append("countrycode",countrycode);
        data.append("phonenumber",phonenumber);
        data.append("otp",otp);
    
        dispatch({type:"showloading",paylod:true});
    
    CALL_API("post","Customer/Verifyotp",data).then((res)=>{
        console.log(res);
        if(res.data.status==200){        
        dispatch({type:VERIFYOTP,paylod:true});
        notify(res.data.message,"success");
  
        }else{
          dispatch({type:VERIFYOTP,paylod:false});
          notify(res.data.message,"danger");
        }
          setTimeout(()=>{
              dispatch({type:"hideloading",paylod:true});
              },1000);

    }).catch((err)=>{
      dispatch({type:"hideloading",paylod:true});
    });
  }
  }
  
  


export const ResendOtp = (phonenumber,countrycode) => {
  return async  (dispatch, getState) => {  
        var data = new FormData();
          data.append("action","resendotp");
        data.append("countrycode",countrycode);
        data.append("phonenumber",phonenumber);
    dispatch({type:"showloading",paylod:true});
    CALL_API("post","Customer/Resendotp",data).then((res)=>{
        console.log(res.data);
        if(res.data.status==200){        
        dispatch({type:RESENDOTP,paylod:res.data});
        notify(res.data.message,"success");
  
        }else{
          notify(res.data.message,"danger");
        }
            setTimeout(()=>{
              dispatch({type:"hideloading",paylod:true});
              },1000);

    }).catch((err)=>{
      dispatch({type:"hideloading",paylod:true});
    });
  }
  }
  
  


export const LoginAction = (em,pass,token) => {
return async  (dispatch, getState) => {  
      var data = new FormData();
        data.append("action","login");
      data.append("email",em);
      data.append("password",pass);
      data.append("devicetoken",token);
      dispatch({type:"showloading",paylod:true});
      CALL_API("post","Customer/login",data).then((res)=>{
      console.log(res.data);
      if(res.data.status==200){        
      dispatch({type:LOGIN,paylod:res.data.data});
      notify(res.data.message,"success");

      }else{
        notify(res.data.message,"danger");
      }
    setTimeout(()=>{
              dispatch({type:"hideloading",paylod:true});
              },1000);

      
    }).catch((err)=>{
      dispatch({type:"hideloading",paylod:true});
    });
}
}


export const GetProfile = (id) => {
  return async  (dispatch, getState) => {  
        var data = new FormData();
          data.append("action","getcustomerprofile");
          data.append("id_customer",id);
    dispatch({type:"showloading",paylod:true});
        
      CALL_API("post","Customer/getcustomerprofile",data).then((res)=>{
        console.log(res)
        if(res.data.status==200){        
        dispatch({type:PROFILE,paylod:res.data.data});
        notify(res.data.message,"success");
        }else{
          notify(res.data.message,"danger");
        }
    setTimeout(()=>{
              dispatch({type:"hideloading",paylod:true});
              },1000);
        
      }).catch((err)=>{
        dispatch({type:"hideloading",paylod:true});
      });
  }
  }
  



  export const passChange = (oldpassword,newpassword,confirmpassword,id_customer) => {
    return async  (dispatch, getState) => {  
          var data = new FormData();
            data.append("action","changepassword");
            data.append("oldpassword",oldpassword);
            data.append("newpassword",newpassword);
            data.append("id_customer",id_customer);
            data.append("confirmpassword",confirmpassword);
    dispatch({type:"showloading",paylod:true});
          
        CALL_API("post","Customer/changepassword",data).then((res)=>{
          console.log(res)
          if(res.data.status==200){        
          // dispatch({type:PROFILE,paylod:res.data.data});
          notify(res.data.message,"success");
          }else{
            notify(res.data.message,"danger");
          }
    setTimeout(()=>{
              dispatch({type:"hideloading",paylod:true});
              },1000);
          
        }).catch((err)=>{
          dispatch({type:"hideloading",paylod:true});
        });
    }
    }
    
  
    
  export const SaveProfile = (fname,lname,email,id_customer,countrycode,phonenumber,image) => {
    return async  (dispatch, getState) => {  
          var data = new FormData();
            data.append("action","editprofile");
            data.append("fname",fname);
            data.append("lname",lname);
            data.append("id_customer",id_customer);
            data.append("email",email);
            data.append("countrycode",countrycode);
            data.append("phonenumber",phonenumber);
            data.append("image",image);
            dispatch({type:"showloading",paylod:true});
          
        await CALL_API("post","Customer/editprofile",data).then((res)=>{
          console.log(res)
          if(res.data.status==200){        
          dispatch({type:PROFILE,paylod:res.data.data});
          notify(res.data.message,"success");
          }else{
            notify(res.data.message,"danger");
          }
        setTimeout(()=>{
              dispatch({type:"hideloading",paylod:true});
              },1000);

          return "success";          
        }).catch((err)=>{
          dispatch({type:"hideloading",paylod:true});
        });
    }
    }

    
    
    export const Getmessagebycustomerid = (id_customer) => {
      return async  (dispatch, getState) => {  
            var data = new FormData();
              data.append("action","getmessage");
              data.append("id_customer",id_customer);
            dispatch({type:"showloading",paylod:true});
               
          await CALL_API("post","message/Getmessagebycustomerid",data).then((res)=>{
            console.log(res)
            if(res.data.status==200){      
              
            dispatch({type:CHATDATA,paylod:res.data.data});
            // notify(res.data.message,"success");
            }else{
              notify(res.data.message,"danger");
            }
          setTimeout(()=>{
              dispatch({type:"hideloading",paylod:true});
              },1000);

            return "success";          
          }).catch((err)=>{
            dispatch({type:"hideloading",paylod:true});
          });
      }
      }
  


  
      
      export const addMessage = (id_customer,message) => {
        return async  (dispatch, getState) => {  
              var data = new FormData();
                data.append("action","addmessage");
                data.append("id_sender",id_customer);
                data.append("message",message);
    dispatch({type:"showloading",paylod:true});
                
                 
            await CALL_API("post","message/Addmessage",data).then((res)=>{
              console.log(res)
              if(res.data.status==200){      
                
              // dispatch({type:CHATDATA,paylod:res.data.data});
              // notify(res.data.message,"success");
              }else{
                notify(res.data.message,"danger");
              }
    setTimeout(()=>{
              dispatch({type:"hideloading",paylod:true});
              },1000);

              return "success";          
            }).catch((err)=>{
              dispatch({type:"hideloading",paylod:true});
            });
        }
        }
    
        


        
export const changeData = (data) => {
  return async  (dispatch, getState) => {  
    dispatch({type:LOGIN,paylod:data});
  }
  }
  
  