import createDataContext from './createDataContext'
const locationReducer = (state, action) => {
    switch (action.type) {
        case 'add_current_Location':
            // Prototype pattern
            // getting all property from state object inside another object and make changes to it
            return { ...state, currentLocation: action.payload }
        case 'start_recodrding':
            return { ...state, recording: true }
        case 'stop_recording':
            return { ...state, recording: false }
        case 'change_name':
            return { ...state, name: action.payload }
        case 'add_location':
            return { ...state, locations: [...state.locations, action.payload] }
        case 'reset':
            return { ...state, name: '', locations: [] }
        default:
            return state;
    }
}
const changeName = dispatch => (name) => {
    dispatch({ type: 'change_name', payload: name })
}
const startRecording = dispatch => (location) => {
    dispatch({ type: 'start_recodrding' })
}
const stopRecording = dispatch => () => {
    dispatch({ type: 'stop_recording' })
}
const addLocation = dispatch => (location, recording) => {
    dispatch({
        type: 'add_current_Location', payload: location
    })
    if (recording) {
        dispatch({
            type: 'add_location',
            payload: location
        })
    }
}
const reset = dispatch => () => {
    dispatch({ type: 'reset' })
}
export const { Context, Provider } = createDataContext(
    locationReducer,
    { startRecording, stopRecording, addLocation, changeName, reset },
    // The Observer Pattren
    // the main idea make changes in multiple places(screens) depneding on some state
    // if any changes happen inside this object will make changes in multiple other screens
    { name: '', recording: false, locations: [], currentLocation: null }
)