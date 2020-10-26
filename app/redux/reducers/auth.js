import { LOGIN,ERROR,FORGOT,LOGOUT,SUCCESS,RESENDOTP,REGISTER,PROFILE,VERIFYOTP,CHATDATA } from '../action/auth';
import AsyncStorage from '@react-native-community/async-storage';
const getData = async (storage_Key) => {
    const value = await AsyncStorage.getItem(storage_Key)
    console.log(value)
    if(storage_Key=="data"){
    return value?JSON.parse(value):null

    }
    return value?true:false
  }

const initState = {
	error:false,
  errorMsg:"",
  isLoggedin:false,
  otpverify:false,
  errorRegister:true,
  msg:[],
  loading:false
  

 };

const reducer = (state = initState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        data:action.paylod,
        isLoggedin:true,
        error:false,
      };
      case CHATDATA:
        return{
          ...state,
          msg:action.paylod,
        }
      case REGISTER:
      return{
          ...state,
          registerData:action.paylod
      }
      case VERIFYOTP:
        return{
          ...state,
          otpverify:action.paylod    
        }
      case RESENDOTP:
        return{
            ...state,
            optdata:action.paylod
        }
        case PROFILE:
          return{
              ...state,
              profiledata:action.paylod
          }
        
        
      case "ErrorRegister":
        return{
            ...state,
            errorRegister:action.paylod
        }
      
      case SUCCESS:
      return{
        ...state,
        data:action.paylod,
        error:false,
      }
      case LOGOUT:
      return {
        ...state,
        isLoggedin:false,
        data:null
      }
      case FORGOT:
      return{
        ...state,
        forgot:action.paylod,
        error:false
      }
      case "loading":
      return{
        ...state,
        loading:action.payload
        
      }
      case "SHOWREGISETMZG":
      return{
        ...state,
        registerMsg:action.paylod,
        error:true
      }
      break;
        case ERROR:
        return{
          ...state,
          error:true,
          errorMsg:action.paylod
        };
        break;
    default:
      return state;
  }
};

export default reducer;
