import {TypedUseSelectorHook, useSelector} from 'react-redux'

import {RootReducerState} from '../modules/types'

const useTypedSelector: TypedUseSelectorHook<RootReducerState> = useSelector

export default useTypedSelector
