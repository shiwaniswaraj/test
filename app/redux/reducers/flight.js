import { AIRPORT_SEARCH,AIRCRAFT_LIST,AIRCRAFT_DETAIL,TRIPS,BOOKING,PRICECAL } from '../action/flight';
const initState = {
  loading:false,
  price_cal:[],
  flightLoading: false
}

const reducer = (state = initState, action) => {
    switch (action.type) {
      case AIRPORT_SEARCH:
        return {
          ...state,
          airport_list:action.paylod,
        };
        case "reset":
          return {
            ...state,
            aircraft_list:action.paylod,
          };
        case "HOMEDEAL":
          return {
            ...state,
            homedeal:action.paylod,
          };
        case PRICECAL:
          return {
            ...state,
            price_cal:action.paylod,
          };
        case "showloading":
          return{
            ...state,
            loading:true
          };
          case "hideloading":
          return{
            ...state,
            loading:false
          }
          case "flightLoading":
          return{
            ...state,
            flightLoading:action.paylod
          }
        case TRIPS:
          return {
            ...state,
            trips:action.paylod,
          };
        case BOOKING:
        return {
          ...state,
          isBooked:action.paylod,
        };
        
        case AIRCRAFT_DETAIL:
        return {
          ...state,
          aircarft_detail:action.paylod,
        };
        
       
        case AIRCRAFT_LIST:
          return {
            ...state,
            aircraft_list:action.paylod,
          };

          case "seaerchingAirpot":
            return{
              ...state,
              isSearching:action.paylod
            }
        
        default:
            return state;
        }
    }  

    export default reducer;