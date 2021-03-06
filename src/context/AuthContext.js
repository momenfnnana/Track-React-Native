import { AsyncStorage } from "react-native";
import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";
import { navigate } from "../navigationRef";
const authReducer = (state, action) => {
  switch (action.type) {
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "clear_Error_Message":
      return { ...state, errorMessage: "" };
    default:
      return state;
  }
};
// facade pattern
const tryLocalSignin = dispatch =>async()=>{
const token = await AsyncStorage.getItem('token');
if(token){
  dispatch({type:'signin',payload:token})
  navigate('MainFlow');
}else{
  navigate('AuthFlow')
}
}
// facade pattern
const clearErrorMessage = dispatch => () => {
  dispatch({
    type: "clear_Error_Message"
  });
};
// facade pattern
const signup = dispatch => async ({ email, password }) => {
  try {
    const response = await trackerApi.post("/signUp", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signin", payload: response.data.token });
    navigate("MainFlow");
  } catch (err) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign up"
    });
  }
};
// facade pattren
// There is a complex code to connect user with application after athuntication we write this just one place and reuse it in another places(loginScreen.js)
const signin = dispatch => async ({ email, password }) => {
  try {
    const response = await trackerApi.post("/signIn", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signin", payload: response.data.token });
    navigate("MainFlow");
  } catch (err) {
    console.log(err);
    dispatch({
      type: "add_error",
      payload: "Someting went wrong with sign in"
    });
  }
};
// facade pattern
const signout = dispatch =>{
  return async()=>{
    await AsyncStorage.removeItem('token','');
    dispatch({type:'sign_out'})
    navigate('AuthFlow')
  }
}
export const { Provider, Context } = createDataContext(
  authReducer,
  { signup, signin, signout, clearErrorMessage, tryLocalSignin},
  { token: null, errorMessage: "" }
);
