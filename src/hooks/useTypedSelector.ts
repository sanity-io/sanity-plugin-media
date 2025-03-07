import {type TypedUseSelectorHook, useSelector} from 'react-redux'

import type {RootReducerState} from '../modules/types'

const useTypedSelector: TypedUseSelectorHook<RootReducerState> = useSelector

export default useTypedSelector
